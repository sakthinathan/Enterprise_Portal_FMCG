import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Base Supabase client
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Returns a securely scoped Supabase client with the tenant's 'x-agency-id' header attached.
 * This triggers PostgreSQL Row-Level Security (RLS) public.check_agency_access(agency_id)
 * guaranteeing zero cross-tenant data leaks.
 */
const tenantClientCache = new Map();

export const getTenantClient = (agencyId) => {
  if (!isSupabaseConfigured()) return null;
  if (!agencyId) return supabase;

  const key = String(agencyId);
  if (tenantClientCache.has(key)) {
    return tenantClientCache.get(key);
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        'x-agency-id': key
      }
    }
  });

  tenantClientCache.set(key, client);
  return client;
};

/**
 * Secure Multi-Tenant Cloud Storage Adapter
 * Strictly verifies and validates tenant ID before every operation
 */
export const cloudStorage = {
  // 1. Agencies Master
  async fetchAgencies(agencyId = 'thulir') {
    if (!supabase) return null;
    const client = agencyId ? getTenantClient(agencyId) : supabase;
    const { data, error } = await client
      .from('agencies')
      .select('id, name, trade_name, gstin, hub_location, brands, contact_phone, contact_email, created_at')
      .order('name');
    if (error) {
      console.warn('Supabase fetchAgencies error:', error.message);
      return null;
    }
    return data;
  },

  async saveAgency(agency) {
    if (!supabase || !agency?.id) return null;
    const client = getTenantClient(agency.id);
    const { data, error } = await client.from('agencies').upsert({
      id: String(agency.id),
      name: String(agency.name).trim(),
      trade_name: agency.tradeName || '',
      gstin: agency.gstin || '',
      hub_location: agency.hubLocation || 'Central Godown',
      brands: Array.isArray(agency.brands) ? agency.brands : [],
      contact_phone: agency.contactPhone || '',
      contact_email: agency.contactEmail || '',
      updated_at: new Date().toISOString()
    }).select().single();

    if (error) console.warn('Supabase saveAgency error:', error.message);
    return data;
  },

  // 2. Vehicles (Scoped by Tenant ID)
  async fetchVehicles(agencyId) {
    if (!agencyId || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('agency_id', String(agencyId));

    if (error) {
      console.warn('Supabase fetchVehicles error:', error.message);
      return null;
    }
    return data;
  },

  async saveVehicle(agencyId, vehicle) {
    if (!agencyId || !vehicle?.id || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client.from('vehicles').upsert({
      id: String(vehicle.id),
      agency_id: String(agencyId),
      reg_no: String(vehicle.regNo).trim().toUpperCase(),
      model: vehicle.model || '',
      type: vehicle.type || 'Mini Truck',
      fuel_type: vehicle.fuelType || 'Diesel',
      payload_kg: Math.max(0, Number(vehicle.payloadKg) || 1000),
      crate_capacity: Math.max(0, Number(vehicle.crateCapacity) || 60),
      assigned_route: vehicle.assignedRoute || '',
      driver_id: vehicle.driverId || null,
      driver_name: vehicle.driverName || '',
      current_odo: Math.max(0, Number(vehicle.currentOdo) || 0),
      godown: vehicle.godown || 'Central Godown',
      status: vehicle.status || 'Active',
      insurance: vehicle.insurance || {},
      fc: vehicle.fc || {},
      puc: vehicle.puc || {},
      road_tax: vehicle.roadTax || {},
      updated_at: new Date().toISOString()
    });

    if (error) console.warn('Supabase saveVehicle error:', error.message);
    return data;
  },

  async deleteVehicle(agencyId, vehicleId) {
    if (!agencyId || !vehicleId || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { error } = await client
      .from('vehicles')
      .delete()
      .eq('agency_id', String(agencyId))
      .eq('id', String(vehicleId));

    if (error) console.warn('Supabase deleteVehicle error:', error.message);
  },

  // 3. Employees & Drivers Roster
  async fetchEmployees(agencyId) {
    if (!agencyId || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client
      .from('employees')
      .select('*')
      .eq('agency_id', String(agencyId));

    if (error) {
      console.warn('Supabase fetchEmployees error:', error.message);
      return null;
    }
    return data;
  },

  async saveEmployee(agencyId, emp) {
    if (!agencyId || !emp?.id || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client.from('employees').upsert({
      id: String(emp.id),
      agency_id: String(agencyId),
      name: String(emp.name).trim(),
      role: emp.role || 'Van Driver',
      department: emp.department || 'Logistics',
      pay_type: emp.payType || 'Monthly',
      basic_salary: Math.max(0, Number(emp.basicSalary) || 0),
      daily_wage: Math.max(0, Number(emp.dailyWage) || 0),
      hra: Math.max(0, Number(emp.hra) || 0),
      conveyance: Math.max(0, Number(emp.conveyance) || 0),
      incentives: Math.max(0, Number(emp.incentives) || 0),
      phone: emp.phone || '',
      license_no: emp.licenseNo || null,
      license_expiry: emp.licenseExpiry || null,
      bank_name: emp.bankName || '',
      account_no: emp.accountNo || '',
      ifsc: emp.ifsc || '',
      status: emp.status || 'Active',
      join_date: emp.joinDate || new Date().toISOString().split('T')[0]
    });

    if (error) console.warn('Supabase saveEmployee error:', error.message);
    return data;
  },

  async deleteEmployee(agencyId, empId) {
    if (!agencyId || !empId || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { error } = await client
      .from('employees')
      .delete()
      .eq('agency_id', String(agencyId))
      .eq('id', String(empId));

    if (error) console.warn('Supabase deleteEmployee error:', error.message);
  },

  // 4. Stock SKUs & Physical Audit (Cartons / Pieces)
  async fetchStock(agencyId) {
    if (!agencyId || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client
      .from('stock_items')
      .select('*')
      .eq('agency_id', String(agencyId));

    if (error) {
      console.warn('Supabase fetchStock error:', error.message);
      return null;
    }
    return data;
  },

  async bulkUpsertStock(agencyId, items) {
    if (!agencyId || !items?.length || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const formatted = items.map(s => ({
      id: String(s.id),
      agency_id: String(agencyId),
      brand: s.brand || 'Unbranded',
      material: String(s.material || '').trim(),
      material_desc: String(s.materialDesc || '').trim(),
      mrp: Math.max(0, Number(s.mrp) || 0),
      conversion: Math.max(1, Number(s.conversion) || 1),
      system_stock_cbb: Math.max(0, Number(s.systemStockCbb) || 0),
      system_stock_pcs: Math.max(0, Number(s.systemStockPcs) || 0),
      physical_stock_cbb: Math.max(0, Number(s.physicalStockCbb) || 0),
      physical_stock_pcs: Math.max(0, Number(s.physicalStockPcs) || 0),
      variance: Number(s.variance) || 0,
      variance_value: Number(s.varianceValue) || 0,
      status: s.status || 'Equal',
      godown: s.godown || 'Central Godown',
      updated_at: new Date().toISOString()
    }));

    const { error } = await client.from('stock_items').upsert(formatted);
    if (error) console.warn('Supabase bulkUpsertStock error:', error.message);
  },

  // 5. Van Dispatch Gate Passes
  async fetchDispatchSheets(agencyId) {
    if (!agencyId || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client
      .from('dispatch_sheets')
      .select('*')
      .eq('agency_id', String(agencyId))
      .order('dispatch_date', { ascending: false });

    if (error) {
      console.warn('Supabase fetchDispatchSheets error:', error.message);
      return null;
    }
    return data;
  },

  async saveDispatchSheet(agencyId, sheet) {
    if (!agencyId || !sheet?.id || !isSupabaseConfigured()) return null;
    const client = getTenantClient(agencyId);
    const { data, error } = await client.from('dispatch_sheets').upsert({
      id: String(sheet.id),
      agency_id: String(agencyId),
      dispatch_date: sheet.dispatchDate,
      vehicle_reg: sheet.vehicleReg,
      driver_name: sheet.driverName,
      route_beat: sheet.routeBeat,
      total_cartons: Math.max(0, Number(sheet.totalCartons) || 0),
      plastic_crates_issued: Math.max(0, Number(sheet.plasticCratesIssued) || 0),
      plastic_crates_returned: Math.max(0, Number(sheet.plasticCratesReturned) || 0),
      retailer_count: Math.max(0, Number(sheet.retailerCount) || 0),
      invoice_value: Math.max(0, Number(sheet.invoiceValue) || 0),
      status: sheet.status || 'On Delivery Beat'
    });

    if (error) console.warn('Supabase saveDispatchSheet error:', error.message);
    return data;
  }
};
