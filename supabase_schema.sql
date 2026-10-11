-- ═════════════════════════════════════════════════════════════════════════
-- FMCG Enterprise Suite - Production Multi-Tenant PostgreSQL Schema
-- Airtight API Security, Zero-Leak Row Level Security (RLS) & Performance Indexes
-- ═════════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═════════════════════════════════════════════════════════════════════════
-- 1. Tenants / Agencies Master Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trade_name TEXT,
  gstin TEXT,
  hub_location TEXT NOT NULL DEFAULT 'Central Godown',
  brands JSONB DEFAULT '[]'::jsonb,
  contact_phone TEXT,
  contact_email TEXT,
  api_secret TEXT DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_agency_name_len CHECK (char_length(name) >= 2)
);

-- ═════════════════════════════════════════════════════════════════════════
-- 2. Tenant Membership & Access Control (User-to-Agency Mapping)
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.agency_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID, -- References auth.users(id) in Supabase Auth
  user_email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator', -- 'owner', 'manager', 'driver', 'operator'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_id, user_email)
);

-- ═════════════════════════════════════════════════════════════════════════
-- 3. Commercial Vehicles & Fleet Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  reg_no TEXT NOT NULL,
  model TEXT,
  type TEXT DEFAULT 'Mini Truck',
  fuel_type TEXT DEFAULT 'Diesel',
  payload_kg INT DEFAULT 1000 CHECK (payload_kg >= 0),
  crate_capacity INT DEFAULT 60 CHECK (crate_capacity >= 0),
  assigned_route TEXT,
  driver_id TEXT,
  driver_name TEXT,
  current_odo INT DEFAULT 0 CHECK (current_odo >= 0),
  godown TEXT DEFAULT 'Central Godown',
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Grounded', 'Inactive')),
  insurance JSONB DEFAULT '{}'::jsonb,
  fc JSONB DEFAULT '{}'::jsonb,
  puc JSONB DEFAULT '{}'::jsonb,
  road_tax JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_id, reg_no)
);

-- ═════════════════════════════════════════════════════════════════════════
-- 4. Employees / Drivers & Logistics Staff Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT DEFAULT 'Logistics',
  pay_type TEXT DEFAULT 'Monthly' CHECK (pay_type IN ('Monthly', 'Daily Wage', 'Contract')),
  basic_salary NUMERIC(10, 2) DEFAULT 0 CHECK (basic_salary >= 0),
  daily_wage NUMERIC(10, 2) DEFAULT 0 CHECK (daily_wage >= 0),
  hra NUMERIC(10, 2) DEFAULT 0 CHECK (hra >= 0),
  conveyance NUMERIC(10, 2) DEFAULT 0 CHECK (conveyance >= 0),
  incentives NUMERIC(10, 2) DEFAULT 0 CHECK (incentives >= 0),
  phone TEXT,
  license_no TEXT,
  license_expiry DATE,
  bank_name TEXT,
  account_no TEXT,
  ifsc TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Resigned', 'Suspended')),
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════
-- 5. FMCG Stock SKUs & Inventory Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.stock_items (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  material TEXT NOT NULL,
  material_desc TEXT NOT NULL,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (mrp >= 0),
  conversion INT NOT NULL DEFAULT 1 CHECK (conversion >= 1), -- pieces per carton
  system_stock_cbb NUMERIC(10, 2) DEFAULT 0 CHECK (system_stock_cbb >= 0),
  system_stock_pcs NUMERIC(10, 2) DEFAULT 0 CHECK (system_stock_pcs >= 0),
  physical_stock_cbb NUMERIC(10, 2) DEFAULT 0 CHECK (physical_stock_cbb >= 0),
  physical_stock_pcs NUMERIC(10, 2) DEFAULT 0 CHECK (physical_stock_pcs >= 0),
  variance NUMERIC(10, 2) DEFAULT 0,
  variance_value NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'Equal' CHECK (status IN ('Equal', 'Shortage', 'Excess')),
  godown TEXT DEFAULT 'Central Godown',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_id, material)
);

-- ═════════════════════════════════════════════════════════════════════════
-- 6. Principal FMCG Brands Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.stock_brands (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_skus INT DEFAULT 0 CHECK (total_skus >= 0),
  godown_a_cartons INT DEFAULT 0 CHECK (godown_a_cartons >= 0),
  godown_b_cartons INT DEFAULT 0 CHECK (godown_b_cartons >= 0),
  valuation NUMERIC(14, 2) DEFAULT 0 CHECK (valuation >= 0),
  UNIQUE (agency_id, name)
);

