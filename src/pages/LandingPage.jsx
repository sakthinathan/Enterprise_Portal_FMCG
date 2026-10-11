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
  FileSpreadsheet
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAuditor, login } = useAuth();
  const { activeAgency, allAgencies, switchAgency } = useTenant();

  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('blind-audit'); // 'blind-audit' | 'admin-dashboard' | 'fleet' | 'payroll'

  // Quick 1-click login handler from top menu
  const handleQuickLogin = (role) => {
    setLoginMenuOpen(false);
    if (role === 'checker') {
      login('checker@thulir.com', 'demo123', 'Godown Stock Auditor');
      navigate('/stock-audit');
    } else {
      login('admin@thulir.com', 'demo123', 'Agency Managing Director');
      navigate('/');
    }
  };

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
      {/* TOP HEADER / NAVBAR WITH LOGIN MENU */}
      {/* ========================================================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Logo & Platform Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
            }}>
              <Truck size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)'
                }}>
                  FMCG Suite
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '1px 6px' }}>
                  Enterprise OS
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>
                Operations, Fleet, Blind Stock & Payroll
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
            fontSize: '13px',
            fontWeight: 600
          }} className="landing-desktop-nav">
            <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Solutions
            </a>
            <a href="#blind-audit-section" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={13} color="#2563EB" /> Blind Stock Audit
            </a>
            <a href="#workflow" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Workflow
            </a>
            <a href="#architecture" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Multi-Tenant Architecture
            </a>
          </nav>

          {/* Right Header Controls & Top Login Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Active Agency Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface-subtle)',
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
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <span>Open Workspace</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                    style={{
                      padding: '8px 10px',
                      background: 'var(--bg-surface)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogIn size={15} />
                    <span>Login Menu</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}

              {/* DROPDOWN MENU */}
              {loginMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '320px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '10px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease'
                }}>
                  <div style={{
                    padding: '8px 10px 10px',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                      Select User Login Portal
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Choose your role to access designated portal modules.
                    </p>
                  </div>

                  {/* Option 1: Operations Admin */}
                  <div
                    onClick={() => handleQuickLogin('admin')}
                    style={{
                      padding: '10px 12px',
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
                        <span style={{ fontSize: '16px' }}>🏢</span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Operations Admin</strong>
                      </div>
                      <span className="badge badge-cyan" style={{ fontSize: '10px' }}>Full Access</span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
                      Fleet logistics, Excel upload, unmasked reconciliation, payroll & van dispatch.
                    </p>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#2563EB', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Sign in as admin@thulir.com <ArrowRight size={11} />
                    </div>
                  </div>

                  {/* Option 2: Godown Stock Auditor */}
                  <div
                    onClick={() => handleQuickLogin('checker')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      marginBottom: '8px',
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
                        <span style={{ fontSize: '16px' }}>📦</span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Godown Stock Auditor</strong>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: '10px' }}>Blind Audit</span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
                      Physical CBB & PCS logging. System stock numbers masked to prevent fraud.
                    </p>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Sign in as checker@thulir.com <ArrowRight size={11} />
                    </div>
                  </div>

                  {/* Bottom link to main login form */}
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
                        fontWeight: 600,
                        padding: '4px 6px'
                      }}
                    >
                      Open Standard Login Page →
                    </button>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>v2.4 LTS</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section style={{
        padding: '64px 24px 48px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Top Feature Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'var(--primary-subtle)',
          border: '1px solid #BFDBFE',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '24px'
        }}>
          <Sparkles size={14} />
          <span>FMCG Enterprise Operations Business Suite · Multi-Tenant Cloud Architecture</span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '-0.03em',
          color: 'var(--text-main)',
          maxWidth: '920px',
          margin: '0 auto 20px'
        }}>
          The Intelligent Operations OS for FMCG Super-Stockists & Distribution Hubs
        </h1>

        {/* Subhead */}
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          color: 'var(--text-muted)',
          maxWidth: '780px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Eliminate godown inventory leakages with <strong>masked blind stock audits</strong>, optimize multi-route vehicle fleet logistics, generate instant van delivery passes, and automate complex staff payroll — all in one unified light enterprise portal.
        </p>

        {/* Primary Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '54px'
        }}>
          <button
            onClick={() => handleQuickLogin('admin')}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <span>Launch Operations Portal</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => handleQuickLogin('checker')}
            style={{
              padding: '12px 22px',
              fontSize: '14px',
              fontWeight: 700,
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
          >
            <Lock size={16} color="#059669" />
            <span>Godown Blind Stock Audit</span>
            <span className="badge badge-amber" style={{ fontSize: '10px' }}>Masked</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', fontSize: '14px' }}
          >
            <LogIn size={15} />
            <span>Standard Login</span>
          </button>
        </div>

        {/* Live Key Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '1060px',
          margin: '0 auto',
          padding: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ textAlign: 'left', padding: '8px 12px' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              99.9%
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Blind Inventory Accuracy
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              System quantities masked during physical counts
            </p>
          </div>

          <div style={{ textAlign: 'left', padding: '8px 12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-heading)' }}>
              10,000+
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Daily Cartons Dispatched
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              Real-time delivery loading passes with QR
            </p>
          </div>

          <div style={{ textAlign: 'left', padding: '8px 12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', fontFamily: 'var(--font-heading)' }}>
              100%
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Supabase Cloud Sync
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              PostgreSQL persistence with offline cache
            </p>
          </div>

          <div style={{ textAlign: 'left', padding: '8px 12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-heading)' }}>
              Multi-Agency
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Tenant Isolation
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              Independent databases for Thulir, Murugan, etc.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURE SPOTLIGHT: GODOWN BLIND AUDIT PROTOCOL */}
      {/* ========================================================= */}
      <section id="blind-audit-section" style={{
        padding: '64px 24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        borderBottom: '1px solid var(--border-medium)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--amber-bg)',
              color: 'var(--amber-text)',
              border: '1px solid var(--amber-border)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}>
              <Lock size={12} /> Fraud Prevention Architecture
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Why Masked Godown Stock Auditing Changes Everything
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '720px', margin: '8px auto 0' }}>
              Traditional FMCG godowns face widespread stock pilferage and fake tallying because stock checkers can see the target book numbers. Our system enforces a strict <strong>blind count protocol</strong>.
            </p>
          </div>

          {/* Side by Side Comparison Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {/* The Old Way */}
            <div style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              background: '#FFF5F5',
              border: '1px solid #FED7D7',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEB2B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={15} color="#9B2C2C" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#9B2C2C', margin: 0 }}>
                  Traditional Godown Stock Check
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '13px', color: '#742A2A', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#E53E3E', fontWeight: 700 }}>✕</span>
                  <span><strong>Exposed Quantities:</strong> Godown staff see exactly how many cartons are in system stock (e.g. 150 CBB, 12 PCS).</span>
                </li>
                <li style={{ fontSize: '13px', color: '#742A2A', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#E53E3E', fontWeight: 700 }}>✕</span>
                  <span><strong>Lazy Copy-Pasting:</strong> Instead of physically climbing stacks and counting, staff write down the identical number.</span>
                </li>
                <li style={{ fontSize: '13px', color: '#742A2A', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#E53E3E', fontWeight: 700 }}>✕</span>
                  <span><strong>Undetected Pilferage:</strong> Broken packets, water damage, and theft remain hidden until audit discrepancies pile up to lakhs of rupees.</span>
                </li>
              </ul>
              <div style={{ marginTop: 'auto', padding: '10px 14px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid #FEB2B2', fontSize: '12px', color: '#C53030', fontWeight: 600 }}>
                High Financial Risk · Distorted Inventory Valuation
              </div>
            </div>

            {/* Our Enterprise Blind Audit */}
            <div style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#166534" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#166534', margin: 0 }}>
                  FMCG Suite Masked Blind Audit
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '13px', color: '#14532D', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>100% Masked Values:</strong> System CBB & PCS render as <code>•••••• MASKED ••••••</code> on warehouse devices.</span>
                </li>
                <li style={{ fontSize: '13px', color: '#14532D', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Mandatory Physical Tally:</strong> Warehouse staff must physically inspect each stack and record actual cartons and loose pieces.</span>
                </li>
                <li style={{ fontSize: '13px', color: '#14532D', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Instant Variance Exposure:</strong> Operations Admin immediately sees discrepancy flags and exact rupee impact upon submission.</span>
                </li>
              </ul>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', color: '#15803D', fontWeight: 700 }}>
                  Zero Guesswork · Tamper Proof
                </div>
                <button
                  onClick={() => handleQuickLogin('checker')}
                  className="btn btn-emerald btn-sm"
                >
                  <span>Test Auditor Login</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE MODULES & LIVE PREVIEW */}
      {/* ========================================================= */}
      <section id="features" style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Enterprise Capabilities</span>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Comprehensive Modules Built for FMCG Velocity
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '680px', margin: '6px auto 0' }}>
            Every tool required to run an authorized distributor or super-stockist with hundreds of SKUs and dozens of vehicles.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'blind-audit', label: '🔒 Blind Stock Auditor Portal', icon: Lock },
            { id: 'admin-dashboard', label: '🏢 Admin Stock Reconciliation', icon: BarChart3 },
            { id: 'fleet', label: '🚚 Fleet & Route Logistics', icon: Truck },
            { id: 'payroll', label: '💼 Staff & Driver Payroll', icon: Users },
            { id: 'dispatch', label: '📋 Van Loading Passes', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activePreviewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreviewTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--border-medium)'}`,
                  background: active ? 'var(--primary)' : '#FFFFFF',
                  color: active ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Preview Card */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}>
          {/* Mock Browser Header */}
          <div style={{
            padding: '10px 16px',
            background: 'var(--bg-surface-subtle)',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '11px', marginLeft: '6px' }}>
                {activePreviewTab === 'blind-audit' ? 'portal.fmcg.internal/#/stock-audit (Role: Godown Stock Auditor)' : 'portal.fmcg.internal/#/operations (Role: Operations MD)'}
              </span>
            </div>
            <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
              Live System Preview
            </span>
          </div>

          {/* Preview Tab Content */}
          <div style={{ padding: '24px' }}>
            {activePreviewTab === 'blind-audit' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '16px', margin: 0 }}>Warehouse Physical Count · Blind Audit Mode</h4>
                      <span className="badge badge-amber">🔒 Quantities Masked</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                      Active Master File: StockMRP_ITC_Foods_Active.xlsx · 8 Master Items Loaded
                    </p>
                  </div>
                  <button
                    onClick={() => handleQuickLogin('checker')}
                    className="btn btn-emerald btn-sm"
                  >
                    <span>Launch Audit Screen</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Masked Audit Table Sample */}
                <div className="table-container" style={{ margin: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Brand / SKU</th>
                        <th>Product Description</th>
                        <th>Factor (Pcs/Ctn)</th>
                        <th style={{ background: '#FEF3C7', color: '#92400E' }}>🔒 System Stock (CBB / PCS)</th>
                        <th style={{ background: '#ECFDF5', color: '#065F46' }}>Physical Count (CBB)</th>
                        <th style={{ background: '#ECFDF5', color: '#065F46' }}>Physical Count (PCS)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge badge-neutral">ITC-001</span></td>
                        <td><strong>Aashirvaad Superior MP Atta 10kg</strong></td>
                        <td>4 pcs / ctn</td>
                        <td style={{ background: '#FFFBEB', color: '#B45309', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          •••••• MASKED ••••••
                        </td>
                        <td>
                          <span style={{ display: 'inline-block', padding: '4px 8px', background: '#F1F5F9', borderRadius: '4px', fontWeight: 700 }}>120 CBB</span>
                        </td>
                        <td>
                          <span style={{ display: 'inline-block', padding: '4px 8px', background: '#F1F5F9', borderRadius: '4px', fontWeight: 700 }}>2 PCS</span>
                        </td>
                        <td><span className="badge badge-emerald">Counted ✓</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge badge-neutral">ITC-002</span></td>
                        <td><strong>Sunfeast Dark Fantasy Choco Fills 300g</strong></td>
                        <td>24 pcs / ctn</td>
                        <td style={{ background: '#FFFBEB', color: '#B45309', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          •••••• MASKED ••••••
                        </td>
                        <td>
                          <span style={{ display: 'inline-block', padding: '4px 8px', background: '#F1F5F9', borderRadius: '4px', fontWeight: 700 }}>85 CBB</span>
                        </td>
                        <td>
                          <span style={{ display: 'inline-block', padding: '4px 8px', background: '#F1F5F9', borderRadius: '4px', fontWeight: 700 }}>0 PCS</span>
                        </td>
                        <td><span className="badge badge-emerald">Counted ✓</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge badge-neutral">ITC-003</span></td>
                        <td><strong>Bingo! Mad Angles Achaari Masti 66g</strong></td>
                        <td>48 pcs / ctn</td>
                        <td style={{ background: '#FFFBEB', color: '#B45309', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          •••••• MASKED ••••••
                        </td>
                        <td>
                          <input type="number" placeholder="Enter CBB" disabled value="42" style={{ width: '80px', padding: '3px 6px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
                        </td>
                        <td>
                          <input type="number" placeholder="Enter PCS" disabled value="10" style={{ width: '80px', padding: '3px 6px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
                        </td>
                        <td><span className="badge badge-amber">In Progress</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activePreviewTab === 'admin-dashboard' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', margin: 0 }}>Executive Stock Reconciliation & Variance Impact</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                      Admin View: Both System Book Stock & Auditor Physical Counts Unmasked with Discrepancy Valuation
                    </p>
                  </div>
                  <button onClick={() => handleQuickLogin('admin')} className="btn btn-primary btn-sm">
                    Open Stock Manager
                  </button>
                </div>
                <div className="table-container" style={{ margin: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Book Stock (CBB)</th>
                        <th>Auditor Physical (CBB)</th>
                        <th>CBB Variance</th>
                        <th>PCS Variance</th>
                        <th>Financial Impact (₹)</th>
                        <th>Audit Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Aashirvaad Superior MP Atta 10kg</strong></td>
                        <td>120 CBB</td>
                        <td>120 CBB</td>
                        <td><span className="badge badge-emerald">0 CBB</span></td>
                        <td><span className="badge badge-emerald">0 PCS</span></td>
                        <td style={{ color: '#059669', fontWeight: 700 }}>₹ 0.00</td>
                        <td><span className="badge badge-emerald">MATCHED</span></td>
                      </tr>
                      <tr>
                        <td><strong>Sunfeast Dark Fantasy Choco Fills 300g</strong></td>
                        <td>90 CBB</td>
                        <td>85 CBB</td>
                        <td><span className="badge badge-rose">-5 CBB</span></td>
                        <td><span className="badge badge-rose">-3 PCS</span></td>
                        <td style={{ color: '#DC2626', fontWeight: 700 }}>-₹ 12,450.00</td>
                        <td><span className="badge badge-rose">SHORTAGE</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activePreviewTab === 'fleet' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', margin: 0 }}>Fleet Logistics & Vehicle Trip Monitoring</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                      Active Vehicles: 6 Trucks · Live Fuel Efficiency · Route Profitability
                    </p>
                  </div>
                  <button onClick={() => handleQuickLogin('admin')} className="btn btn-primary btn-sm">
                    Open Fleet Module
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>TN-45-AK-8821</strong>
                      <span className="badge badge-emerald">On Route</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ashok Leyland Dost · Salem Central Route</div>
                    <div style={{ marginTop: '10px', fontSize: '11.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Capacity: 85% (170 CBB)</span>
                      <span>Driver: K. Ramesh</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>TN-28-BZ-4102</strong>
                      <span className="badge badge-cyan">Loading</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tata Ace Gold · Erode Super Express</div>
                    <div style={{ marginTop: '10px', fontSize: '11.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Capacity: 60% (75 CBB)</span>
                      <span>Driver: S. Murugesan</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'payroll' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', margin: 0 }}>Automated FMCG Staff & Driver Payroll</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                      Configurable standard working days (e.g. 26 days) · Distance incentives · PDF payslip export
                    </p>
                  </div>
                  <button onClick={() => handleQuickLogin('admin')} className="btn btn-primary btn-sm">
                    Open Payroll Module
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>MONTHLY PAYROLL EXPENDITURE</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>₹ 2,48,500.00</div>
                    <span style={{ fontSize: '11px', color: '#059669' }}>12 Employees Processed</span>
                  </div>
                  <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>DRIVER OT & TRIP INCENTIVES</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>₹ 34,200.00</div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Based on logged km</span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'dispatch' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', margin: 0 }}>Van Loading Passes & Security Verification</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                      Gate security verification · Carton tallying · Customer invoice assignment
                    </p>
                  </div>
                  <button onClick={() => handleQuickLogin('admin')} className="btn btn-primary btn-sm">
                    Open Dispatch Module
                  </button>
                </div>
                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>PASS #VLP-2026-0891 · TN-45-AK-8821</strong>
                    <span className="badge badge-emerald">Gate Cleared</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Route: Namakkal City Retailers · Total Cartons: 215 CBB · Invoice Value: ₹ 4,82,000.00
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4-STEP WORKFLOW SECTION */}
      {/* ========================================================= */}
      <section id="workflow" style={{
        padding: '64px 24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        borderBottom: '1px solid var(--border-medium)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>Operational Blueprint</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              How FMCG Suite Synchronizes Your Entire Agency
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '640px', margin: '6px auto 0' }}>
              From initial ERP Excel upload to gate security dispatch, every step is automated and verified.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                step: '01',
                title: 'Excel File Upload',
                role: 'Operations MD',
                desc: 'Upload StockMRP.xlsx directly from company billing system with automated SKU, brand, and conversion factor parsing.'
              },
              {
                step: '02',
                title: 'Blind Stock Masking',
                role: 'Security Engine',
                desc: 'System automatically seals book numbers. Godown floor tablets only receive SKU details, masking target quantities.'
              },
              {
                step: '03',
                title: 'Physical Floor Count',
                role: 'Godown Auditor',
                desc: 'Checker walks aisles, records cartons & loose pieces, logs transit/water damages, and saves verified physical counts.'
              },
              {
                step: '04',
                title: 'Instant Reconciliation',
                role: 'Management Hub',
                desc: 'Discrepancy valuation in ₹ is immediately unlocked. Audit variance report is generated for supplier claim settlement.'
              }
            ].map((st) => (
              <div
                key={st.step}
                style={{
                  padding: '24px',
                  background: 'var(--bg-canvas)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-medium)',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  color: '#CBD5E1',
                  lineHeight: 1,
                  marginBottom: '12px'
                }}>
                  {st.step}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{st.title}</h4>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '10px', marginBottom: '10px' }}>
                  {st.role}
                </span>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MULTI-TENANT ARCHITECTURE & SUPABASE CLOUD */}
      {/* ========================================================= */}
      <section id="architecture" style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{
          padding: '40px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
              <Database size={13} /> Enterprise Data Architecture
            </div>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              Isolated Multi-Agency Storage with Supabase Cloud
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '12px 0 20px' }}>
              Built to manage multiple independent distribution businesses (e.g. Thulir Agencies, Sri Murugan Agencies) on a single platform without data leaks or cross-tenant contamination.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span><strong>Role-Based Access Control:</strong> Strict separation of Admin vs Auditor privileges.</span>
              </li>
              <li style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span><strong>PostgreSQL Table Indexing:</strong> Ultra-fast lookups on agency ID, SKU codes, and trips.</span>
              </li>
              <li style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span><strong>Offline-First Resilience:</strong> Never lose warehouse entries when Wi-Fi fluctuates in the godown.</span>
              </li>
            </ul>
          </div>

          <div style={{
            padding: '24px',
            background: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                Registered Agencies
              </span>
              <span className="badge badge-emerald">Online</span>
            </div>

            {allAgencies.map((agency) => (
              <div
                key={agency.id}
                style={{
                  padding: '12px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${agency.id === activeAgency?.id ? '#2563EB' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{agency.logoEmoji || '🏢'}</span>
                    <strong style={{ fontSize: '13px' }}>{agency.name}</strong>
                    {agency.id === activeAgency?.id && (
                      <span className="badge badge-cyan" style={{ fontSize: '9px' }}>Current</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {agency.hubLocation} · {agency.gstin}
                  </div>
                </div>
                <button
                  onClick={() => {
                    switchAgency(agency.id);
                    navigate('/login');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Select Agency
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CALL TO ACTION BANNER */}
      {/* ========================================================= */}
      <section style={{
        padding: '54px 24px',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
        color: '#FFFFFF',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Ready to Supercharge Your FMCG Operations?
          </h2>
          <p style={{ fontSize: '15px', color: '#BFDBFE', lineHeight: 1.6, marginBottom: '32px' }}>
            Choose your login portal below to begin managing inventory, executing masked godown audits, or reviewing fleet dispatches.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleQuickLogin('admin')}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                background: '#FFFFFF',
                color: '#1D4ED8',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span>🏢 Operations Admin Login</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => handleQuickLogin('checker')}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
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
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer style={{
        padding: '32px 24px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-medium)',
        fontSize: '12px',
        color: 'var(--text-dim)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={16} color="#2563EB" />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>FMCG Enterprise Portal</span>
            <span>· Standard Multi-Tenant Edition 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Standard Login
            </Link>
            <span onClick={() => handleQuickLogin('checker')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
              Blind Godown Audit
            </span>
            <span onClick={() => handleQuickLogin('admin')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
              Admin Operations
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
