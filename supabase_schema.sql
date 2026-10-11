-- ═════════════════════════════════════════════════════════════════════════
-- FMCG Enterprise Suite - Multi-Tenant PostgreSQL Schema for Supabase
-- ═════════════════════════════════════════════════════════════════════════

-- 1. Tenants / Agencies Table
CREATE TABLE IF NOT EXISTS public.agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trade_name TEXT,
  gstin TEXT,
  hub_location TEXT,
  brands JSONB DEFAULT '[]'::jsonb,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vehicles / Commercial Fleet Table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  reg_no TEXT NOT NULL,
  model TEXT,
  type TEXT DEFAULT 'Mini Truck',
  fuel_type TEXT DEFAULT 'Diesel',
  payload_kg INT DEFAULT 1000,
  crate_capacity INT DEFAULT 60,
  assigned_route TEXT,
  driver_id TEXT,
  driver_name TEXT,
  current_odo INT DEFAULT 0,
  godown TEXT DEFAULT 'Central Godown',
  status TEXT DEFAULT 'Active',
  insurance JSONB DEFAULT '{}'::jsonb,
  fc JSONB DEFAULT '{}'::jsonb,
  puc JSONB DEFAULT '{}'::jsonb,
  road_tax JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employees / Drivers & Godown Staff Table
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT DEFAULT 'Logistics',
  pay_type TEXT DEFAULT 'Monthly',
  basic_salary NUMERIC(10, 2) DEFAULT 0,
  daily_wage NUMERIC(10, 2) DEFAULT 0,
  hra NUMERIC(10, 2) DEFAULT 0,
  conveyance NUMERIC(10, 2) DEFAULT 0,
  incentives NUMERIC(10, 2) DEFAULT 0,
  phone TEXT,
  license_no TEXT,
  license_expiry DATE,
  bank_name TEXT,
  account_no TEXT,
  ifsc TEXT,
  status TEXT DEFAULT 'Active',
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FMCG Stock SKUs & Inventory Table
CREATE TABLE IF NOT EXISTS public.stock_items (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  material TEXT NOT NULL,
  material_desc TEXT NOT NULL,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0,
  conversion INT NOT NULL DEFAULT 1, -- pieces per carton
  system_stock_cbb NUMERIC(10, 2) DEFAULT 0,
  system_stock_pcs NUMERIC(10, 2) DEFAULT 0,
  physical_stock_cbb NUMERIC(10, 2) DEFAULT 0,
  physical_stock_pcs NUMERIC(10, 2) DEFAULT 0,
  variance NUMERIC(10, 2) DEFAULT 0,
  variance_value NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'Equal', -- 'Equal', 'Shortage', 'Excess'
  godown TEXT DEFAULT 'Central Godown',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Principal FMCG Brands Table
CREATE TABLE IF NOT EXISTS public.stock_brands (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_skus INT DEFAULT 0,
  godown_a_cartons INT DEFAULT 0,
  godown_b_cartons INT DEFAULT 0,
  valuation NUMERIC(14, 2) DEFAULT 0
);

-- 6. Workshop & Service Logs Table
CREATE TABLE IF NOT EXISTS public.service_logs (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vehicle_reg TEXT NOT NULL,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  odometer INT DEFAULT 0,
  garage_name TEXT,
  work_description TEXT,
  parts_cost NUMERIC(10, 2) DEFAULT 0,
  labor_cost NUMERIC(10, 2) DEFAULT 0,
  total_cost NUMERIC(10, 2) DEFAULT 0,
  bill_number TEXT,
  next_service_km INT,
  next_service_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Fuel & Mileage Logs Table
CREATE TABLE IF NOT EXISTS public.fuel_logs (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  vehicle_reg TEXT NOT NULL,
  driver_name TEXT,
  log_date DATE NOT NULL,
  start_km INT,
  end_km INT,
  total_km INT,
  fuel_liters NUMERIC(8, 2),
  fuel_cost NUMERIC(10, 2),
  kmpl NUMERIC(6, 2),
  fuel_station TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Van Dispatch & Gate Pass Loading Sheets Table
CREATE TABLE IF NOT EXISTS public.dispatch_sheets (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  dispatch_date DATE NOT NULL,
  vehicle_reg TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  route_beat TEXT NOT NULL,
  total_cartons INT DEFAULT 0,
  plastic_crates_issued INT DEFAULT 0,
  plastic_crates_returned INT DEFAULT 0,
  retailer_count INT DEFAULT 0,
  invoice_value NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'On Delivery Beat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Monthly Payroll Ledger Runs Table
CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  month INT NOT NULL,
  year INT NOT NULL,
  entries JSONB DEFAULT '[]'::jsonb,
  total_gross NUMERIC(12, 2) DEFAULT 0,
  total_deductions NUMERIC(12, 2) DEFAULT 0,
  total_net NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════
-- Performance Multi-Tenant Indexes
-- ═════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_vehicles_agency ON public.vehicles(agency_id);
CREATE INDEX IF NOT EXISTS idx_employees_agency ON public.employees(agency_id);
CREATE INDEX IF NOT EXISTS idx_stock_items_agency ON public.stock_items(agency_id);
CREATE INDEX IF NOT EXISTS idx_stock_items_brand ON public.stock_items(agency_id, brand);
CREATE INDEX IF NOT EXISTS idx_service_logs_agency ON public.service_logs(agency_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_agency ON public.dispatch_sheets(agency_id);
CREATE INDEX IF NOT EXISTS idx_payroll_agency ON public.payroll_runs(agency_id, month, year);

-- ═════════════════════════════════════════════════════════════════════════
-- Enable Row Level Security (RLS) on all tables
-- ═════════════════════════════════════════════════════════════════════════
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write with anon key for this tenant portal (or scoped by session)
CREATE POLICY "Allow public anon access for agencies" ON public.agencies FOR ALL USING (true);
CREATE POLICY "Allow public anon access for vehicles" ON public.vehicles FOR ALL USING (true);
CREATE POLICY "Allow public anon access for employees" ON public.employees FOR ALL USING (true);
CREATE POLICY "Allow public anon access for stock_items" ON public.stock_items FOR ALL USING (true);
CREATE POLICY "Allow public anon access for stock_brands" ON public.stock_brands FOR ALL USING (true);
CREATE POLICY "Allow public anon access for service_logs" ON public.service_logs FOR ALL USING (true);
CREATE POLICY "Allow public anon access for fuel_logs" ON public.fuel_logs FOR ALL USING (true);
CREATE POLICY "Allow public anon access for dispatch_sheets" ON public.dispatch_sheets FOR ALL USING (true);
CREATE POLICY "Allow public anon access for payroll_runs" ON public.payroll_runs FOR ALL USING (true);
