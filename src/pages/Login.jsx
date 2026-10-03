import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import {
  Sparkles,
  Truck,
  Users,
  Package,
  ShieldCheck,
  ArrowRight,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { switchAgency } = useTenant();

  const [email, setEmail] = useState('admin@muruganfmcg.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      navigate('/');
    }, 400);
  };

  const handleQuickLogin = (agencyId, userEmail) => {
    switchAgency(agencyId);
    login(userEmail, 'demo123');
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        background: 'var(--bg-card-solid)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        overflow: 'hidden'
      }}>
        {/* Left: FMCG Platform Value Pitch */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(20, 28, 48, 0.95) 0%, rgba(10, 14, 25, 0.98) 100%)',
          padding: '44px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 6px 18px rgba(99, 102, 241, 0.4)'
              }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  FMCG Enterprise Suite
                </h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  CENTRALIZED BUSINESS OPERATIONS HUB
                </span>
              </div>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.25, marginBottom: '14px' }}>
              Unified Command for <br />
              <span style={{ background: 'linear-gradient(to right, #818CF8, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Distribution, Fleet & Stock
              </span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '32px' }}>
              Seamlessly link your daily godown inventory checks, staff attendance & payroll, vehicle FC/Insurance compliance, and delivery van loading sheets in one unified platform.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '6px', borderRadius: '8px' }}>
                  <Truck size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', color: 'var(--text-main)', marginBottom: '2px' }}>
                    Fleet & Vehicle FC Vault
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Track Insurance, Fitness Certificates (FC), Service logs, and prevent on-road delivery vehicle downtime.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ color: 'var(--emerald)', background: 'var(--emerald-bg)', padding: '6px', borderRadius: '8px' }}>
                  <Package size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', color: 'var(--text-main)', marginBottom: '2px' }}>
                    FMCG StockSync & Audit
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Physical vs. system godown inventory variance, SKU valuation, and low reorder alerts.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ color: '#F59E0B', background: 'var(--amber-bg)', padding: '6px', borderRadius: '8px' }}>
                  <Users size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', color: 'var(--text-main)', marginBottom: '2px' }}>
                    Integrated HR & Payroll
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Driver, sales rep, and loader attendance roster with direct vehicle assignment pairing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-dim)' }}>
            <ShieldCheck size={16} color="var(--emerald)" />
            Enterprise Multi-Tenant Security · Supabase & PostgreSQL Ready
          </div>
        </div>

        {/* Right: Business Login Form & Demo Presets */}
        <div style={{ padding: '44px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Business Portal Sign In
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Access your FMCG agency dashboard and modules
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="input-group">
              <label className="input-label">Business Email / Username</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@fmcgagency.com"
                required
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Password</label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Demo password: any key accepted'); }} style={{ fontSize: '11px', color: 'var(--primary)', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '6px' }}
            >
              {loading ? 'Authenticating...' : 'Enter Business Suite'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Agency Logins */}
          <div style={{ marginTop: '30px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              ⚡ 1-Click Demo Agency Switch & Sign In:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('sri-murugan', 'admin@muruganfmcg.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px' }}>📦 Sri Murugan Agencies</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ITC, Britannia, Dabur · Tiruppur Hub</div>
                </div>
                <span className="badge badge-emerald">Login →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('annapoorna', 'dispatch@annapoornagoods.in')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px' }}>🏢 Annapoorna Consumer Goods</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HUL, Nestlé, Cadbury · Erode Hub</div>
                </div>
                <span className="badge badge-neutral">Login →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
