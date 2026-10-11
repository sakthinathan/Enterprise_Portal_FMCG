import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { fmcgDb, calculateDaysLeft } from '../lib/fmcgDb';
import {
  Truck,
  Package,
  Users,
  LayoutDashboard,
  MapPin,
  ChevronDown,
  Bell,
  LogOut,
  ShieldAlert,
  Building2,
  Database,
  Plus,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function HeaderNav() {
  const { activeAgency, allAgencies, switchAgency } = useTenant();
  const { user, logout, isAuditor } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);

  // Compute urgent alerts across fleet
  const vehicles = fmcgDb.getVehicles(activeAgency.id);
  const complianceAlerts = [];

  vehicles.forEach(v => {
    const fcDays = calculateDaysLeft(v.fc?.expiryDate);
    if (fcDays !== null) {
      if (fcDays < 0) {
        complianceAlerts.push({
          type: 'danger',
          title: `FC Expired: ${v.regNo}`,
          desc: `Expired ${Math.abs(fcDays)} days ago (RTO: ${v.fc?.rtoOffice || 'TN'})`,
          vehicleId: v.id
        });
      } else if (fcDays <= 30) {
        complianceAlerts.push({
          type: 'warning',
          title: `FC Renewal: ${v.regNo}`,
          desc: `Expires in ${fcDays} days (${v.fc?.expiryDate})`,
          vehicleId: v.id
        });
      }
    }

    const insDays = calculateDaysLeft(v.insurance?.expiryDate);
    if (insDays !== null) {
      if (insDays < 0) {
        complianceAlerts.push({
          type: 'danger',
          title: `Insurance Expired: ${v.regNo}`,
          desc: `Policy lapsed ${Math.abs(insDays)} days ago (${v.insurance?.insurer})`,
          vehicleId: v.id
        });
      } else if (insDays <= 30) {
        complianceAlerts.push({
          type: 'warning',
          title: `Insurance Renewal: ${v.regNo}`,
          desc: `Expires in ${insDays} days (${v.insurance?.insurer})`,
          vehicleId: v.id
        });
      }
    }
  });

  const navItems = isAuditor ? [
    { label: 'Godown Stock Audit', path: '/stock-audit', icon: <Package size={16} /> },
    { label: 'Van Loading Passes', path: '/dispatch', icon: <MapPin size={16} /> }
  ] : [
    { label: 'Operations Hub', path: '/', icon: <LayoutDashboard size={16} /> },
    { label: 'Fleet & FC Vault', path: '/fleet', icon: <Truck size={16} />, badge: complianceAlerts.length > 0 ? complianceAlerts.length : null },
    { label: 'Stock (CBB/PCS)', path: '/stock', icon: <Package size={16} /> },
    { label: 'Blind Stock Audit', path: '/stock-audit', icon: <EyeOff size={16} /> },
    { label: 'Staff Payroll', path: '/payroll', icon: <Users size={16} /> },
    { label: 'Van Dispatch', path: '/dispatch', icon: <MapPin size={16} /> }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm)',
      padding: '0 24px',
      height: '58px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left: Brand & Agency Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '13px'
          }}>
            FMCG
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '14.5px',
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1
            }}>
              DISTRIBUTION SUITE
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600 }}>
              AGENCY OPERATIONS
            </div>
          </div>
        </Link>

        {/* Agency Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setAgencyDropdownOpen(!agencyDropdownOpen); setAlertsDropdownOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 10px',
              background: '#F8FAFC',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Building2 size={13} color="var(--primary)" />
            <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeAgency.name}
            </span>
            <ChevronDown size={13} style={{ color: 'var(--text-dim)' }} />
          </button>

          {agencyDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '115%',
              left: 0,
              width: '270px',
              background: '#FFFFFF',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '6px',
              zIndex: 200
            }}>
              <div style={{ padding: '6px 8px', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Select Active Agency
              </div>
              {allAgencies.map(agency => (
                <div
                  key={agency.id}
                  onClick={() => {
                    switchAgency(agency.id);
                    setAgencyDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: agency.id === activeAgency.id ? 'var(--primary-subtle)' : 'transparent',
                    border: agency.id === activeAgency.id ? '1px solid var(--primary)' : '1px solid transparent',
                    marginBottom: '3px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {agency.name}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                      {agency.hubLocation}
                    </div>
                  </div>
                  {agency.id === activeAgency.id && (
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary-text)' }}>
                      SELECTED
                    </span>
                  )}
                </div>
              ))}
              <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <Link
                  to="/login"
                  onClick={() => setAgencyDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: 'var(--primary-text)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    padding: '4px 0'
                  }}
                >
                  <Plus size={12} /> Register / Switch Agency
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Clear Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary-text)' : 'var(--text-muted)',
                background: isActive ? 'var(--primary-subtle)' : 'transparent',
                border: isActive ? '1px solid #BFDBFE' : '1px solid transparent'
              }}
            >
              <span style={{ color: isActive ? 'var(--primary-text)' : 'inherit' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'var(--rose)',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: '1.2'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Alerts & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setAlertsDropdownOpen(!alertsDropdownOpen); setAgencyDropdownOpen(false); }}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: '#F8FAFC',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: complianceAlerts.length > 0 ? 'var(--amber-text)' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Bell size={14} />
            <span>Alerts</span>
            {complianceAlerts.length > 0 && (
              <span style={{
                background: 'var(--rose)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {complianceAlerts.length}
              </span>
            )}
          </button>

          {alertsDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              width: '320px',
              background: '#FFFFFF',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '10px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Vehicle Compliance Alerts
                </span>
                <span className="badge badge-amber">
                  {complianceAlerts.length} Issues
                </span>
              </div>
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {complianceAlerts.length === 0 ? (
                  <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    All vehicles have valid FC & Insurance.
                  </div>
                ) : (
                  complianceAlerts.map((alt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: alt.type === 'danger' ? 'var(--rose-bg)' : 'var(--amber-bg)',
                        border: `1px solid ${alt.type === 'danger' ? 'var(--rose-border)' : 'var(--amber-border)'}`
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: alt.type === 'danger' ? 'var(--rose-text)' : 'var(--amber-text)' }}>
                        {alt.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {alt.desc}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', textAlign: 'center' }}>
                <Link
                  to="/fleet?tab=compliance"
                  onClick={() => setAlertsDropdownOpen(false)}
                  style={{ fontSize: '11.5px', color: 'var(--primary-text)', fontWeight: 700, textDecoration: 'none' }}
                >
                  Open Compliance Vault →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cloud Connection Indicator */}
        <span
          className={`badge ${isSupabaseConfigured() ? 'badge-emerald' : 'badge-neutral'}`}
          title={isSupabaseConfigured() ? 'Connected to Supabase Cloud PostgreSQL' : 'Local Multi-Tenant Storage Cache (configure .env for Supabase)'}
          style={{ fontSize: '10.5px' }}
        >
          <Database size={11} />
          {isSupabaseConfigured() ? 'Cloud DB' : 'Local DB'}
        </span>

        {/* Portal Overview Link */}
        <Link
          to="/landing"
          className="btn btn-secondary btn-sm"
          style={{ padding: '4px 8px', fontSize: '11px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="View FMCG Enterprise Suite Overview"
        >
          <Sparkles size={12} color="#2563EB" />
          <span>Overview</span>
        </Link>

        {/* User Role Badge */}
        {isAuditor ? (
          <span className="badge badge-amber" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <EyeOff size={12} />
            Godown Blind Auditor
          </span>
        ) : (
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
            Operations Admin
          </span>
        )}

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="btn btn-secondary btn-sm"
          title="Sign Out"
          style={{ padding: '6px 10px', fontSize: '11.5px' }}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
