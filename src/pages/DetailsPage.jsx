import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import {
  ShieldCheck,
  Package,
  Truck,
  FileText,
  Users,
  Layers,
  ArrowRight,
  Lock,
  CheckCircle2,
  Building2,
  Sparkles,
  TrendingUp,
  BarChart3,
  EyeOff,
  ChevronDown,
  LogIn,
  Check,
  Clock,
  Database,
  Search,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Info,
  Server,
  ArrowLeft,
  Calendar,
  Smartphone,
  Cpu,
  HelpCircle
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function DetailsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAuditor, login } = useAuth();
  const { activeAgency, allAgencies, switchAgency } = useTenant();

  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'blind-audit' | 'fleet' | 'stock' | 'payroll' | 'dispatch' | 'multi-tenant' | 'tech'
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  // Navigate to login page based on role (does NOT auto login)
  const handleNavigateToLogin = (role = 'admin') => {
    setLoginMenuOpen(false);
    if (isAuthenticated) {
      navigate(isAuditor ? '/stock-audit' : '/');
    } else {
      navigate(`/login?role=${role}`);
    }
  };

  const sections = [
    { id: 'overview', label: '1. Platform Overview', icon: Layers, badge: 'Executive' },
    { id: 'blind-audit', label: '2. Masked Blind Audit', icon: Lock, badge: 'Anti-Fraud' },
    { id: 'fleet', label: '3. Fleet & FC Compliance', icon: Truck, badge: 'Logistics' },
    { id: 'stock', label: '4. Stock & Excel MRP Engine', icon: Package, badge: 'Inventory' },
    { id: 'payroll', label: '5. Dynamic Staff Payroll', icon: Users, badge: 'HR & Wage' },
    { id: 'dispatch', label: '6. Van Loading & Security', icon: FileText, badge: 'Dispatch' },
    { id: 'multi-tenant', label: '7. Multi-Tenant Isolation', icon: Building2, badge: 'Agencies' },
    { id: 'tech', label: '8. Technical Architecture', icon: Cpu, badge: 'Supabase' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-canvas)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* ========================================================= */}
      {/* TOP HEADER / NAVBAR (CONSISTENT ACROSS ALL PAGES) */}
      {/* ========================================================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Logo & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
              }}>
                <Truck size={19} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-main)'
                  }}>
                    FMCG Suite
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '10px' }}>Docs & Specs</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  Enterprise Portal Specifications
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                to="/landing"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Home</span>
              </Link>
              <span style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--primary-text)',
                background: 'var(--primary-subtle)',
                border: '1px solid #BFDBFE'
              }}>
                Portal Details & Guide
              </span>
            </nav>
          </div>

          {/* Right Controls & Login Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface-subtle)',
              fontSize: '12px',
              fontWeight: 600
            }}>
              <Building2 size={13} color="#2563EB" />
              <span>{activeAgency?.name || 'Thulir Agencies'}</span>
            </div>

            {/* Top Login Menu Button */}
            <div style={{ position: 'relative' }}>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(isAuditor ? '/stock-audit' : '/')}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12.5px' }}
                >
                  <span>Open Workspace</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12.5px' }}
                >
                  <LogIn size={14} />
                  <span>Login Menu</span>
                  <ChevronDown size={14} />
                </button>
              )}

              {/* Login dropdown */}
              {loginMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '310px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '10px',
                  zIndex: 100
                }}>
                  <div style={{ padding: '6px 8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                      Quick Portal Access
                    </div>
                  </div>
                  <div
                    onClick={() => handleNavigateToLogin('admin')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '13px' }}>🏢 Operations Admin</strong>
                      <span className="badge badge-cyan" style={{ fontSize: '9px' }}>Full Access</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>admin@thulir.com</div>
                  </div>
                  <div
                    onClick={() => handleNavigateToLogin('checker')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '13px' }}>📦 Godown Auditor</strong>
                      <span className="badge badge-amber" style={{ fontSize: '9px' }}>Masked</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>checker@thulir.com</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* PAGE BANNER */}
      {/* ========================================================= */}
      <section style={{
        background: 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)',
        borderBottom: '1px solid var(--border-medium)',
        padding: '36px 24px 28px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Link to="/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              <ArrowLeft size={13} /> Return to Home
            </Link>
            <span style={{ color: 'var(--text-dim)' }}>/</span>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Complete System Specifications</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                Enterprise Portal Architecture & Detailed Specifications
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '820px' }}>
                In-depth documentation of all 6 core operational modules, the anti-fraud masked godown audit protocol, Supabase cloud synchronization, and role-based permissions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleNavigateToLogin('admin')}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 16px' }}
              >
                <span>Go to Admin Login</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN DOCUMENTATION LAYOUT (SIDEBAR + CONTENT) */}
      {/* ========================================================= */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px 64px',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '32px',
        width: '100%'
      }}>
        {/* Sticky Left Navigation Table of Contents */}
        <aside style={{
          position: 'sticky',
          top: '80px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'var(--bg-surface)',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px', padding: '0 8px' }}>
            Documentation Sections
          </div>

          {sections.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${active ? '#BFDBFE' : 'transparent'}`,
                  background: active ? 'var(--primary-subtle)' : 'transparent',
                  color: active ? 'var(--primary-text)' : 'var(--text-main)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={15} color={active ? '#2563EB' : 'var(--text-dim)'} />
                  <span>{sec.label}</span>
                </div>
                <span className={`badge ${active ? 'badge-cyan' : 'badge-neutral'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                  {sec.badge}
                </span>
              </button>
            );
          })}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', padding: '12px 8px 4px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>SYSTEM STATUS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: '#059669', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
              Supabase PostgreSQL Online
            </div>
          </div>
        </aside>

        {/* Content Body Area */}
        <main style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
          padding: '36px'
        }}>
          {/* SECTION 1: PLATFORM OVERVIEW */}
          {activeSection === 'overview' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">Section 1</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Core Operational Vision</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                FMCG Distribution Operating System
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '24px' }}>
                The <strong>FMCG Enterprise Operations Business Suite</strong> is engineered specifically for authorized fast-moving consumer goods (FMCG) distributors, super-stockists, carrying & forwarding (C&F) agencies, and wholesale logistics hubs.
                High-velocity distribution businesses manage thousands of physical cartons daily with narrow margins. Traditional generic ERPs fail because they do not handle dual-unit conversion (Cartons vs Loose Pieces), driver trip fuel incentives, vehicle compliance vaults, or anti-theft godown counting.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '18px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <ShieldCheck size={18} color="#059669" />
                    <strong style={{ fontSize: '14px' }}>Zero-Variance Integrity</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Enforces blind physical tallying, eliminating unverified copy-pasting of book inventory.
                  </p>
                </div>

                <div style={{ padding: '18px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Truck size={18} color="#2563EB" />
                    <strong style={{ fontSize: '14px' }}>Unified Fleet Logistics</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Tracks vehicle fitness certificates, driver assignments, diesel mileage, and delivery passes.
                  </p>
                </div>

                <div style={{ padding: '18px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Users size={18} color="#D97706" />
                    <strong style={{ fontSize: '14px' }}>26-Day Formula Payroll</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Automatically computes driver kilometer incentives, advance salary deductions, and payslips.
                  </p>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '24px 0 12px' }}>User Role Access Matrix</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Module / Capability</th>
                      <th>🏢 Operations Admin</th>
                      <th>📦 Godown Stock Auditor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Excel Master Stock Upload (StockMRP.xlsx)</strong></td>
                      <td><span className="badge badge-emerald">Full Access</span></td>
                      <td><span className="badge badge-rose">Blocked</span></td>
                    </tr>
                    <tr>
                      <td><strong>System Book Stock (CBB & PCS) Visibility</strong></td>
                      <td><span className="badge badge-emerald">Unmasked (Visible)</span></td>
                      <td><span className="badge badge-amber">🔒 MASKED (Hidden)</span></td>
                    </tr>
                    <tr>
                      <td><strong>Physical Inventory Count Entry</strong></td>
                      <td><span className="badge badge-emerald">Editable</span></td>
                      <td><span className="badge badge-emerald">Editable (Dedicated)</span></td>
                    </tr>
                    <tr>
                      <td><strong>Financial Discrepancy & Variance ₹ Valuation</strong></td>
                      <td><span className="badge badge-emerald">Full Analytics</span></td>
                      <td><span className="badge badge-rose">Hidden</span></td>
                    </tr>
                    <tr>
                      <td><strong>Fleet Logistics & FC Vault</strong></td>
                      <td><span className="badge badge-emerald">Full Access</span></td>
                      <td><span className="badge badge-rose">Blocked</span></td>
                    </tr>
                    <tr>
                      <td><strong>Driver & Staff Payroll Processing</strong></td>
                      <td><span className="badge badge-emerald">Full Access</span></td>
                      <td><span className="badge badge-rose">Blocked</span></td>
                    </tr>
                    <tr>
                      <td><strong>Van Loading Dispatch Passes</strong></td>
                      <td><span className="badge badge-emerald">Create & Print</span></td>
                      <td><span className="badge badge-neutral">View & Verify</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 2: MASKED BLIND AUDIT */}
          {activeSection === 'blind-audit' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-amber">Section 2</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Core Anti-Fraud Security Engine</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Masked Godown Blind Stock Audit Protocol
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                In FMCG warehousing, physical stock audits are the single largest source of financial leakages. When warehouse staff see system quantities (e.g. 150 Cartons), they almost invariably write down 150 Cartons without checking behind pallets, hiding transit breakage, water leakage, or employee theft.
              </p>

              <div style={{
                padding: '20px',
                background: '#FFFBEB',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #FDE68A',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Lock size={18} color="#92400E" />
                  <strong style={{ color: '#92400E', fontSize: '14px' }}>The Blind Masking Guarantee</strong>
                </div>
                <p style={{ fontSize: '12.5px', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
                  Under the Godown Auditor login (<code>checker@thulir.com</code>), the application explicitly suppresses and redacts the <code>stockCbb</code> and <code>stockPcs</code> fields. They are rendered on screen as:
                  <br />
                  <code style={{ background: '#FEF3C7', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, color: '#B45309' }}>•••••• MASKED •••••• (Hidden for Blind Audit)</code>
                  <br />
                  The staff member must physically walk the rows, count whole cartons (CBB) and loose pieces (PCS), and log any damaged packaging before saving.
                </p>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '24px 0 12px' }}>Blind Audit Mathematical Formulation</h3>
              <div style={{
                padding: '16px',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-main)',
                lineHeight: 1.8,
                marginBottom: '24px'
              }}>
                <div>1. Total System Pieces = (System_CBB × Conversion_Factor) + System_PCS</div>
                <div>2. Total Physical Pieces = (Physical_CBB × Conversion_Factor) + Physical_PCS</div>
                <div>3. Total Variance Pieces = Total_Physical_Pieces - Total_System_Pieces</div>
                <div>4. Variance CBB = Math.trunc(Total_Variance_Pieces / Conversion_Factor)</div>
                <div>5. Variance PCS = Total_Variance_Pieces % Conversion_Factor</div>
                <div>6. Financial Variance ₹ = Total_Variance_Pieces × (MRP / Conversion_Factor)</div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleNavigateToLogin('checker')} className="btn btn-emerald btn-sm">
                  <span>Go to Godown Auditor Login</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: FLEET & COMPLIANCE */}
          {activeSection === 'fleet' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">Section 3</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Vehicle Asset Lifecycle</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Fleet Management & RTO Fitness (FC) Vault
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                FMCG distribution relies on dedicated commercial delivery vehicles (Tata Ace, Ashok Leyland Dost, Eicher Pro, Mahindra Bolero Maxi Truck). Failure to renew RTO Fitness Certificates (FC), Commercial Insurance, or National Road Permits leads to police impoundment and delayed delivery routes.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)' }}>
                  <h4 style={{ fontSize: '13.5px', margin: '0 0 6px 0' }}>RTO Fitness Certificate (FC)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Tracks FC expiry date, issuing RTO office, and warns when fewer than 30 days remain with automated visual badges in the top navigation bar.
                  </p>
                </div>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)' }}>
                  <h4 style={{ fontSize: '13.5px', margin: '0 0 6px 0' }}>Commercial Vehicle Insurance</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Stores policy numbers (e.g. United India, HDFC Ergo, ICICI Lombard), coverage limits, and premium payment cycles.
                  </p>
                </div>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)' }}>
                  <h4 style={{ fontSize: '13.5px', margin: '0 0 6px 0' }}>Trip Fuel & Mileage Tally</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Calculates diesel consumption per kilometer, cargo payload capacity utilization (CBB volume), and driver trip cost per route.
                  </p>
                </div>
              </div>

              <button onClick={() => navigate('/fleet')} className="btn btn-primary btn-sm">
                <span>View Fleet Management Portal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* SECTION 4: STOCK & EXCEL MRP */}
          {activeSection === 'stock' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-emerald">Section 4</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Inventory Engine</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Stock Management & Excel MRP Upload Engine
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                FMCG stockists receive daily or weekly billing dumps from parent corporations (ITC, Britannia, Nestle, Tata Consumer, HUL) in <code>StockMRP.xlsx</code> formats. Our parsing engine automatically reads these workbooks, identifies product hierarchies, and initializes conversion factors.
              </p>

              <div style={{ padding: '20px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileSpreadsheet size={16} color="#059669" />
                  <span>Standard Excel Header Schema</span>
                </h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Excel Column Header</th>
                        <th>Mapped Field</th>
                        <th>Sample Value</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>SKU / Item Code</code></td>
                        <td>skuId</td>
                        <td><code>ITC-ATT-10K</code></td>
                        <td>Unique catalog SKU identifier</td>
                      </tr>
                      <tr>
                        <td><code>Brand</code></td>
                        <td>brand</td>
                        <td><code>Aashirvaad</code></td>
                        <td>Parent product division</td>
                      </tr>
                      <tr>
                        <td><code>Description</code></td>
                        <td>description</td>
                        <td><code>Aashirvaad Atta 10kg</code></td>
                        <td>Full consumer item description</td>
                      </tr>
                      <tr>
                        <td><code>Pieces Per Carton</code></td>
                        <td>piecesPerCtn</td>
                        <td><code>4</code></td>
                        <td>Carton-to-piece conversion factor</td>
                      </tr>
                      <tr>
                        <td><code>Stock CBB</code></td>
                        <td>stockCbb</td>
                        <td><code>120</code></td>
                        <td>Whole cartons in warehouse</td>
                      </tr>
                      <tr>
                        <td><code>Stock PCS</code></td>
                        <td>stockPcs</td>
                        <td><code>2</code></td>
                        <td>Loose pieces in warehouse</td>
                      </tr>
                      <tr>
                        <td><code>MRP (₹)</code></td>
                        <td>mrp</td>
                        <td><code>480.00</code></td>
                        <td>Maximum retail consumer price</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <button onClick={() => navigate('/stock')} className="btn btn-primary btn-sm">
                <span>Open Stock Management Portal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* SECTION 5: PAYROLL */}
          {activeSection === 'payroll' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">Section 5</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Workforce & Compensation</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Dynamic FMCG Staff & Driver Payroll Architecture
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                FMCG distribution employs diverse roles with fundamentally different compensation structures: monthly warehouse managers, daily-wage pallet loaders, and route delivery drivers whose earnings depend on delivery distance and overtime.
              </p>

              <div style={{
                padding: '20px',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>The Standard 26-Day Formula</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  In accordance with Tamil Nadu and Indian distribution labor standards, monthly salaries are calculated based on <strong>26 working days</strong> per month (excluding 4 statutory weekly rest days).
                  <br /><br />
                  <code>Per-Day Wage Rate = Base Monthly Salary / 26 Working Days</code>
                  <br />
                  <code>Earned Base Pay = Days Worked × Per-Day Wage Rate</code>
                  <br />
                  <code>Net Salary = Earned Base + Distance Incentives + Overtime - Advance Deductions</code>
                </p>
              </div>

              <button onClick={() => navigate('/payroll')} className="btn btn-primary btn-sm">
                <span>Open Staff Payroll Portal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* SECTION 6: DISPATCH */}
          {activeSection === 'dispatch' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-emerald">Section 6</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Outbound Logistics</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Van Loading Dispatch Passes & Gate Security
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                Before any delivery vehicle exits the warehouse compound, security gate guards require a certified physical Van Loading Pass (VLP) cross-referencing customer delivery invoices, carton counts, and driver signatures.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <h4 style={{ fontSize: '13.5px', margin: '0 0 6px 0' }}>Unique Pass Identification</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Every outbound trip is assigned an immutable pass ID (e.g. <code>VLP-2026-0891</code>) timestamped upon generation.
                  </p>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <h4 style={{ fontSize: '13.5px', margin: '0 0 6px 0' }}>Automated PDF Generation</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                    Direct client-side PDF export with high-contrast print layouts formatted for thermal or laser printers at the loading dock.
                  </p>
                </div>
              </div>

              <button onClick={() => navigate('/dispatch')} className="btn btn-primary btn-sm">
                <span>Open Van Dispatch Portal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* SECTION 7: MULTI-TENANT */}
          {activeSection === 'multi-tenant' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">Section 7</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Enterprise Isolation</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Multi-Tenant Agency Isolation Architecture
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                Many enterprise distributors operate multiple distinct entities under different GSTINs (e.g. <em>Thulir Agencies</em> for ITC Foods & Confectionery, and <em>Sri Murugan Agencies</em> for Personal Care & Beverages).
              </p>

              <div style={{ padding: '20px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Tenant Partitioning Principles</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Agency ID Partition Key:</strong> Every vehicle, SKU, physical count, and employee record includes an <code>agencyId</code> attribute.</li>
                  <li><strong>Instant Agency Switching:</strong> Operations managers can switch between legal entities in 1-click via the header dropdown without re-authenticating.</li>
                  <li><strong>Self-Service Onboarding:</strong> New agencies can be provisioned in 30 seconds with custom GSTIN, hub location, and brand portfolio.</li>
                </ul>
              </div>

              <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
                <span>View Registered Agencies</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* SECTION 8: TECH ARCHITECTURE */}
          {activeSection === 'tech' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-emerald">Section 8</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Cloud & Local Resilience</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                Technical Stack & Supabase Cloud Integration
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '20px' }}>
                The application is engineered using a modern client-side framework with hybrid persistence: local browser storage caching for zero-latency offline response, paired with <strong>Supabase Cloud PostgreSQL</strong> for real-time multi-device synchronization.
              </p>

              <div className="table-container" style={{ marginBottom: '24px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Technology</th>
                      <th>Operational Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Frontend UI</strong></td>
                      <td>React 19 + Vite 8</td>
                      <td>Sub-second page rendering, ultra-responsive tactile inputs</td>
                    </tr>
                    <tr>
                      <td><strong>Cloud Database</strong></td>
                      <td>Supabase PostgreSQL</td>
                      <td>Multi-tenant persistence, indexed lookups, encrypted storage</td>
                    </tr>
                    <tr>
                      <td><strong>Offline Cache</strong></td>
                      <td>fmcgDb Browser Vault</td>
                      <td>Guarantees 100% functionality on warehouse floor during WiFi loss</td>
                    </tr>
                    <tr>
                      <td><strong>Document Export</strong></td>
                      <td>jsPDF + AutoTable</td>
                      <td>Client-side vector generation of audit reports and payslips</td>
                    </tr>
                    <tr>
                      <td><strong>Spreadsheet Parsing</strong></td>
                      <td>SheetJS (XLSX)</td>
                      <td>In-browser parsing of ERP Excel dumps without cloud upload latency</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#ECFDF5', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0', fontSize: '12.5px', color: '#065F46' }}>
                <Database size={16} color="#059669" />
                <span>
                  <strong>Active Connection Status:</strong> Connected to Supabase Cloud endpoint at <code>https://oozcrjltijcefzkjzqfk.supabase.co</code>
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer style={{
        marginTop: 'auto',
        padding: '24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        fontSize: '12px',
        color: 'var(--text-dim)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>FMCG Enterprise Operations Business Suite · Multi-Tenant Portal Edition 2026</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/landing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <Link to="/details" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>System Specifications</Link>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Login Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
