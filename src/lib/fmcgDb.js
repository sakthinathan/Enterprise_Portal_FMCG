// FMCG Enterprise Suite - Multi-Tenant Data Store & Cloud Database Adapter
// Connects to Supabase Cloud PostgreSQL with local offline caching

import { cloudStorage, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'fmcg_enterprise_suite_clean_v3';

export const THULIR_AGENCY = {
  id: 'thulir',
  name: 'Thulir Agencies',
  tradeName: 'FMCG Distribution & Super-Stockist',
  brands: ['ITC', 'HUL', 'Britannia', 'Nestle', 'Tata Consumer'],
  gstin: '33AAACT9821A1Z4',
  phone: '+91 98401 23456',
  email: 'admin@thulir.com',
  address: 'Main Godown Hub, Chennai',
  hubLocation: 'Main Godown Hub, Chennai',
  logoEmoji: '🏢'
};

const DEFAULT_CLEAN_DATA = {
  activeAgencyId: 'thulir',
  agencies: [THULIR_AGENCY],
  payrollConfig: {
    workingDaysInMonth: 26,
    weeklyOffDay: 'Sunday',
    defaultOtRatePerHour: 120,
    currentPeriod: 'October 2026',
    pfPercentage: 12,
    esiPercentage: 0.75
  },
  // CLEAN MULTI-TENANT STORAGE (No mock dummy records)
  employees: [],
  vehicles: [],
  stockItems: [],
  fmcgBrands: [],
  serviceLogs: [],
  fuelLogs: [],
  dispatchSheets: [],
  monthlyPayrollEntries: [],
  damagedAndExpiryGoods: []
};

class FMCGDatabase {
  constructor() {
    this.init();
  }

  init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.save(DEFAULT_CLEAN_DATA);
    } else {
      try {
        const parsed = JSON.parse(raw);
        // Ensure Thulir is included in agencies and active by default
        if (!parsed.agencies || !parsed.agencies.some(a => a.id === 'thulir')) {
          parsed.agencies = [THULIR_AGENCY, ...(parsed.agencies || [])];
        }
        if (!parsed.activeAgencyId || parsed.activeAgencyId === 'agency-01') {
          parsed.activeAgencyId = 'thulir';
        }
        this.save(parsed);
      } catch {
        this.save(DEFAULT_CLEAN_DATA);
      }
    }
  }

  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_CLEAN_DATA;
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CLEAN_DATA;
    }
  }

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  clearAllData() {
    this.save(DEFAULT_CLEAN_DATA);
    return DEFAULT_CLEAN_DATA;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Multi-Tenant Agency Management
  // ═════════════════════════════════════════════════════════════════════════
  getAllAgencies() {
    const data = this.get();
    return data.agencies || [];
  }

  getActiveAgency() {
    const data = this.get();
    const agency = data.agencies.find(a => a.id === data.activeAgencyId);
    return agency || data.agencies[0] || DEFAULT_CLEAN_DATA.agencies[0];
  }

  setActiveAgency(agencyId) {
    const data = this.get();
    data.activeAgencyId = agencyId;
    this.save(data);
    return this.getActiveAgency();
  }

  registerAgency(agency) {
    const data = this.get();
    const newAgency = {
      id: agency.id || `agency-${Date.now()}`,
      name: agency.name || 'New FMCG Agency',
      tradeName: agency.tradeName || 'Distributor & C&F',
      brands: agency.brands || [],
      gstin: agency.gstin || '',
      phone: agency.phone || '',
      email: agency.email || '',
      address: agency.address || '',
      hubLocation: agency.hubLocation || 'Main Godown',
      logoEmoji: agency.logoEmoji || '🏢'
    };

    data.agencies.push(newAgency);
    data.activeAgencyId = newAgency.id;
    this.save(data);

    if (isSupabaseConfigured()) {
      cloudStorage.saveAgency(newAgency);
    }

    return newAgency;
  }

  updateAgency(agencyId, updates) {
    const data = this.get();
    const idx = data.agencies.findIndex(a => a.id === agencyId);
    if (idx !== -1) {
      data.agencies[idx] = { ...data.agencies[idx], ...updates };
      this.save(data);

      if (isSupabaseConfigured()) {
        cloudStorage.saveAgency(data.agencies[idx]);
      }
      return data.agencies[idx];
    }
    return null;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Vehicles & Fleet Operations (Scoped by Tenant)
  // ═════════════════════════════════════════════════════════════════════════
  getVehicles(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.vehicles || []).filter(v => v.agencyId === targetAgency);
  }

  getVehicleById(id) {
    const data = this.get();
    return data.vehicles.find(v => v.id === id);
  }

  addVehicle(vehicle) {
    const data = this.get();
    const agencyId = vehicle.agencyId || data.activeAgencyId;
    const newVehicle = {
      ...vehicle,
      id: vehicle.id || `veh-${Date.now()}`,
      agencyId
    };

    data.vehicles.unshift(newVehicle);
    this.save(data);

    if (isSupabaseConfigured()) {
      cloudStorage.saveVehicle(agencyId, newVehicle);
    }
    return newVehicle;
  }

  updateVehicle(id, updates) {
    const data = this.get();
    const index = data.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      data.vehicles[index] = { ...data.vehicles[index], ...updates };
      this.save(data);

      if (isSupabaseConfigured()) {
        cloudStorage.saveVehicle(data.vehicles[index].agencyId, data.vehicles[index]);
      }
      return data.vehicles[index];
    }
    return null;
  }

  deleteVehicle(id) {
    const data = this.get();
    const target = data.vehicles.find(v => v.id === id);
    data.vehicles = data.vehicles.filter(v => v.id !== id);
    this.save(data);

    if (target && isSupabaseConfigured()) {
      cloudStorage.deleteVehicle(target.agencyId, id);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Workshop Service & Maintenance Logs
  // ═════════════════════════════════════════════════════════════════════════
  getServiceLogs(vehicleId = null, agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    let list = (data.serviceLogs || []).filter(s => s.agencyId === targetAgency || !s.agencyId);
    if (vehicleId) {
      list = list.filter(s => s.vehicleId === vehicleId);
    }
    return list;
  }

  addServiceLog(log) {
    const data = this.get();
    const agencyId = log.agencyId || data.activeAgencyId;
    const newLog = {
      ...log,
      id: `srv-${Date.now()}`,
      agencyId
    };

    data.serviceLogs.unshift(newLog);
    if (log.vehicleId && log.odometer) {
      const v = data.vehicles.find(v => v.id === log.vehicleId);
      if (v && log.odometer > v.currentOdo) {
        v.currentOdo = log.odometer;
      }
    }
    this.save(data);
    return newLog;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Fuel & Mileage Logs
  // ═════════════════════════════════════════════════════════════════════════
  getFuelLogs(vehicleId = null, agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    let list = (data.fuelLogs || []).filter(f => f.agencyId === targetAgency || !f.agencyId);
    if (vehicleId) {
      list = list.filter(f => f.vehicleId === vehicleId);
    }
    return list;
  }

  addFuelLog(log) {
    const data = this.get();
    const agencyId = log.agencyId || data.activeAgencyId;
    const newLog = {
      ...log,
      id: `fuel-${Date.now()}`,
      agencyId
    };

    data.fuelLogs.unshift(newLog);
    if (log.vehicleId && log.endKm) {
      const v = data.vehicles.find(v => v.id === log.vehicleId);
      if (v && log.endKm > v.currentOdo) {
        v.currentOdo = log.endKm;
      }
    }
    this.save(data);
    return newLog;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Delivery Route Dispatches & Gate Passes
  // ═════════════════════════════════════════════════════════════════════════
  getDispatchSheets(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.dispatchSheets || []).filter(d => d.agencyId === targetAgency);
  }

  addDispatchSheet(sheet) {
    const data = this.get();
    const agencyId = sheet.agencyId || data.activeAgencyId;
    const newSheet = {
      ...sheet,
      id: `dsp-${Date.now()}`,
      agencyId
    };

    data.dispatchSheets.unshift(newSheet);
    this.save(data);

    if (isSupabaseConfigured()) {
      cloudStorage.saveDispatchSheet(agencyId, newSheet);
    }
    return newSheet;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Employees & Driver HR Roster
  // ═════════════════════════════════════════════════════════════════════════
  getEmployees(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.employees || []).filter(e => e.agencyId === targetAgency);
  }

  addEmployee(emp) {
    const data = this.get();
    const agencyId = emp.agencyId || data.activeAgencyId;
    const newEmp = {
      ...emp,
      id: emp.id || `emp-${Date.now()}`,
      agencyId
    };

    data.employees.unshift(newEmp);
    this.save(data);

    if (isSupabaseConfigured()) {
      cloudStorage.saveEmployee(agencyId, newEmp);
    }
    return newEmp;
  }

  updateEmployee(id, updates) {
    const data = this.get();
    const idx = data.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.employees[idx] = { ...data.employees[idx], ...updates };
      this.save(data);

      if (isSupabaseConfigured()) {
        cloudStorage.saveEmployee(data.employees[idx].agencyId, data.employees[idx]);
      }
      return data.employees[idx];
    }
    return null;
  }

  deleteEmployee(id) {
    const data = this.get();
    const emp = data.employees.find(e => e.id === id);
    data.employees = data.employees.filter(e => e.id !== id);
    this.save(data);

    if (emp && isSupabaseConfigured()) {
      cloudStorage.deleteEmployee(emp.agencyId, id);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Monthly Payroll Runs
  // ═════════════════════════════════════════════════════════════════════════
  getMonthlyPayroll(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.monthlyPayrollEntries || []).filter(p => p.agencyId === targetAgency);
  }

  addMonthlyPayroll(entry) {
    const data = this.get();
    const agencyId = entry.agencyId || data.activeAgencyId;
    const newEntry = {
      ...entry,
      id: `pay-${Date.now()}`,
      agencyId
    };
    data.monthlyPayrollEntries.unshift(newEntry);
    this.save(data);
    return newEntry;
  }

  updatePayrollStatus(id, newStatus) {
    const data = this.get();
    const item = data.monthlyPayrollEntries.find(p => p.id === id);
    if (item) {
      item.status = newStatus;
      if (newStatus === 'Approved') item.paidDate = new Date().toISOString().split('T')[0];
      this.save(data);
      return item;
    }
    return null;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // Stock Inventory & Dual-Unit (CBB / PCS)
  // ═════════════════════════════════════════════════════════════════════════
  getStockBrands(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    const items = this.getStockItems(targetAgency);

    // Compute live brands from stock items
    const brandMap = {};
    items.forEach(item => {
      const b = item.brand || 'Unbranded';
      if (!brandMap[b]) {
        brandMap[b] = {
          id: `brand-${b.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: b,
          totalSkus: 0,
          godownA_Cartons: 0,
          godownB_Cartons: 0,
          valuation: 0
        };
      }
      brandMap[b].totalSkus++;
      brandMap[b].godownA_Cartons += Math.round(item.systemStockCbb || 0);
      brandMap[b].valuation += Math.round((item.systemStockCbb || 0) * (item.conversion || 1) * (item.mrp || 0));
    });

    return Object.values(brandMap);
  }

  getStockItems(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.stockItems || []).filter(s => s.agencyId === targetAgency);
  }

  addStockItem(item) {
    const data = this.get();
    const agencyId = item.agencyId || data.activeAgencyId;
    const newItem = {
      ...item,
      id: item.id || `sku-${Date.now()}`,
      agencyId
    };
    data.stockItems.unshift(newItem);
    this.save(data);

    if (isSupabaseConfigured()) {
      cloudStorage.bulkUpsertStock(agencyId, [newItem]);
    }
    return newItem;
  }

  setStockItems(items, agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    const otherItems = (data.stockItems || []).filter(s => s.agencyId !== targetAgency);
    const stampedItems = items.map(s => ({
      ...s,
      agencyId: targetAgency
    }));

    data.stockItems = [...stampedItems, ...otherItems];
    this.save(data);

    if (isSupabaseConfigured()) {
      cloudStorage.bulkUpsertStock(targetAgency, stampedItems);
    }
    return stampedItems;
  }

  updatePhysicalCount(skuId, physicalCbb, physicalPcs) {
    const data = this.get();
    const item = data.stockItems.find(s => s.id === skuId);
    if (item) {
      item.physicalStockCbb = Number(physicalCbb);
      item.physicalStockPcs = Number(physicalPcs);
      const conv = item.conversion || 1;
      const totalPhysicalInCartons = Number(physicalCbb) + (Number(physicalPcs) / conv);
      const totalSystemInCartons = item.systemStockCbb + (item.systemStockPcs / conv);
      const variance = Number((totalPhysicalInCartons - totalSystemInCartons).toFixed(2));
      item.variance = variance;
      item.varianceValue = Math.round(variance * conv * item.mrp);

      if (variance === 0) item.status = 'Equal';
      else if (variance < 0) item.status = 'Shortage';
      else item.status = 'Excess';

      this.save(data);

      if (isSupabaseConfigured()) {
        cloudStorage.bulkUpsertStock(item.agencyId, [item]);
      }
      return item;
    }
    return null;
  }

  getDamagedGoods(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.damagedAndExpiryGoods || []).filter(d => d.agencyId === targetAgency);
  }

  addDamagedGoods(record) {
    const data = this.get();
    const agencyId = record.agencyId || data.activeAgencyId;
    const newRecord = {
      ...record,
      id: `dmg-${Date.now()}`,
      agencyId
    };
    data.damagedAndExpiryGoods.unshift(newRecord);
    this.save(data);
    return newRecord;
  }
}

export const fmcgDb = new FMCGDatabase();

// ═════════════════════════════════════════════════════════════════════════
// Date & Currency Formatters
// ═════════════════════════════════════════════════════════════════════════
export function calculateDaysLeft(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatCurrencyINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function formatDatePretty(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}
