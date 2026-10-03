import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { fmcgDb, calculateDaysLeft, formatCurrencyINR, formatDatePretty } from '../lib/fmcgDb';
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
  Fuel,
  Wrench,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  FileText
} from 'lucide-react';

export default function HubDashboard() {
  const { activeAgency } = useTenant();
  const { user } = useAuth();
  const navigate = useNavigate();

  const vehicles = fmcgDb.getVehicles(activeAgency.id);
  const stockSummary = fmcgDb.get().stockSummary;
  const payrollSummary = fmcgDb.get().payrollSummary;
  const dispatchSheets = fmcgDb.getDispatchSheets(activeAgency.id);

  // Compliance calculations
  let criticalCount = 0;
  let warningCount = 0;
  let activeVehicles = 0;

  vehicles.forEach(v => {
    if (v.status === 'Active') activeVehicles++;
    const fcDays = calculateDaysLeft(v.fc?.expiryDate);
    const insDays = calculateDaysLeft(v.insurance?.expiryDate);

    if ((fcDays !== null && fcDays < 0) || (insDays !== null && insDays < 0)) {
      criticalCount++;
    } else if ((fcDays !== null && fcDays <= 30) || (insDays !== null && insDays <= 30)) {
      warningCount++;
    }
  });

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Banner & Agency Info */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-40px',
          top: '-40px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '26px' }}>{activeAgency.logoEmoji}</span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
              {activeAgency.name}
            </h1>
            <span className="badge badge-emerald" style={{ marginLeft: '6px' }}>
              GSTIN: {activeAgency.gstin}
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '12px' }}>
            {activeAgency.tradeName} · <strong style={{ color: 'var(--text-main)' }}>{activeAgency.hubLocation}</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>Authorized FMCG Brands:</span>
            {activeAgency.brands.map((brand, i) => (
              <span key={i} style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--text-main)'
              }}>
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Date & Quick Status widget */}
        <div style={{ zIndex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Operations Date
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <span className="pulse-indicator" style={{ background: 'var(--emerald)' }} />
            <span style={{ fontSize: '12px', color: 'var(--emerald)', fontWeight: 700 }}>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* 2. Urgent Alerts Bar (if any vehicle needs FC or Insurance renewal) */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div style={{
          background: criticalCount > 0 ? 'var(--rose-bg)' : 'var(--amber-bg)',
          border: `1px solid ${criticalCount > 0 ? 'var(--rose-border)' : 'var(--amber-border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px 22px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: criticalCount > 0 ? 'var(--rose)' : 'var(--amber)',
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: criticalCount > 0 ? '#FCA5A5' : '#FDE68A' }}>
                {criticalCount > 0
                  ? `🚨 ACTION REQUIRED: ${criticalCount} Vehicle Document Expired & Grounded!`
                  : `⚠️ Compliance Notice: ${warningCount} Vehicle Document(s) Expiring within 30 Days`}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Ensure valid Fitness Certificates (FC) and Insurance policies to prevent RTO penalties or transit seizures.
              </div>
            </div>
          </div>

          <Link
            to="/fleet?tab=compliance"
            className="btn btn-sm"
            style={{
              background: criticalCount > 0 ? 'var(--rose)' : 'var(--amber)',
              color: '#FFFFFF',
              fontWeight: 700
            }}
          >
            Review Compliance Vault →
          </Link>
        </div>
      )}

      {/* 3. KPI Summary Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* KPI 1: Fleet */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Fleet Operations
            </span>
            <div style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '7px', borderRadius: '10px' }}>
              <Truck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
            {activeVehicles} / {vehicles.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span className={`badge ${criticalCount > 0 ? 'badge-rose' : warningCount > 0 ? 'badge-amber' : 'badge-emerald'}`}>
              {criticalCount > 0 ? `${criticalCount} Grounded` : `${activeVehicles} Delivery Ready`}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vans & trucks</span>
          </div>
        </div>

        {/* KPI 2: Stock */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stock Inventory
            </span>
            <div style={{ color: 'var(--emerald)', background: 'var(--emerald-bg)', padding: '7px', borderRadius: '10px' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
            {formatCurrencyINR(stockSummary.totalValuation)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span className="badge badge-amber">{stockSummary.criticalLowStockSkus.length} SKUs Low</span>
            <span style={{ color: 'var(--text-muted)' }}>across {stockSummary.totalSkus} active SKUs</span>
          </div>
        </div>

        {/* KPI 3: Payroll */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Staff & Payroll
            </span>
            <div style={{ color: '#F59E0B', background: 'var(--amber-bg)', padding: '7px', borderRadius: '10px' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
            {payrollSummary.presentToday} / {payrollSummary.totalStaff}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span className="badge badge-emerald">On Duty Today</span>
            <span style={{ color: 'var(--text-muted)' }}>₹{Math.round(payrollSummary.monthlyGrossPayroll / 1000)}k Monthly Gross</span>
          </div>
        </div>

        {/* KPI 4: Dispatches */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's Route Dispatches
            </span>
            <div style={{ color: '#06B6D4', background: 'var(--cyan-bg)', padding: '7px', borderRadius: '10px' }}>
              <MapPin size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
            {dispatchSheets.length} Delivery Vans
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span className="badge badge-cyan">102 Cartons Dispatched</span>
            <span style={{ color: 'var(--text-muted)' }}>61 stores</span>
          </div>
        </div>
      </div>

      {/* 4. Section Title: Enterprise Business Modules */}
      <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Business Suite Launchpad</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Select any operations portal to manage daily FMCG agency workflows
          </p>
        </div>
      </div>

      {/* 5. The 4 Interactive Launchpad Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Module 1: Fleet & Vehicles */}
        <div
          onClick={() => navigate('/fleet')}
          className="glass-panel glass-panel-interactive"
          style={{
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
              }}>
                <Truck size={24} />
              </div>
              <span className="badge badge-purple">Core Fleet Ops</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              Vehicle & Fleet Management
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Manage delivery trucks, autos, and vans. Track Fitness Certificates (FC), Insurance renewals, PUC, and workshop service history.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '20px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registered Fleet:</span>
                <strong style={{ color: 'var(--text-main)' }}>{vehicles.length} Commercial Units</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>FC & Insurance Due:</span>
                <strong style={{ color: criticalCount > 0 ? 'var(--rose)' : warningCount > 0 ? 'var(--amber)' : 'var(--emerald)' }}>
                  {criticalCount > 0 ? `${criticalCount} Expired` : warningCount > 0 ? `${warningCount} Expiring Soon` : 'All Active'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Work Orders:</span>
                <strong style={{ color: 'var(--text-main)' }}>3 Recent Garage Bills</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
            <span>Enter Fleet Portal</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Module 2: Stock & Inventory */}
        <div
          onClick={() => navigate('/stock')}
          className="glass-panel glass-panel-interactive"
          style={{
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}>
                <Package size={24} />
              </div>
              <span className="badge badge-emerald">Godown Stock</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              FMCG StockSync & Audit
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Godown inventory counts, physical vs. system audit variance calculations, SKU valuation, and fast-moving brand restocking.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '20px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Warehouse Valuation:</span>
                <strong style={{ color: 'var(--text-main)' }}>{formatCurrencyINR(stockSummary.totalValuation)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Low Stock SKU Alerts:</span>
                <strong style={{ color: 'var(--amber)' }}>4 Products Below Min</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active SKU Directory:</span>
                <strong style={{ color: 'var(--text-main)' }}>{stockSummary.totalSkus} FMCG Items</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--emerald)', fontWeight: 700, fontSize: '13px' }}>
            <span>Enter Stock Portal</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Module 3: Payroll & HR */}
        <div
          onClick={() => navigate('/payroll')}
          className="glass-panel glass-panel-interactive"
          style={{
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
              }}>
                <Users size={24} />
              </div>
              <span className="badge badge-amber">Staff & HR</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              HR, Attendance & Payroll
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Daily worker attendance, salary slips, incentives for sales order booking, and driver license validity verification.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '20px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Staff Attendance:</span>
                <strong style={{ color: 'var(--emerald)' }}>{payrollSummary.presentToday} Present ({payrollSummary.onLeaveToday} On Leave)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Drivers on Duty:</span>
                <strong style={{ color: 'var(--text-main)' }}>4 Licensed Drivers</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pending Approvals:</span>
                <strong style={{ color: 'var(--text-main)' }}>{payrollSummary.pendingPayslipApprovals} Payslips</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#F59E0B', fontWeight: 700, fontSize: '13px' }}>
            <span>Enter Payroll Portal</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Module 4: Van Beat Dispatch & Gate Pass */}
        <div
          onClick={() => navigate('/dispatch')}
          className="glass-panel glass-panel-interactive"
          style={{
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)'
              }}>
                <MapPin size={24} />
              </div>
              <span className="badge badge-cyan">Logistics</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              Van Loading & Gate Pass
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Generate delivery route loading manifests, track plastic delivery crate returns from retailers, and print godown gate passes.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '20px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Morning Vans Dispatched:</span>
                <strong style={{ color: 'var(--text-main)' }}>{dispatchSheets.length} Routes Active</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cartons Loaded:</span>
                <strong style={{ color: 'var(--text-main)' }}>102 Cartons Dispatched</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Crate Recovery:</span>
                <strong style={{ color: 'var(--cyan)' }}>12 Returned / 18 In Market</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#06B6D4', fontWeight: 700, fontSize: '13px' }}>
            <span>Generate Loading Sheet</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* 6. Quick Fleet Status Table Preview */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
              Fleet Operations & Compliance Overview
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Real-time snapshot of delivery vehicles assigned to {activeAgency.name}
            </p>
          </div>
          <Link to="/fleet" className="btn btn-secondary btn-sm">
            Manage All Vehicles →
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle / Reg No</th>
                <th>Type & Fuel</th>
                <th>Assigned Route & Driver</th>
                <th>Fitness Cert (FC)</th>
                <th>Insurance Expiry</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const fcDays = calculateDaysLeft(v.fc?.expiryDate);
                const insDays = calculateDaysLeft(v.insurance?.expiryDate);
                return (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)' }}>
                        {v.regNo}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {v.model}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        {v.type} ({v.fuelType})
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--text-main)' }}>
                        {v.driverName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.assignedRoute}
                      </div>
                    </td>
                    <td>
                      {fcDays === null ? (
                        <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Exempt</span>
                      ) : fcDays < 0 ? (
                        <span className="badge badge-rose">EXPIRED {Math.abs(fcDays)}d ago</span>
                      ) : fcDays <= 30 ? (
                        <span className="badge badge-amber">Expires in {fcDays}d</span>
                      ) : (
                        <span className="badge badge-emerald">Valid till {formatDatePretty(v.fc?.expiryDate)}</span>
                      )}
                    </td>
                    <td>
                      {insDays === null ? (
                        <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>—</span>
                      ) : insDays < 0 ? (
                        <span className="badge badge-rose">EXPIRED {Math.abs(insDays)}d ago</span>
                      ) : insDays <= 30 ? (
                        <span className="badge badge-amber">Expires in {insDays}d</span>
                      ) : (
                        <span className="badge badge-emerald">{formatDatePretty(v.insurance?.expiryDate)}</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${v.status === 'Active' ? 'badge-emerald' : 'badge-rose'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/fleet?vehicle=${v.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