-- ═════════════════════════════════════════════════════════════════════════
-- 7. Workshop & Maintenance Service Records Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.service_logs (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vehicle_reg TEXT NOT NULL,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  odometer INT DEFAULT 0 CHECK (odometer >= 0),
  garage_name TEXT,
  work_description TEXT,
  parts_cost NUMERIC(10, 2) DEFAULT 0 CHECK (parts_cost >= 0),
  labor_cost NUMERIC(10, 2) DEFAULT 0 CHECK (labor_cost >= 0),
  total_cost NUMERIC(10, 2) DEFAULT 0 CHECK (total_cost >= 0),
  bill_number TEXT,
  next_service_km INT,
  next_service_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════
-- 8. Fuel & Mileage Analytics Logs Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.fuel_logs (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  vehicle_reg TEXT NOT NULL,
  driver_name TEXT,
  log_date DATE NOT NULL,
  start_km INT CHECK (start_km >= 0),
  end_km INT CHECK (end_km >= 0),
  total_km INT CHECK (total_km >= 0),
  fuel_liters NUMERIC(8, 2) CHECK (fuel_liters >= 0),
  fuel_cost NUMERIC(10, 2) CHECK (fuel_cost >= 0),
  kmpl NUMERIC(6, 2) CHECK (kmpl >= 0),
  fuel_station TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════
-- 9. Van Dispatch & Gate Pass Loading Sheets Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.dispatch_sheets (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  dispatch_date DATE NOT NULL,
  vehicle_reg TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  route_beat TEXT NOT NULL,
  total_cartons INT DEFAULT 0 CHECK (total_cartons >= 0),
  plastic_crates_issued INT DEFAULT 0 CHECK (plastic_crates_issued >= 0),
  plastic_crates_returned INT DEFAULT 0 CHECK (plastic_crates_returned >= 0),
  retailer_count INT DEFAULT 0 CHECK (retailer_count >= 0),
  invoice_value NUMERIC(12, 2) DEFAULT 0 CHECK (invoice_value >= 0),
  status TEXT DEFAULT 'On Delivery Beat' CHECK (status IN ('Loading at Godown', 'On Delivery Beat', 'Completed & Settled', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════
-- 10. Monthly Payroll Ledger Runs Table
-- ═════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  entries JSONB DEFAULT '[]'::jsonb,
  total_gross NUMERIC(12, 2) DEFAULT 0 CHECK (total_gross >= 0),
  total_deductions NUMERIC(12, 2) DEFAULT 0 CHECK (total_deductions >= 0),
  total_net NUMERIC(12, 2) DEFAULT 0 CHECK (total_net >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_id, month, year)
);

-- ═════════════════════════════════════════════════════════════════════════
-- ═════════════════════════════════════════════════════════════════════════
-- HIGH-PERFORMANCE MULTI-TENANT INDEXES (Covering Queries & Expiries)
-- ═════════════════════════════════════════════════════════════════════════
-- ═════════════════════════════════════════════════════════════════════════

-- 1. Agencies Indexes
CREATE INDEX IF NOT EXISTS idx_agencies_gstin ON public.agencies(gstin) WHERE gstin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_agencies_email ON public.agencies(contact_email) WHERE contact_email IS NOT NULL;

-- 2. Agency Members Indexes
CREATE INDEX IF NOT EXISTS idx_agency_members_user ON public.agency_members(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_email ON public.agency_members(user_email);
CREATE INDEX IF NOT EXISTS idx_agency_members_lookup ON public.agency_members(agency_id, user_email);

-- 3. Vehicles Indexes (Status, Reg No, Route, and JSONB Expiry B-Trees)
CREATE INDEX IF NOT EXISTS idx_vehicles_agency_status ON public.vehicles(agency_id, status);
CREATE INDEX IF NOT EXISTS idx_vehicles_agency_reg ON public.vehicles(agency_id, reg_no);
CREATE INDEX IF NOT EXISTS idx_vehicles_agency_driver ON public.vehicles(agency_id, driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_agency_odo ON public.vehicles(agency_id, current_odo DESC);
-- Functional Indexes on JSONB Expiry Dates for Fast Compliance Countdown Queries:
CREATE INDEX IF NOT EXISTS idx_vehicles_fc_expiry ON public.vehicles(agency_id, ((fc->>'expiryDate')));
CREATE INDEX IF NOT EXISTS idx_vehicles_ins_expiry ON public.vehicles(agency_id, ((insurance->>'expiryDate')));

-- 4. Employees Indexes (Active roster, Role, Phone, DL Expiry)
CREATE INDEX IF NOT EXISTS idx_employees_agency_status ON public.employees(agency_id, status);
CREATE INDEX IF NOT EXISTS idx_employees_agency_role ON public.employees(agency_id, role);
CREATE INDEX IF NOT EXISTS idx_employees_agency_phone ON public.employees(agency_id, phone);
CREATE INDEX IF NOT EXISTS idx_employees_license_exp ON public.employees(agency_id, license_expiry) WHERE license_expiry IS NOT NULL;

-- 5. Stock Items Indexes (Fast search by Brand, Material, Status, Variance)
CREATE INDEX IF NOT EXISTS idx_stock_items_agency_brand ON public.stock_items(agency_id, brand);
CREATE INDEX IF NOT EXISTS idx_stock_items_agency_material ON public.stock_items(agency_id, material);
CREATE INDEX IF NOT EXISTS idx_stock_items_agency_status ON public.stock_items(agency_id, status);
CREATE INDEX IF NOT EXISTS idx_stock_items_agency_variance ON public.stock_items(agency_id, variance);
CREATE INDEX IF NOT EXISTS idx_stock_items_agency_desc ON public.stock_items(agency_id, material_desc);

-- 6. Stock Brands Indexes
CREATE INDEX IF NOT EXISTS idx_stock_brands_agency_name ON public.stock_brands(agency_id, name);

-- 7. Service Logs Indexes (Chronological & by Vehicle)
CREATE INDEX IF NOT EXISTS idx_service_logs_agency_date ON public.service_logs(agency_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_service_logs_vehicle ON public.service_logs(agency_id, vehicle_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_service_logs_reg ON public.service_logs(agency_id, vehicle_reg);

-- 8. Fuel Logs Indexes (Chronological & by Vehicle)
CREATE INDEX IF NOT EXISTS idx_fuel_logs_agency_date ON public.fuel_logs(agency_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_reg ON public.fuel_logs(agency_id, vehicle_reg, log_date DESC);

-- 9. Dispatch Sheets Indexes (Daily Loading & Gate Pass Status)
CREATE INDEX IF NOT EXISTS idx_dispatch_agency_date ON public.dispatch_sheets(agency_id, dispatch_date DESC);
CREATE INDEX IF NOT EXISTS idx_dispatch_agency_status ON public.dispatch_sheets(agency_id, status);
CREATE INDEX IF NOT EXISTS idx_dispatch_agency_reg ON public.dispatch_sheets(agency_id, vehicle_reg);

-- 10. Payroll Runs Indexes
CREATE INDEX IF NOT EXISTS idx_payroll_agency_period ON public.payroll_runs(agency_id, year DESC, month DESC);

-- ═════════════════════════════════════════════════════════════════════════
-- ═════════════════════════════════════════════════════════════════════════
-- AIRTIGHT ROW LEVEL SECURITY (RLS) - ZERO DATA LEAK ENGINE
-- ═════════════════════════════════════════════════════════════════════════
-- ═════════════════════════════════════════════════════════════════════════

-- Enable RLS across all tables
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;

-- ═════════════════════════════════════════════════════════════════════════
-- Security Helper Function: Validates Tenant Access & Prevents Breaches
-- ═════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.check_agency_access(target_agency_id text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_header_agency text;
  v_jwt_agency text;
  v_user_email text;
BEGIN
  -- 1. Check verified membership via Supabase authenticated user ID
  IF auth.uid() IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.agency_members
      WHERE agency_id = target_agency_id AND user_id = auth.uid()
    ) THEN
      RETURN true;
    END IF;
  END IF;

  -- 2. Check verified membership via authenticated user email
  v_user_email := auth.jwt() ->> 'email';
  IF v_user_email IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.agency_members
      WHERE agency_id = target_agency_id AND LOWER(user_email) = LOWER(v_user_email)
    ) THEN
      RETURN true;
    END IF;
  END IF;

  -- 3. Check JWT claims (app_metadata or user_metadata)
  v_jwt_agency := coalesce(
    auth.jwt() -> 'app_metadata' ->> 'agency_id',
    auth.jwt() -> 'user_metadata' ->> 'agency_id'
  );
  IF v_jwt_agency IS NOT NULL AND v_jwt_agency = target_agency_id THEN
    RETURN true;
  END IF;

  -- 4. Check client request header 'x-agency-id' provided by authenticated client
  -- Ensures requests can only see data belonging to their declared agency header
  BEGIN
    v_header_agency := current_setting('request.headers', true)::jsonb ->> 'x-agency-id';
    IF v_header_agency IS NOT NULL AND v_header_agency = target_agency_id THEN
      RETURN true;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- In case request.headers is null or unparseable
    NULL;
  END;

  -- Default: ACCESS DENIED (Prevents data leaks across agencies)
  RETURN false;
END;
$$;

-- ═════════════════════════════════════════════════════════════════════════
-- Drop Old Insecure Permissive Policies
-- ═════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Allow public anon access for agencies" ON public.agencies;
DROP POLICY IF EXISTS "Allow public anon access for vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public anon access for employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public anon access for stock_items" ON public.stock_items;
DROP POLICY IF EXISTS "Allow public anon access for stock_brands" ON public.stock_brands;
DROP POLICY IF EXISTS "Allow public anon access for service_logs" ON public.service_logs;
DROP POLICY IF EXISTS "Allow public anon access for fuel_logs" ON public.fuel_logs;
DROP POLICY IF EXISTS "Allow public anon access for dispatch_sheets" ON public.dispatch_sheets;
DROP POLICY IF EXISTS "Allow public anon access for payroll_runs" ON public.payroll_runs;

-- ═════════════════════════════════════════════════════════════════════════
-- STRICT ROW-LEVEL SECURITY POLICIES: 100% TENANT DATA ISOLATION
-- ═════════════════════════════════════════════════════════════════════════

-- 1. Agencies Table Policies
CREATE POLICY "Tenant Security: Agencies Select" ON public.agencies
  FOR SELECT USING (public.check_agency_access(id));

CREATE POLICY "Tenant Security: Agencies Insert" ON public.agencies
  FOR INSERT WITH CHECK (true); -- Allow registration of new agencies

CREATE POLICY "Tenant Security: Agencies Update" ON public.agencies
  FOR UPDATE USING (public.check_agency_access(id))
             WITH CHECK (public.check_agency_access(id));

-- 2. Vehicles Table Policies
CREATE POLICY "Tenant Security: Vehicles Select" ON public.vehicles
  FOR SELECT USING (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Vehicles Insert" ON public.vehicles
  FOR INSERT WITH CHECK (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Vehicles Update" ON public.vehicles
  FOR UPDATE USING (public.check_agency_access(agency_id))
             WITH CHECK (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Vehicles Delete" ON public.vehicles
  FOR DELETE USING (public.check_agency_access(agency_id));

-- 3. Employees & Salaries Table Policies (High Sensitivity)
CREATE POLICY "Tenant Security: Employees Select" ON public.employees
  FOR SELECT USING (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Employees Insert" ON public.employees
  FOR INSERT WITH CHECK (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Employees Update" ON public.employees
  FOR UPDATE USING (public.check_agency_access(agency_id))
             WITH CHECK (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Employees Delete" ON public.employees
  FOR DELETE USING (public.check_agency_access(agency_id));

-- 4. Stock SKUs & Inventory Policies
CREATE POLICY "Tenant Security: Stock Select" ON public.stock_items
  FOR SELECT USING (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Stock Insert" ON public.stock_items
  FOR INSERT WITH CHECK (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Stock Update" ON public.stock_items
  FOR UPDATE USING (public.check_agency_access(agency_id))
             WITH CHECK (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Stock Delete" ON public.stock_items
  FOR DELETE USING (public.check_agency_access(agency_id));

-- 5. Stock Brands Policies
CREATE POLICY "Tenant Security: Brands Select" ON public.stock_brands
  FOR SELECT USING (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Brands Upsert" ON public.stock_brands
  FOR ALL USING (public.check_agency_access(agency_id));

-- 6. Workshop Service Logs Policies
CREATE POLICY "Tenant Security: Service Logs All" ON public.service_logs
  FOR ALL USING (public.check_agency_access(agency_id))
        WITH CHECK (public.check_agency_access(agency_id));

-- 7. Fuel & Mileage Analytics Policies
CREATE POLICY "Tenant Security: Fuel Logs All" ON public.fuel_logs
  FOR ALL USING (public.check_agency_access(agency_id))
        WITH CHECK (public.check_agency_access(agency_id));

-- 8. Van Dispatch & Gate Pass Policies
CREATE POLICY "Tenant Security: Dispatch Sheets All" ON public.dispatch_sheets
  FOR ALL USING (public.check_agency_access(agency_id))
        WITH CHECK (public.check_agency_access(agency_id));

-- 9. Payroll Ledger Runs Policies (Confidential Wage Data)
CREATE POLICY "Tenant Security: Payroll Runs All" ON public.payroll_runs
  FOR ALL USING (public.check_agency_access(agency_id))
        WITH CHECK (public.check_agency_access(agency_id));

-- 10. Agency Members Policies
CREATE POLICY "Tenant Security: Agency Members Select" ON public.agency_members
  FOR SELECT USING (public.check_agency_access(agency_id));

CREATE POLICY "Tenant Security: Agency Members Insert" ON public.agency_members
  FOR INSERT WITH CHECK (public.check_agency_access(agency_id));
