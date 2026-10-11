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
  BookOpen,
  Sliders,
  DollarSign,
  MapPin,
  ExternalLink,
  Zap,
  Shield,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAuditor, login } = useAuth();
  const { activeAgency, allAgencies, switchAgency } = useTenant();

  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [interactiveAuditMode, setInteractiveAuditMode] = useState('masked'); // 'masked' | 'admin'
  const [interactiveCountCbb, setInteractiveCountCbb] = useState(115);
  const [interactiveWorkingDays, setInteractiveWorkingDays] = useState(26);
  const [selectedRoute, setSelectedRoute] = useState('salem'); // 'salem' | 'trichy' | 'coimbatore'

  // Navigate to login page based on role (does NOT auto login)
  const handleNavigateToLogin = (role = 'admin') => {
    setLoginMenuOpen(false);
    if (isAuthenticated) {
      navigate(isAuditor ? '/stock-audit' : '/');
    } else {
      navigate(`/login?role=${role}`);
    }
  };

  // Live Payroll Simulation calculation
  const sampleBaseSalary = 24000;
  const calculatedPerDayWage = Math.round(sampleBaseSalary / interactiveWorkingDays);
  const earnedBasePay = calculatedPerDayWage * 24; // 24 days worked
  const driverIncentive = 3500;
  const advanceDeduction = 2000;
  const netCalculatedSalary = earnedBasePay + driverIncentive - advanceDeduction;

  // Live Route Simulation
  const routesData = {
    salem: { name: 'Salem Central Retailers', distance: '142 km', vehicle: 'Ashok Leyland Dost (TN-45-AK-8821)', diesel: '14.2 Liters', cbb: '185 CBB', value: '₹ 4,12,000' },
    trichy: { name: 'Trichy Wholesale Corridor', distance: '98 km', vehicle: 'Tata Ace Gold (TN-28-BZ-4102)', diesel: '9.8 Liters', cbb: '110 CBB', value: '₹ 2,45,000' },
    coimbatore: { name: 'Coimbatore Super Express', distance: '215 km', vehicle: 'Eicher Pro 2049 (TN-33-CQ-9914)', diesel: '26.8 Liters', cbb: '320 CBB', value: '₹ 7,80,000' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.06) 1.2px, transparent 1.2px)',
      backgroundSize: '28px 28px',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Ambient background glow top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '420px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.12) 0%, rgba(248, 250, 252, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ========================================================= */}
      {/* TOP HEADER / NAVBAR WITH LOGIN MENU */}
      {/* ========================================================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-medium)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
          {/* Brand Logo & Platform Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <Truck size={20} strokeWidth={2.3} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '17px',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: '#0F172A'
                  }}>
                    FMCG Suite
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '1px 7px' }}>
                    Enterprise OS
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0, fontWeight: 500 }}>
                  Operations, Fleet, Stock & Payroll
                </p>
              </div>
            </Link>

            {/* Navigation links across pages */}
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 600
            }}>
              <Link
                to="/landing"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--primary-text)',
                  background: 'var(--primary-subtle)',
                  textDecoration: 'none',
                  border: '1px solid #BFDBFE'
                }}
              >
                Home
              </Link>
              <Link
                to="/details"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'color 0.15s'
                }}
              >
                <BookOpen size={14} color="#2563EB" />
                <span>Portal Details & Specs</span>
              </Link>
              <a
                href="#interactive-demo"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Lock size={13} color="#D97706" />
                <span>Blind Audit Demo</span>
              </a>
              <a
                href="#solutions-grid"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  textDecoration: 'none'
                }}
              >
                Modules
              </a>
            </nav>
          </div>

          {/* Right Controls & Login Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Active Agency Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '12px',
              color: 'var(--text-main)',
              fontWeight: 600
            }}>
              <Building2 size={14} color="#2563EB" />
              <span>{activeAgency?.name || 'Thulir Agencies'}</span>
            </div>

            {/* TOP LOGIN MENU DROPDOWN */}
            <div style={{ position: 'relative' }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => navigate(isAuditor ? '/stock-audit' : '/')}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 18px',
                      fontSize: '13px',
                      boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
                    }}
                  >
                    <span>Open Operations Portal</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                    style={{
                      padding: '8px 10px',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} color="var(--text-dim)" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
                  }}
                >
                  <LogIn size={15} />
                  <span>Login Menu</span>
                  <ChevronDown size={14} />
                </button>
              )}

              {/* DROPDOWN MENU */}
              {loginMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '330px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: '0 12px 28px -6px rgba(15,23,42,0.15)',
                  padding: '12px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease'
                }}>
                  <div style={{
                    padding: '6px 8px 10px',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '10px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                      Choose Portal Login Role
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                      Access dedicated operations or masked audit consoles
                    </p>
                  </div>

                  {/* Option 1: Operations Admin */}
                  <div
                    onClick={() => handleNavigateToLogin('admin')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      marginBottom: '8px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.background = '#EFF6FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'var(--bg-canvas)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '17px' }}>🏢</span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Operations Admin</strong>
                      </div>
                      <span className="badge badge-cyan" style={{ fontSize: '10px' }}>Full Suite</span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      Fleet logistics, unmasked stock reconciliation, staff payroll, and van loading passes.
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Go to Admin Login Portal <ArrowRight size={12} />
                    </div>
                  </div>

                  {/* Option 2: Godown Stock Auditor */}
                  <div
                    onClick={() => handleNavigateToLogin('checker')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      marginBottom: '10px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#059669';
                      e.currentTarget.style.background = '#ECFDF5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'var(--bg-canvas)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '17px' }}>📦</span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Godown Stock Auditor</strong>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: '10px' }}>Blind Mode</span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      Physical CBB & PCS floor entry. System quantities masked to prevent fraud and bias.
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Go to Godown Auditor Login <ArrowRight size={12} />
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      onClick={() => {
                        setLoginMenuOpen(false);
                        navigate('/login');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Open Standard Login Page →
                    </button>
                    <Link to="/details" onClick={() => setLoginMenuOpen(false)} style={{ fontSize: '11px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                      Specs & Docs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO SECTION (RICH SAAS HERO WITH GLOW & LIVE CONTROLS) */}
      {/* ========================================================= */}
      <section style={{
        padding: '72px 24px 56px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Floating pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #BFDBFE',
          boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
          color: '#1D4ED8',
          fontSize: '12.5px',
          fontWeight: 700,
          marginBottom: '28px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block', boxShadow: '0 0 0 3px rgba(5,150,105,0.2)' }} />
          <span>FMCG Enterprise Operations Business Suite · Multi-Tenant Cloud Architecture</span>
          <Link to="/details" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#2563EB', marginLeft: '6px', textDecoration: 'none' }}>
            <span>Explore Specs</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Main Headline with high-contrast executive styling */}
        <h1 style={{
          fontSize: 'clamp(2.3rem, 4.6vw, 3.6rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.035em',
          color: '#0F172A',
          maxWidth: '980px',
          margin: '0 auto 22px'
        }}>
          The Intelligent Operating System for FMCG Super-Stockists & Distribution Hubs
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
          color: '#475569',
          maxWidth: '820px',
          margin: '0 auto 40px',
          lineHeight: 1.65
        }}>
          Eliminate godown inventory leakages with <strong>masked blind stock audits</strong>, optimize multi-route commercial vehicle logistics, generate instant van delivery passes, and automate complex staff payroll — all in one unified light enterprise portal.
        </p>

        {/* Action Button Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '54px'
        }}>
          <button
            onClick={() => handleNavigateToLogin('admin')}
            className="btn btn-primary"
            style={{
              padding: '13px 28px',
              fontSize: '14.5px',
              fontWeight: 700,
              boxShadow: '0 6px 16px rgba(37,99,235,0.28)'
            }}
          >
            <span>Launch Operations Portal</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => handleNavigateToLogin('checker')}
            style={{
              padding: '13px 26px',
              fontSize: '14.5px',
              fontWeight: 700,
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
          >
            <Lock size={17} color="#059669" />
            <span>Godown Blind Stock Audit</span>
            <span className="badge badge-amber" style={{ fontSize: '10.5px' }}>Masked</span>
          </button>

          <Link
            to="/details"
            style={{
              padding: '13px 22px',
              fontSize: '14px',
              fontWeight: 700,
              background: '#FFFFFF',
              color: '#475569',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <BookOpen size={16} color="#2563EB" />
            <span>Portal Specifications</span>
          </Link>
        </div>

        {/* Live Key Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '24px',
          background: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px -5px rgba(15,23,42,0.06)'
        }}>
          <div style={{ textAlign: 'left', padding: '8px 12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#2563EB', fontFamily: 'var(--font-heading)' }}>
              99.9%
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Blind Inventory Accuracy
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              System quantities masked during physical counts
            </p>
          </div>

          <div style={{ textAlign: 'left', padding: '8px 12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-heading)' }}>
              10,000+
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Daily Cartons Dispatched
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              Real-time delivery loading passes with QR
            </p>
          </div>

          <div style={{ textAlign: 'left', padding: '8px 12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0284C7', fontFamily: 'var(--font-heading)' }}>
              100%
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Supabase Cloud Sync
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              PostgreSQL persistence with offline cache
            </p>
          </div>

          <div style={{ textAlign: 'left', padding: '8px 12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-heading)' }}>
              Multi-Agency
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Tenant Isolation
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              Independent databases for Thulir, Murugan, etc.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE DEMO 1: THE BLIND AUDIT SIMULATOR WIDGET */}
      {/* ========================================================= */}
      <section id="interactive-demo" style={{
        padding: '64px 24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        borderBottom: '1px solid var(--border-medium)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Interactive Innovation</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Experience the Masked Blind Stock Audit Simulator
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '720px', margin: '8px auto 0' }}>
              Toggle between the <strong>Godown Auditor View</strong> (where system quantities are completely sealed) and the <strong>Operations Admin View</strong> (where financial variance and pilferage are calculated in real time).
            </p>
          </div>

          {/* Interactive Control Center Container */}
          <div style={{
            background: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-strong)',
            boxShadow: '0 12px 30px -10px rgba(15,23,42,0.08)',
            overflow: 'hidden'
          }}>
            {/* Top Toolbar with Live Mode Switch */}
            <div style={{
              padding: '14px 24px',
              background: '#FFFFFF',
              borderBottom: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  ACTIVE SIMULATION MODE:
                </span>
                <div style={{
                  display: 'flex',
                  background: 'var(--bg-canvas)',
                  padding: '3px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)'
                }}>
                  <button
                    onClick={() => setInteractiveAuditMode('masked')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: interactiveAuditMode === 'masked' ? '#059669' : 'transparent',
                      color: interactiveAuditMode === 'masked' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Lock size={13} />
                    <span>Godown Auditor (Masked)</span>
                  </button>

                  <button
                    onClick={() => setInteractiveAuditMode('admin')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: interactiveAuditMode === 'admin' ? '#2563EB' : 'transparent',
                      color: interactiveAuditMode === 'admin' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <BarChart3 size={13} />
                    <span>Operations Admin (Unmasked)</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-neutral">SKU: ITC-ATT-10K</span>
                <span className="badge badge-emerald">Real-Time Sync Active</span>
              </div>
            </div>

            {/* Interactive Simulator Data Grid */}
            <div style={{ padding: '28px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Item Details Card */}
                <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
                    CATALOG MASTER ITEM
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>
                    Aashirvaad Superior MP Atta 10kg
                  </h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Brand: <strong>ITC Foods</strong> · Conversion: <strong>4 Pcs / Carton (CBB)</strong> · MRP: <strong>₹ 480.00</strong>
                  </div>
                </div>

                {/* System Stock Card (Conditionally Masked) */}
                <div style={{
                  padding: '20px',
                  background: interactiveAuditMode === 'masked' ? '#FFFBEB' : '#EFF6FF',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${interactiveAuditMode === 'masked' ? '#FDE68A' : '#BFDBFE'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: interactiveAuditMode === 'masked' ? '#92400E' : '#1E40AF' }}>
                      SYSTEM BOOK STOCK
                    </span>
                    <span className={`badge ${interactiveAuditMode === 'masked' ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '10px' }}>
                      {interactiveAuditMode === 'masked' ? '🔒 SECURELY MASKED' : 'UNMASKED'}
                    </span>
                  </div>

                  {interactiveAuditMode === 'masked' ? (
                    <div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 900,
                        color: '#B45309',
                        fontFamily: 'var(--font-mono)',
                        padding: '10px 0'
                      }}>
                        •••••• MASKED ••••••
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#92400E', margin: 0 }}>
                        Hidden on warehouse tablet to prevent unverified copy-pasting. Staff must count pallets physically.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#1D4ED8', padding: '6px 0' }}>
                        120 CBB <span style={{ fontSize: '15px', color: 'var(--text-dim)' }}>+ 0 Loose PCS</span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#1E40AF', margin: 0 }}>
                        Book quantity from uploaded StockMRP.xlsx (Total: 480 individual pieces).
                      </p>
                    </div>
                  )}
                </div>

                {/* Physical Count Input Card */}
                <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    PHYSICAL GODOWN COUNT ENTRY
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Cartons (CBB)</label>
                      <input
                        type="number"
                        value={interactiveCountCbb}
                        onChange={(e) => setInteractiveCountCbb(Number(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid var(--border-strong)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '15px',
                          fontWeight: 700
                        }}
                      />
                    </div>
                    <div style={{ width: '80px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PCS (Loose)</label>
                      <input
                        type="number"
                        disabled
                        value={0}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          background: '#F1F5F9',
                          fontSize: '15px',
                          fontWeight: 700
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-dim)' }}>
                    Try changing the carton count (e.g. 115 vs 120) to see variance.
                  </div>
                </div>
              </div>

              {/* Real-Time Variance Calculation Bar */}
              <div style={{
                padding: '16px 20px',
                background: interactiveCountCbb === 120 ? '#ECFDF5' : '#FEF2F2',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${interactiveCountCbb === 120 ? '#A7F3D0' : '#FECACA'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {interactiveCountCbb === 120 ? (
                    <CheckCircle2 size={20} color="#059669" />
                  ) : (
                    <AlertTriangle size={20} color="#DC2626" />
                  )}
                  <div>
                    <strong style={{ fontSize: '13.5px', color: interactiveCountCbb === 120 ? '#065F46' : '#991B1B' }}>
                      {interactiveCountCbb === 120 ? 'PERFECT RECONCILIATION: ZERO VARIANCE' : `DISCREPANCY DETECTED: ${interactiveCountCbb - 120} CARTONS VARIANCE`}
                    </strong>
                    <div style={{ fontSize: '12px', color: interactiveCountCbb === 120 ? '#047857' : '#B91C1C' }}>
                      {interactiveAuditMode === 'masked'
                        ? 'Under Blind Audit mode, the godown checker cannot see this discrepancy until management unmasks it.'
                        : `Admin Impact: ${(interactiveCountCbb - 120) * 4} pieces shortage = ₹ ${((interactiveCountCbb - 120) * 4 * 120).toLocaleString()} financial variance.`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleNavigateToLogin('checker')} className="btn btn-emerald btn-sm">
                    <span>Go to Auditor Login Portal</span>
                    <ArrowRight size={13} />
                  </button>
                  <Link to="/details" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    View Full Mathematical Specs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE DEMO 2: LIVE PAYROLL & FLEET SIMULATORS */}
      {/* ========================================================= */}
      <section style={{ padding: '64px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {/* Payroll Simulator Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-sm)',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Users size={18} color="#2563EB" />
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                Interactive 26-Day Payroll Calculator
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Drag the working-days slider to see dynamic per-day rate computation used by Tamil Nadu FMCG distributors.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Standard Working Days per Month:</span>
                <span style={{ color: '#2563EB', fontSize: '14px' }}>{interactiveWorkingDays} Days</span>
              </div>
              <input
                type="range"
                min="24"
                max="30"
                value={interactiveWorkingDays}
                onChange={(e) => setInteractiveWorkingDays(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>24 Days (6-Day week)</span>
                <span>26 Days (Statutory Default)</span>
                <span>30 Days (Continuous)</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span>Base Salary (Monthly):</span>
                <strong>₹ {sampleBaseSalary.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span>Per-Day Wage Rate:</span>
                <strong style={{ color: '#2563EB' }}>₹ {calculatedPerDayWage} / day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span>Earned Base (24 Days worked):</span>
                <span>₹ {earnedBasePay.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span>Driver Km Incentives:</span>
                <span style={{ color: '#059669' }}>+ ₹ {driverIncentive.toLocaleString()}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800 }}>
                <span>Net Payable Salary:</span>
                <span style={{ color: '#059669' }}>₹ {netCalculatedSalary.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/details" style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Read full payroll formulas & statutory rules <ArrowRight size={12} />
            </Link>
          </div>

          {/* Fleet Route Simulator Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-sm)',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Truck size={18} color="#059669" />
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                Live Delivery Route & Van Dispatch Simulator
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select an active delivery corridor to inspect real-time fuel, vehicle capacity, and cargo volume.
            </p>

            {/* Route Selector Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {['salem', 'trichy', 'coimbatore'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoute(r)}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${selectedRoute === r ? '#059669' : 'var(--border-medium)'}`,
                    background: selectedRoute === r ? '#ECFDF5' : '#FFFFFF',
                    color: selectedRoute === r ? '#065F46' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {r} Route
                </button>
              ))}
            </div>

            {/* Selected Route Details */}
            <div style={{ background: 'var(--bg-canvas)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {routesData[selectedRoute].name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Vehicle: <strong>{routesData[selectedRoute].vehicle}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>ROUNDTRIP DISTANCE</div>
                  <strong style={{ fontSize: '13px' }}>{routesData[selectedRoute].distance}</strong>
                </div>
                <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>DIESEL ESTIMATE</div>
                  <strong style={{ fontSize: '13px', color: '#D97706' }}>{routesData[selectedRoute].diesel}</strong>
                </div>
                <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>VAN LOAD (CBB)</div>
                  <strong style={{ fontSize: '13px', color: '#2563EB' }}>{routesData[selectedRoute].cbb}</strong>
                </div>
                <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>INVOICE CARGO VALUE</div>
                  <strong style={{ fontSize: '13px', color: '#059669' }}>{routesData[selectedRoute].value}</strong>
                </div>
              </div>
            </div>

            <Link to="/details" style={{ fontSize: '12px', color: '#059669', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Read full dispatch pass & RTO compliance specifications <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* COMPREHENSIVE SOLUTIONS GRID */}
      {/* ========================================================= */}
      <section id="solutions-grid" style={{
        padding: '64px 24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        borderBottom: '1px solid var(--border-medium)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Modular Operations Suite</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Engineered Specifically for FMCG Distribution Velocity
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '680px', margin: '6px auto 0' }}>
              Explore each module below. Click any card to read in-depth technical documentation in the Portal Details page.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: Lock,
                color: '#D97706',
                bg: '#FEF3C7',
                title: 'Masked Blind Stock Audit',
                badge: 'Zero Pilferage',
                desc: 'Seals system stock numbers from godown checkers. Forces physical pallet counts, validating carton-to-piece conversions and exposing exact ₹ discrepancies.',
                link: '/details'
              },
              {
                icon: Truck,
                color: '#2563EB',
                bg: '#EFF6FF',
                title: 'Fleet & FC Compliance Vault',
                badge: 'RTO Certified',
                desc: 'Tracks commercial vehicle RTO Fitness Certificates (FC), commercial insurance policies, driver license validity, and trip fuel economics.',
                link: '/details'
              },
              {
                icon: Package,
                color: '#059669',
                bg: '#ECFDF5',
                title: 'Stock & Excel MRP Engine',
                badge: 'Instant Parsing',
                desc: 'Parses standard company StockMRP.xlsx sheets in seconds. Handles dual-unit inventory counting (Cartons CBB & Pieces PCS) with automatic factor math.',
                link: '/details'
              },
              {
                icon: Users,
                color: '#7C3AED',
                bg: '#F5F3FF',
                title: 'Dynamic FMCG Staff Payroll',
                badge: '26-Day Formula',
                desc: 'Automates monthly driver and godown staff payroll. Computes kilometer distance incentives, advance deductions, and one-click PDF payslips.',
                link: '/details'
              },
              {
                icon: FileText,
                color: '#0284C7',
                bg: '#F0F9FF',
                title: 'Van Dispatch & Gate Security',
                badge: 'QR Passes',
                desc: 'Generates gate-verified Van Loading Passes linking delivery route invoices, carton tally sheets, and security officer signatures.',
                link: '/details'
              },
              {
                icon: Building2,
                color: '#0F172A',
                bg: '#F1F5F9',
                title: 'Multi-Tenant Agency Isolation',
                badge: 'Supabase Cloud',
                desc: 'Isolates multiple legal entities (e.g. Thulir Agencies vs Sri Murugan Agencies) with separate database schemas, live sync, and offline resilience.',
                link: '/details'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '28px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: card.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={22} color={card.color} />
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{card.badge}</span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                      {card.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <Link
                      to={card.link}
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#2563EB',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Explore Technical Specifications</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BRAND PORTFOLIOS SUPPORTED */}
      {/* ========================================================= */}
      <section style={{ padding: '48px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: '16px' }}>
          COMPATIBLE WITH STANDARD BILLING WORKBOOKS OF MAJOR FMCG PRINCIPALS
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {['ITC Foods & Personal Care', 'Britannia Industries', 'Nestle India', 'Tata Consumer Products', 'Hindustan Unilever', 'Parle Agro'].map((brand) => (
            <div
              key={brand}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: '#FFFFFF',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* EXECUTIVE CALL TO ACTION BANNER */}
      {/* ========================================================= */}
      <section style={{
        padding: '60px 24px',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Elevate Your FMCG Distribution Infrastructure Today
          </h2>
          <p style={{ fontSize: '15px', color: '#BFDBFE', lineHeight: 1.6, marginBottom: '36px' }}>
            Choose your login portal below to begin managing inventory, running masked godown audits, or reviewing fleet dispatches.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleNavigateToLogin('admin')}
              style={{
                padding: '13px 26px',
                fontSize: '14.5px',
                fontWeight: 700,
                background: '#FFFFFF',
                color: '#1D4ED8',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <span>🏢 Operations Admin Login</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => handleNavigateToLogin('checker')}
              style={{
                padding: '13px 26px',
                fontSize: '14.5px',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Lock size={15} />
              <span>📦 Godown Stock Auditor Login</span>
            </button>

            <Link
              to="/details"
              style={{
                padding: '13px 24px',
                fontSize: '14.5px',
                fontWeight: 700,
                background: 'transparent',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={15} />
              <span>Read Full Specs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer style={{
        padding: '36px 24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        fontSize: '12.5px',
        color: 'var(--text-dim)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={17} color="#2563EB" />
            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>FMCG Enterprise Portal</span>
            <span>· Multi-Tenant Operating System 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/landing" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/details" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
              Portal Details & Specifications
            </Link>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Standard Login
            </Link>
            <span onClick={() => handleNavigateToLogin('checker')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
              Blind Godown Audit Login
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
