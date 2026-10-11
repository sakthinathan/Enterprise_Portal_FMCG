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

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Cloud Sync Layer for Multi-Tenant FMCG Data
 */
export const cloudStorage = {
  async fetchAgencies() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('agencies').select('*').order('name');
    if (error) {
      console.warn('Supabase fetchAgencies error:', error.message);
      return null;
    }
    return data;
  },

  async saveAgency(agency) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('agencies').upsert({
      id: agency.id,
      name: agency.name,
      trade_name: agency.tradeName,
      gstin: agency.gstin,
      hub_location: agency.hubLocation,
      brands: agency.brands || [],
      contact_phone: agency.contactPhone,
      contact_email: agency.contactEmail,
      updated_at: new Date().toISOString()
    }).select().single();
    if (error) console.warn('Supabase saveAgency error:', error.message);
    return data;
  },

  async fetchVehicles(agencyId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('agency_id', agencyId);
    if (error) {
      console.warn('Supabase fetchVehicles error:', error.message);
      return null;
    }
    return data;
  },

  async saveVehicle(agencyId, vehicle) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('vehicles').upsert({
      id: vehicle.id,
      agency_id: agencyId,
      reg_no: vehicle.regNo,
      model: vehicle.model,
      type: vehicle.type,
      fuel_type: vehicle.fuelType,
      payload_kg: vehicle.payloadKg,
      crate_capacity: vehicle.crateCapacity,
      assigned_route: vehicle.assignedRoute,
      driver_id: vehicle.driverId,
      driver_name: vehicle.driverName,
      current_odo: vehicle.currentOdo,
      godown: vehicle.godown,
      status: vehicle.status,
      insurance: vehicle.insurance,
      fc: vehicle.fc,
      puc: vehicle.puc,
      road_tax: vehicle.roadTax,
      updated_at: new Date().toISOString()
    });
    if (error) console.warn('Supabase saveVehicle error:', error.message);
    return data;
  },

  async deleteVehicle(agencyId, vehicleId) {
    if (!supabase) return null;
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('agency_id', agencyId)
      .eq('id', vehicleId);
    if (error) console.warn('Supabase deleteVehicle error:', error.message);
  },

  async fetchEmployees(agencyId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('agency_id', agencyId);
    if (error) {
      console.warn('Supabase fetchEmployees error:', error.message);
      return null;
    }
    return data;
  },

  async saveEmployee(agencyId, emp) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('employees').upsert({
      id: emp.id,
      agency_id: agencyId,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      pay_type: emp.payType,
      basic_salary: emp.basicSalary,
      daily_wage: emp.dailyWage,
      hra: emp.hra,
      conveyance: emp.conveyance,
      incentives: emp.incentives,
      phone: emp.phone,
      license_no: emp.licenseNo,
      license_expiry: emp.licenseExpiry || null,
      bank_name: emp.bankName,
      account_no: emp.accountNo,
      ifsc: emp.ifsc,
      status: emp.status,
      join_date: emp.joinDate || new Date().toISOString().split('T')[0]
    });
    if (error) console.warn('Supabase saveEmployee error:', error.message);
    return data;
  },

  async deleteEmployee(agencyId, empId) {
    if (!supabase) return null;
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('agency_id', agencyId)
      .eq('id', empId);
    if (error) console.warn('Supabase deleteEmployee error:', error.message);
  },

  async fetchStock(agencyId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('stock_items')
      .select('*')
      .eq('agency_id', agencyId);
    if (error) {
      console.warn('Supabase fetchStock error:', error.message);
      return null;
    }
    return data;
  },

  async bulkUpsertStock(agencyId, items) {
    if (!supabase || !items.length) return null;
    const formatted = items.map(s => ({
      id: s.id,
      agency_id: agencyId,
      brand: s.brand,
      material: s.material,
      material_desc: s.materialDesc,
      mrp: s.mrp,
      conversion: s.conversion,
      system_stock_cbb: s.systemStockCbb,
      system_stock_pcs: s.systemStockPcs,
      physical_stock_cbb: s.physicalStockCbb,
      physical_stock_pcs: s.physicalStockPcs,
      variance: s.variance,
      variance_value: s.varianceValue,
      status: s.status,
      godown: s.godown || 'Central Godown',
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('stock_items').upsert(formatted);
    if (error) console.warn('Supabase bulkUpsertStock error:', error.message);
  },

  async fetchDispatchSheets(agencyId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('dispatch_sheets')
      .select('*')
      .eq('agency_id', agencyId);
    if (error) {
      console.warn('Supabase fetchDispatchSheets error:', error.message);
      return null;
    }
    return data;
  },

  async saveDispatchSheet(agencyId, sheet) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('dispatch_sheets').upsert({
      id: sheet.id,
      agency_id: agencyId,
      dispatch_date: sheet.dispatchDate,
      vehicle_reg: sheet.vehicleReg,
      driver_name: sheet.driverName,
      route_beat: sheet.routeBeat,
      total_cartons: sheet.totalCartons,
      plastic_crates_issued: sheet.plasticCratesIssued,
      plastic_crates_returned: sheet.plasticCratesReturned,
      retailer_count: sheet.retailerCount,
      invoice_value: sheet.invoiceValue,
      status: sheet.status
    });
    if (error) console.warn('Supabase saveDispatchSheet error:', error.message);
    return data;
  }
};
