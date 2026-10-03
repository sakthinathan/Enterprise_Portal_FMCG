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
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function HeaderNav() {
  const { activeAgency, allAgencies, switchAgency } = useTenant();
  const { user, logout } = useAuth();
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
          title: `FC EXPIRED: ${v.regNo}`,
          desc: `Expired ${Math.abs(fcDays)} days ago. Vehicle cannot ply legally!`,
          vehicleId: v.id
        });
      } else if (fcDays <= 30) {
        complianceAlerts.push({
          type: 'warning',
          title: `FC Renewal Due: ${v.regNo}`,
          desc: `Fitness Certificate expires in ${fcDays} days (${v.fc?.expiryDate})`,
          vehicleId: v.id
        });
      }
    }

    const insDays = calculateDaysLeft(v.insurance?.expiryDate);
    if (insDays !== null) {
      if (insDays < 0) {
        complianceAlerts.push({
          type: 'danger',
          title: `INSURANCE EXPIRED: ${v.regNo}`,
          desc: `Expired ${Math.abs(insDays)} days ago (${v.insurance?.insurer})`,
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

  const navItems = [
    { label: 'Suite Hub', path: '/', icon: <LayoutDashboard size={17} /> },
    { label: 'Fleet & Vehicles', path: '/fleet', icon: <Truck size={17} />, badge: complianceAlerts.length > 0 ? complianceAlerts.length : null },
    { label: 'Stock & Inventory', path: '/stock', icon: <Package size={17} /> },
    { label: 'Payroll & HR', path: '/payroll', icon: <Users size={17} /> },
    { label: 'Van Dispatch', path: '/dispatch', icon: <MapPin size={17} /> }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass-nav)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '66px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left: Brand & Agency Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            color: '#fff',
            fontWeight: 900
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '16.5px',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #FFFFFF, #CBD5E1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              FMCG SUITE
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              ENTERPRISE OPS
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
              gap: '8px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: 600
            }}
          >
            <span style={{ fontSize: '14px' }}>{activeAgency.logoEmoji}</span>
            <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeAgency.name}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: agencyDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {agencyDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '115%',
              left: 0,
              width: '280px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px',
              zIndex: 200,
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Select Active Business / Agency
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
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: agency.id === activeAgency.id ? 'var(--primary-glow)' : 'transparent',
                    border: agency.id === activeAgency.id ? '1px solid var(--border-highlight)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => {
                    if (agency.id !== activeAgency.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (agency.id !== activeAgency.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{agency.logoEmoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {agency.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {agency.hubLocation}
                    </div>
                  </div>
                  {agency.id === activeAgency.id && (
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      ACTIVE
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Universal App Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)' : 'transparent',
                border: isActive ? '1px solid var(--border-highlight)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'var(--rose)',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  lineHeight: '1.3'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Notifications & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Compliance Alerts Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setAlertsDropdownOpen(!alertsDropdownOpen); setAgencyDropdownOpen(false); }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: complianceAlerts.length > 0 ? 'var(--amber)' : 'var(--text-muted)',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {complianceAlerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--rose)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '2px solid var(--bg-canvas)'
              }} />
            )}
          </button>

          {alertsDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              width: '340px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px',
              zIndex: 200,
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Fleet Compliance Alerts
                </span>
                <span className="badge badge-amber">
                  {complianceAlerts.length} Attention Needed
                </span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {complianceAlerts.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                    All vehicles have active FC & Insurance!
                  </div>
                ) : (
                  complianceAlerts.map((alt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        background: alt.type === 'danger' ? 'var(--rose-bg)' : 'var(--amber-bg)',
                        border: `1px solid ${alt.type === 'danger' ? 'var(--rose-border)' : 'var(--amber-border)'}`
                      }}
                    >
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: alt.type === 'danger' ? '#FCA5A5' : '#FDE68A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldAlert size={14} />
                        {alt.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {alt.desc}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <Link
                  to="/fleet?tab=compliance"
                  onClick={() => setAlertsDropdownOpen(false)}
                  style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
                >
                  View Full Compliance Matrix →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid var(--border-subtle)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {user?.avatar || '👨‍💼'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {user?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              {user?.badge || 'Owner'}
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            title="Log Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '4px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--rose)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
