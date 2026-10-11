import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { fmcgDb, calculateDaysLeft, formatCurrencyINR, formatDatePretty } from '../lib/fmcgDb';
import { formatCbbPcs } from '../lib/cbbUtils';
import {
  Truck,
  Package,
  Users,
  MapPin,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  ExternalLink
} from 'lucide-react';

export default function HubDashboard() {
  const { activeAgency } = useTenant();
  const navigate = useNavigate();

  const vehicles = fmcgDb.getVehicles(activeAgency.id);
  const stockItems = fmcgDb.getStockItems();
  const staff = fmcgDb.getEmployees(activeAgency.id);
  const payrollEntries = fmcgDb.getMonthlyPayroll();
  const dispatchSheets = fmcgDb.getDispatchSheets(activeAgency.id);

  // Computations
  const totalValuation = stockItems.reduce((acc, s) => acc + (s.systemStockCbb * s.conversion * s.mrp), 0);
  const shortageItems = stockItems.filter(s => s.status === 'Shortage');
  const netProcessedPayroll = payrollEntries.reduce((acc, p) => acc + (p.netPay || 0), 0);

  let groundedCount = 0;
  let expiringSoonCount = 0;

  vehicles.forEach(v => {
    const fcDays = calculateDaysLeft(v.fc?.expiryDate);
    const insDays = calculateDaysLeft(v.insurance?.expiryDate);
    if ((fcDays !== null && fcDays < 0) || (insDays !== null && insDays < 0)) {
      groundedCount++;
    } else if ((fcDays !== null && fcDays <= 30) || (insDays !== null && insDays <= 30)) {
      expiringSoonCount++;
    }
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* 1. Agency Master Strip */}
      <div className="panel" style={{ padding: '18px 22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                {activeAgency.name}
              </h1>
              <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>
                GSTIN: {activeAgency.gstin}
              </span>
              <span className="badge badge-emerald">
                {activeAgency.hubLocation}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Authorized Brands: <strong style={{ color: 'var(--text-main)' }}>{activeAgency.brands.join(', ')}</strong> · Trade: {activeAgency.tradeName}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Operations Date
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Operational Metrics Strip */}
      <div className="metrics-strip">
        <div className="metric-box">
          <div className="metric-box-title">Commercial Delivery Fleet</div>
          <div className="metric-box-val">
            {vehicles.length - groundedCount} / {vehicles.length} Units
          </div>
          <div className="metric-box-sub">
            {groundedCount > 0 ? (
              <span style={{ color: 'var(--rose-text)', fontWeight: 700 }}>{groundedCount} Grounded (Doc Expired)</span>
            ) : (
              <span style={{ color: 'var(--emerald-text)' }}>All units road-legal</span>
            )}
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">Godown Inventory Value</div>
          <div className="metric-box-val">
            {formatCurrencyINR(totalValuation)}
          </div>
          <div className="metric-box-sub">
            {shortageItems.length > 0 ? (
              <span style={{ color: 'var(--amber-text)', fontWeight: 700 }}>{shortageItems.length} SKUs Discrepancy Found</span>
            ) : (
              <span style={{ color: 'var(--emerald-text)' }}>Audit counts matched</span>
            )}
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">Driver & Staff Payroll</div>
          <div className="metric-box-val">
            {staff.length} Employees
          </div>
          <div className="metric-box-sub">
            {formatCurrencyINR(netProcessedPayroll)} disbursed (September 2026)
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">Daily Van Dispatches</div>
          <div className="metric-box-val">
            {dispatchSheets.length} Delivery Beats
          </div>
          <div className="metric-box-sub">
            102 cartons loaded · 30 returnable crates
          </div>
        </div>
      </div>

      {/* 3. Operational Split Layout (No repeating cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Fleet Compliance Table & Stock Discrepancy Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Urgent Vehicle Compliance Status */}
          <div className="panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Vehicle RC/FC & Insurance Compliance</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status of delivery vans, mini-trucks, and logistics permits</p>
              </div>
              <Link to="/fleet" className="btn btn-secondary btn-sm">
                View Fleet Roster →
              </Link>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Model & Driver</th>
                    <th>Fitness (FC)</th>
                    <th>Insurance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.slice(0, 4).map(v => {
                    const fcDays = calculateDaysLeft(v.fc?.expiryDate);
                    const insDays = calculateDaysLeft(v.insurance?.expiryDate);
                    return (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          {v.regNo}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{v.model}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{v.driverName}</div>
                        </td>
                        <td>
                          {fcDays === null ? (
                            <span style={{ color: 'var(--text-dim)' }}>Exempt</span>
                          ) : fcDays < 0 ? (
                            <span className="badge badge-rose">EXPIRED ({Math.abs(fcDays)}d ago)</span>
                          ) : fcDays <= 30 ? (
                            <span className="badge badge-amber">{fcDays}d left</span>
                          ) : (
                            <span className="badge badge-emerald">Valid</span>
                          )}
                        </td>
                        <td>
                          {insDays === null ? (
                            <span style={{ color: 'var(--text-dim)' }}>—</span>
                          ) : insDays < 0 ? (
                            <span className="badge badge-rose">EXPIRED ({Math.abs(insDays)}d ago)</span>
                          ) : insDays <= 30 ? (
                            <span className="badge badge-amber">{insDays}d left</span>
                          ) : (
                            <span className="badge badge-emerald">Valid</span>
                          )}
                        </td>
                        <td>
                          <Link to="/fleet?tab=compliance" className="btn btn-secondary btn-sm" style={{ padding: '3px 8px', fontSize: '11px' }}>
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Physical Audit Discrepancies */}
          <div className="panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Godown Physical Stock Audit (CBB / PCS)</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Inventory variances detected between warehouse count and ERP</p>
              </div>
              <Link to="/stock" className="btn btn-secondary btn-sm">
                Open Stock Engine →
              </Link>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU Material</th>
                    <th>Brand</th>
                    <th>System CBB</th>
                    <th>Physical CBB</th>
                    <th>Variance</th>
                    <th>Diff (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.slice(0, 4).map(s => {
                    const cbbText = formatCbbPcs(s.variance * s.conversion, s.conversion, true);
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{s.materialDesc}</div>
                          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{s.material}</div>
                        </td>
                        <td>{s.brand}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{s.systemStockCbb} CBB</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{s.physicalStockCbb} CBB</td>
                        <td>
                          <span style={{ color: s.variance < 0 ? 'var(--rose-text)' : s.variance > 0 ? 'var(--amber-text)' : 'var(--emerald-text)', fontWeight: 700 }}>
                            {cbbText || '0 CBB'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {formatCurrencyINR(s.varianceValue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Real Product Screenshot + Payroll Card + Dispatches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Real Product Screenshot Integration (Payroll Engine) */}
          <div className="panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>HR & Wage Payroll Engine</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Staff salary processing, daily driver wages & payslips</p>
              </div>
              <Link to="/payroll" className="btn btn-primary btn-sm">
                Enter Payroll →
              </Link>
            </div>

            {/* Real Product Screenshot */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              marginBottom: '14px',
              background: '#0F172A'
            }}>
              <img
                src="/payroll-screenshot.webp"
                alt="Payroll System Product Dashboard"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>4 Drivers on duty</span>
              <span style={{ color: 'var(--emerald-text)', fontWeight: 700 }}>100% License Compliant</span>
              <Link to="/payroll?tab=payslips" style={{ color: 'var(--primary-text)', fontWeight: 700, textDecoration: 'none' }}>
                Download Payslips →
              </Link>
            </div>
          </div>

          {/* Morning Van Loading Gate Pass */}
          <div className="panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Morning Van Loading & Gate Pass</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Route delivery loading sheets and returnable crate tracker</p>
              </div>
              <Link to="/dispatch" className="btn btn-secondary btn-sm">
                New Manifest →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dispatchSheets.map(dsp => (
                <div key={dsp.id} style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: '#0D131F',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      {dsp.vehicleReg} · {dsp.driverName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {dsp.routeBeat}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px' }}>
                      {dsp.totalCartons} Cartons
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {dsp.plasticCratesIssued} Crates Out
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
