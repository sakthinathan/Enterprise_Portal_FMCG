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
  Layers,
  Plus,
  X,
  Database
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { switchAgency, allAgencies, registerAgency } = useTenant();

  const [loginRole, setLoginRole] = useState('admin'); // 'admin' | 'checker'
  const [email, setEmail] = useState('admin@thulir.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // New Agency Registration Form State
  const [newAgencyForm, setNewAgencyForm] = useState({
    name: '',
    tradeName: 'Authorized FMCG Distributor',
    hubLocation: '',
    gstin: '',
    email: '',
    phone: '',
    brands: ''
  });

  const handleRoleChange = (role) => {
    setLoginRole(role);
    if (role === 'checker') {
      setEmail('checker@thulir.com');
    } else {
      setEmail('admin@thulir.com');
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const u = login(email, password, loginRole === 'checker' ? 'Godown Stock Auditor' : 'Agency Managing Director');
      if (u.role === 'Godown Stock Auditor') {
        navigate('/stock-audit');
      } else {
        navigate('/');
      }
    }, 200);
  };

  const handleSelectAgency = (agencyId, agencyEmail) => {
    switchAgency(agencyId);
    const targetEmail = loginRole === 'checker'
      ? (agencyEmail ? `checker@${agencyEmail.split('@')[1] || 'thulir.com'}` : 'checker@thulir.com')
      : (agencyEmail || email);
    const u = login(targetEmail, 'demo123', loginRole === 'checker' ? 'Godown Stock Auditor' : 'Agency Managing Director');
    if (u.role === 'Godown Stock Auditor') {
      navigate('/stock-audit');
    } else {
      navigate('/');
    }
  };

  const handleCreateAgency = (e) => {
    e.preventDefault();
    if (!newAgencyForm.name.trim()) return;

    const created = registerAgency({
      name: newAgencyForm.name.trim(),
      tradeName: newAgencyForm.tradeName.trim(),
      hubLocation: newAgencyForm.hubLocation.trim() || 'Central Godown Hub',
      gstin: newAgencyForm.gstin.trim() || 'GSTIN-PENDING',
      email: newAgencyForm.email.trim() || 'admin@thulir.com',
      phone: newAgencyForm.phone.trim(),
      brands: newAgencyForm.brands ? newAgencyForm.brands.split(',').map(b => b.trim()) : [],
      logoEmoji: '🏢'
    });

    setRegisterModalOpen(false);
    switchAgency(created.id);
    login(created.email, 'demo123');
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-canvas)',
      color: 'var(--text-main)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Left: Product Overview & Cloud DB Status */}
        <div style={{
          background: '#F8FAFC',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--border-medium)'
        }}>
          <div>
            {/* Header Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Layers size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                  FMCG Enterprise Portal
                </h2>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>
                  MULTI-TENANT DISTRIBUTOR OPERATIONS SUITE
                </div>
              </div>
            </div>

            {/* Real Product Screenshot */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              overflow: 'hidden',
              marginBottom: '20px',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '7px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-medium)'
              }}>
                <span>STOCK MANAGEMENT & AUDIT ENGINE</span>
                <span className="badge badge-emerald" style={{ fontSize: '10px' }}>MULTI-TENANT READY</span>
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

            {/* Operational Modules Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span><strong style={{ color: 'var(--text-main)' }}>Multi-Tenant Isolation:</strong> Data partitioned strictly by Agency ID</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span><strong style={{ color: 'var(--text-main)' }}>Vehicle & Fleet Vault:</strong> RTO Fitness (FC), Insurance & service history</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span><strong style={{ color: 'var(--text-main)' }}>Dual-Unit Stock Reconciliation:</strong> CBB & PCS variance counting</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: 'var(--text-dim)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={15} color={isSupabaseConfigured() ? 'var(--emerald)' : 'var(--text-dim)'} />
              <span>
                {isSupabaseConfigured() ? 'Cloud Storage: Supabase PostgreSQL Connected' : 'Storage: Local Multi-Tenant Cache'}
              </span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>GitHub Pages Ready</span>
          </div>
        </div>

        {/* Right: Sign-in & Tenant Switcher */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#FFFFFF' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              Agency Portal Access
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: 0 }}>
              Select your operational role and sign in to your agency portal
            </p>
          </div>

          {/* Role Segmented Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'var(--bg-canvas)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            border: '1px solid var(--border-medium)'
          }}>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              style={{
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: loginRole === 'admin' ? '#FFFFFF' : 'transparent',
                boxShadow: loginRole === 'admin' ? 'var(--shadow-sm)' : 'none',
                color: loginRole === 'admin' ? 'var(--primary-text)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={14} />
              Operations Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('checker')}
              style={{
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: loginRole === 'checker' ? '#FFFFFF' : 'transparent',
                boxShadow: loginRole === 'checker' ? 'var(--shadow-sm)' : 'none',
                color: loginRole === 'checker' ? 'var(--primary-text)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Package size={14} />
              Godown Stock Checker
            </button>
          </div>

          {/* Blind audit protocol notice for godown staff */}
          {loginRole === 'checker' && (
            <div style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--amber-bg)',
              border: '1px solid var(--amber-border)',
              color: 'var(--amber-text)',
              fontSize: '11.5px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck size={16} />
              <span>
                <strong>Blind Audit Mode:</strong> System stock quantities (CBB & PCS) are strictly masked to ensure authentic, unbiased physical counts.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {loginRole === 'checker' ? 'Godown Staff / Auditor Email' : 'Operator / Agency Admin Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={loginRole === 'checker' ? 'checker@thulir.com' : 'admin@thulir.com'}
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  Password
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  Demo authentication
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px 16px',
                fontWeight: 700,
                fontSize: '13.5px',
                marginTop: '4px'
              }}
            >
              {loading
                ? 'Authenticating...'
                : (loginRole === 'checker' ? 'Enter Godown Stock Audit Portal' : 'Enter Active Agency Hub')}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Registered Agencies List & Register New Button */}
          <div style={{ marginTop: '26px', paddingTop: '18px', borderTop: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Available Tenants ({allAgencies.length}):
              </span>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary-text)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                Register New Agency
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
              {allAgencies.map(agency => {
                const isThulir = agency.id === 'thulir' || agency.name?.toLowerCase().includes('thulir');
                return (
                  <button
                    key={agency.id}
                    type="button"
                    onClick={() => handleSelectAgency(agency.id, agency.email)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      background: isThulir ? 'var(--primary-subtle)' : '#FFFFFF',
                      border: `1px solid ${isThulir ? 'var(--primary)' : 'var(--border-medium)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{agency.logoEmoji || '🏢'}</span>
                        <span>{agency.name}</span>
                        {isThulir && <span className="badge badge-emerald" style={{ fontSize: '9.5px', padding: '1px 5px' }}>Default Tenant</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        {agency.hubLocation} · GSTIN: {agency.gstin || 'None'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: isThulir ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                      color: isThulir ? '#FFFFFF' : 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      Select →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Register New FMCG Agency Tenant */}
      {registerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={20} color="#2563EB" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Register New FMCG Agency Tenant</h3>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Agency / Distributor Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shiva Ganga FMCG Distributors"
                  className="input-field"
                  value={newAgencyForm.name}
                  onChange={(e) => setNewAgencyForm({ ...newAgencyForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Trade Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Authorized C&F & Super-Stockist"
                  className="input-field"
                  value={newAgencyForm.tradeName}
                  onChange={(e) => setNewAgencyForm({ ...newAgencyForm, tradeName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Warehouse / Hub Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Tiruppur East"
                    className="input-field"
                    value={newAgencyForm.hubLocation}
                    onChange={(e) => setNewAgencyForm({ ...newAgencyForm, hubLocation: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">GSTIN Identification</label>
                  <input
                    type="text"
                    placeholder="e.g. 33AAACS1234F1Z8"
                    className="input-field font-mono"
                    value={newAgencyForm.gstin}
                    onChange={(e) => setNewAgencyForm({ ...newAgencyForm, gstin: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Authorized Principal Brands (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Britannia, ITC Foods, Dabur India"
                  className="input-field"
                  value={newAgencyForm.brands}
                  onChange={(e) => setNewAgencyForm({ ...newAgencyForm, brands: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create & Launch Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
