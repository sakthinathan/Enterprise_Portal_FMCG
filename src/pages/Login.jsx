import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import {
  Truck,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { switchAgency, activeAgency } = useTenant();

  const [email, setEmail] = useState('admin@muruganfmcg.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      navigate('/');
    }, 300);
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
      background: '#080C14',
      color: '#F1F5F9'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        background: '#0F172A',
        borderRadius: '10px',
        border: '1px solid #1E293B',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden'
      }}>
        {/* Left: Real Product Operations Overview */}
        <div style={{
          background: '#0B1120',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #1E293B'
        }}>
          <div>
            {/* Header Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Layers size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                  FMCG Enterprise Portal
                </h2>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  GODOWN STOCK · PAYROLL · FLEET COMPLIANCE
                </div>
              </div>
            </div>

            {/* Real Product Screenshot */}
            <div style={{
              borderRadius: '8px',
              border: '1px solid #1E293B',
              overflow: 'hidden',
              marginBottom: '20px',
              background: '#020617'
            }}>
              <div style={{
                background: '#1E293B',
                padding: '7px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #334155'
              }}>
                <span>ACTUAL SYSTEM SCREENSHOT: STOCK MRP AUDIT</span>
                <span style={{ color: '#10B981', fontSize: '10px' }}>LIVE VERIFIED</span>
              </div>
              <img
                src="/stock-hero.webp"
                alt="Stock Management Screen"
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  display: 'block'
                }}
              />
            </div>

            {/* Operational Metrics Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span><strong>CBB & PCS Dual-Unit Engine:</strong> Physical vs system godown reconciliation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span><strong>Transport & Fleet Matrix:</strong> Vehicle FC, motor insurance, and service tracking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#10B981' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span><strong>Payroll & Sales Rep Attendance:</strong> Sunday off logic, advances & payslip PDF</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11.5px',
            color: '#64748B'
          }}>
            <ShieldCheck size={15} color="#2563EB" />
            <span>Dedicated Multi-Agency FMCG Distributor ERP</span>
          </div>
        </div>

        {/* Right: Sign-in & Agency Presets */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Agency Authentication
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '12.5px', margin: 0 }}>
              Sign in to manage warehouse inventory, fleet compliance and staff roster.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Operator / Agency Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@muruganfmcg.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0B1120',
                  border: '1px solid #1E293B',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>
                  Password
                </label>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Demo: any password accepted
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0B1120',
                  border: '1px solid #1E293B',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 16px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              {loading ? 'Authenticating Agency...' : 'Sign In to Agency Portal'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Agency Switcher */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #1E293B' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              Select Active FMCG Agency:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('sri-murugan', 'admin@muruganfmcg.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#0B1120',
                  border: '1px solid #1E293B',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#F1F5F9' }}>
                    📦 Sri Murugan Agencies
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    ITC, Britannia, Dabur · Tiruppur Hub (4 Vehicles)
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  background: '#064E3B',
                  color: '#34D399',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  Enter →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('annapoorna', 'dispatch@annapoornagoods.in')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#0B1120',
                  border: '1px solid #1E293B',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#F1F5F9' }}>
                    🏢 Annapoorna Consumer Goods
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    HUL, Nestlé, Cadbury · Erode Hub (3 Vehicles)
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  background: '#1E293B',
                  color: '#94A3B8',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  Enter →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
