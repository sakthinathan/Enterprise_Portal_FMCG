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

  const [email, setEmail] = useState('admin@fmcgagency.com');
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      navigate('/');
    }, 250);
  };

  const handleSelectAgency = (agencyId, agencyEmail) => {
    switchAgency(agencyId);
    login(agencyEmail || email, 'demo123');
    navigate('/');
  };

  const handleCreateAgency = (e) => {
    e.preventDefault();
    if (!newAgencyForm.name.trim()) return;

    const created = registerAgency({
      name: newAgencyForm.name.trim(),
      tradeName: newAgencyForm.tradeName.trim(),
      hubLocation: newAgencyForm.hubLocation.trim() || 'Central Godown',
      gstin: newAgencyForm.gstin.trim() || 'GSTIN-PENDING',
      email: newAgencyForm.email.trim() || 'admin@agency.com',
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
        {/* Left: Product Overview & Cloud DB Status */}
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
                  MULTI-TENANT DISTRIBUTOR OPERATIONS SUITE
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
                <span>STOCK MANAGEMENT & AUDIT ENGINE</span>
                <span style={{ color: '#10B981', fontSize: '10px' }}>MULTI-TENANT READY</span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span><strong>Multi-Tenant Isolation:</strong> Data partitioned strictly by Agency ID</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span><strong>Vehicle & Fleet Vault:</strong> RTO Fitness (FC), Insurance & service history</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span><strong>Dual-Unit Stock Reconciliation:</strong> CBB & PCS variance counting</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#64748B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={15} color={isSupabaseConfigured() ? '#10B981' : '#64748B'} />
              <span>
                {isSupabaseConfigured() ? 'Cloud Storage: Supabase Connected' : 'Storage: Local Multi-Tenant Cache'}
              </span>
            </div>
            <span style={{ color: '#94A3B8' }}>GitHub Pages Ready</span>
          </div>
        </div>

        {/* Right: Sign-in & Tenant Switcher */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Agency Portal Access
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '12.5px', margin: 0 }}>
              Select an agency tenant or register a new business distributor
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Operator / Agency Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fmcgagency.com"
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
                  Demo authentication
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
              {loading ? 'Entering Agency Portal...' : 'Enter Active Agency Hub'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Registered Agencies List & Register New Button */}
          <div style={{ marginTop: '26px', paddingTop: '18px', borderTop: '1px solid #1E293B' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Tenants ({allAgencies.length}):
              </span>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38BDF8',
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
              {allAgencies.map(agency => (
                <button
                  key={agency.id}
                  type="button"
                  onClick={() => handleSelectAgency(agency.id, agency.email)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
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
                      {agency.logoEmoji || '🏢'} {agency.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {agency.hubLocation} · GSTIN: {agency.gstin || 'None'}
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
                    Select →
                  </span>
                </button>
              ))}
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
