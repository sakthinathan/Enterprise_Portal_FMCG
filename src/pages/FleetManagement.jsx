import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import {
  fmcgDb,
  calculateDaysLeft,
  formatCurrencyINR,
  formatDatePretty
} from '../lib/fmcgDb';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import {
  Truck,
  Plus,
  FileDown,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Wrench,
  Fuel,
  Search,
  Filter,
  X,
  Save,
  CheckCircle,
  FileText,
  User,
  MapPin,
  Clock,
  Gauge,
  Phone,
  Trash2,
  Edit2
} from 'lucide-react';

const EMPTY_VEHICLE = {
  regNo: '',
  model: '',
  type: 'Mini Truck',
  fuelType: 'Diesel',
  payloadKg: 1000,
  crateCapacity: 60,
  assignedRoute: '',
  driverId: '',
  driverName: '',
  currentOdo: 0,
  godown: 'Godown #1 - Central',
  status: 'Active',
  insurance: {
    policyNo: '',
    insurer: '',
    expiryDate: '',
    premium: 0,
    coverageType: 'Commercial Goods Carrier'
  },
  fc: {
    certNo: '',
    rtoOffice: '',
    expiryDate: ''
  },
  puc: {
    certNo: '',
    expiryDate: ''
  },
  roadTax: {
    receiptNo: '',
    expiryDate: ''
  }
};

const EMPTY_SERVICE = {
  vehicleId: '',
  serviceDate: new Date().toISOString().split('T')[0],
  serviceType: 'Scheduled Maintenance',
  odometer: 0,
  garageName: '',
  workDescription: '',
  partsCost: 0,
  laborCost: 0,
  billNumber: '',
  nextServiceKm: 0,
  nextServiceDate: ''
};

export default function FleetManagement() {
  const { activeAgency, refreshData } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state: 'overview' | 'compliance' | 'service' | 'fuel'
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleForm, setVehicleForm] = useState(EMPTY_VEHICLE);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);

  const vehicles = fmcgDb.getVehicles(activeAgency.id);
  const serviceLogs = fmcgDb.getServiceLogs();
  const fuelLogs = fmcgDb.getFuelLogs();
  const employees = fmcgDb.getEmployees(activeAgency.id);
  const drivers = employees.filter(e => e.role.toLowerCase().includes('driver') || e.role.toLowerCase().includes('pilot') || e.role.toLowerCase().includes('sales'));

  // Sync tab with search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'compliance', 'service', 'fuel'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.assignedRoute.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || v.type === filterType;
    const matchesStatus = filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && v.status === 'Active') ||
      (filterStatus === 'EXPIRED' && (
        (calculateDaysLeft(v.fc?.expiryDate) !== null && calculateDaysLeft(v.fc?.expiryDate) < 0) ||
        (calculateDaysLeft(v.insurance?.expiryDate) !== null && calculateDaysLeft(v.insurance?.expiryDate) < 0)
      ));

    return matchesSearch && matchesType && matchesStatus;
  });

  // Open Add Vehicle Modal
  const openAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      ...EMPTY_VEHICLE,
      agencyId: activeAgency.id
    });
    setVehicleModalOpen(true);
  };

  // Open Edit Vehicle Modal
  const openEditVehicle = (veh) => {
    setEditingVehicle(veh);
    setVehicleForm(JSON.parse(JSON.stringify(veh)));
    setVehicleModalOpen(true);
  };

  // Save Vehicle
  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (editingVehicle) {
      fmcgDb.updateVehicle(editingVehicle.id, vehicleForm);
    } else {
      fmcgDb.addVehicle(vehicleForm);
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    }
    setVehicleModalOpen(false);
    refreshData();
  };

  // Delete Vehicle
  const handleDeleteVehicle = (id, regNo) => {
    if (window.confirm(`Are you sure you want to remove vehicle ${regNo} from your fleet?`)) {
      fmcgDb.deleteVehicle(id);
      refreshData();
    }
  };

  // Open Log Service Modal
  const openAddService = (vehicleId = '') => {
    const selectedVeh = vehicleId ? fmcgDb.getVehicleById(vehicleId) : (vehicles[0] || null);
    setServiceForm({
      ...EMPTY_SERVICE,
      vehicleId: selectedVeh ? selectedVeh.id : '',
      vehicleReg: selectedVeh ? selectedVeh.regNo : '',
      odometer: selectedVeh ? selectedVeh.currentOdo : 0,
      nextServiceKm: selectedVeh ? selectedVeh.currentOdo + 10000 : 10000
    });
    setServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = (e) => {
    e.preventDefault();
    const v = fmcgDb.getVehicleById(serviceForm.vehicleId);
    const newEntry = {
      ...serviceForm,
      vehicleReg: v ? v.regNo : 'Unknown',
      partsCost: Number(serviceForm.partsCost) || 0,
      laborCost: Number(serviceForm.laborCost) || 0,
      totalCost: (Number(serviceForm.partsCost) || 0) + (Number(serviceForm.laborCost) || 0),
      odometer: Number(serviceForm.odometer) || 0,
      nextServiceKm: Number(serviceForm.nextServiceKm) || 0
    };
    fmcgDb.addServiceLog(newEntry);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
    setServiceModalOpen(false);
    refreshData();
  };

  // Export Compliance PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(activeAgency.name, 14, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`FMCG Fleet Regulatory & Compliance Audit Report · GSTIN: ${activeAgency.gstin}`, 14, 24);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 14, 30);

    const tableRows = vehicles.map(v => {
      const fcDays = calculateDaysLeft(v.fc?.expiryDate);
      const insDays = calculateDaysLeft(v.insurance?.expiryDate);

      let fcStatus = 'Exempt';
      if (fcDays !== null) {
        fcStatus = fcDays < 0 ? `EXPIRED (${Math.abs(fcDays)}d ago)` : fcDays <= 30 ? `Expiring (${fcDays}d)` : `Valid (${v.fc?.expiryDate})`;
      }

      let insStatus = '—';
      if (insDays !== null) {
        insStatus = insDays < 0 ? `EXPIRED (${Math.abs(insDays)}d ago)` : insDays <= 30 ? `Expiring (${insDays}d)` : `Valid (${v.insurance?.expiryDate})`;
      }

      return [
        v.regNo,
        v.model,
        v.type,
        v.driverName,
        insStatus,
        fcStatus,
        v.puc?.expiryDate || '—',
        v.status
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [['Reg No', 'Make & Model', 'Type', 'Driver', 'Insurance Expiry', 'Fitness Cert (FC)', 'PUC Expiry', 'Status']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save(`FMCG_Fleet_Compliance_${activeAgency.id}_${Date.now()}.pdf`);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header with Title & Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#2563EB',
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #1D4ED8'
            }}>
              <Truck size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800 }}>
                Vehicle & Fleet Operations
              </h1>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Commercial delivery units, Fitness Certificates (FC), Insurance Vault & Maintenance for <strong style={{ color: 'var(--text-main)' }}>{activeAgency.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleExportPDF} className="btn btn-secondary btn-sm">
            <FileDown size={15} />
            Export Compliance Audit PDF
          </button>
          <button onClick={() => openAddService()} className="btn btn-secondary btn-sm">
            <Wrench size={15} />
            Log Service Bill
          </button>
          <button onClick={openAddVehicle} className="btn btn-primary btn-sm">
            <Plus size={16} />
            Add Fleet Vehicle
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-medium)',
        marginBottom: '24px',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'overview', label: 'Fleet Roster & Routes', icon: <Truck size={16} />, count: vehicles.length },
          { id: 'compliance', label: 'Compliance & FC Vault', icon: <ShieldCheck size={16} /> },
          { id: 'service', label: 'Service & Maintenance Log', icon: <Wrench size={16} />, count: serviceLogs.length },
          { id: 'fuel', label: 'Fuel & Mileage Analytics', icon: <Fuel size={16} /> }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  background: isActive ? 'var(--primary-glow)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? 'var(--primary-light)' : 'var(--text-dim)',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: FLEET ROSTER & OVERVIEW
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div>
          {/* Search & Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search by Reg No, Driver, or Route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px', paddingRight: '12px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Vehicle Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="select-field"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12.5px' }}
                >
                  <option value="ALL">All Types</option>
                  <option value="Mini Truck">Mini Truck (Tata Ace)</option>
                  <option value="Pickup Truck">Pickup Truck (Bolero)</option>
                  <option value="3-Wheeler Auto">3-Wheeler Auto (Ape)</option>
                  <option value="Heavy Truck">Heavy Truck (Eicher)</option>
                  <option value="Two-Wheeler">Two-Wheeler (Sales)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select-field"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12.5px' }}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Units</option>
                  <option value="EXPIRED">Expired / Grounded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Operations Fleet Master Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle Reg / Model</th>
                  <th>Assigned Driver & Beat Route</th>
                  <th>Payload & Odometer</th>
                  <th>Fitness Cert (FC)</th>
                  <th>Motor Insurance</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                        No Commercial Vehicles in Fleet Yet
                      </div>
                      <div style={{ fontSize: '12px', marginBottom: '14px' }}>
                        Add your delivery vans, Tata Ace mini-trucks, and bolero pickups to monitor RTO Fitness Certificates (FC) and Insurance.
                      </div>
                      <button onClick={openAddVehicle} className="btn btn-primary btn-sm">
                        <Plus size={14} /> Add First Fleet Vehicle
                      </button>
                    </td>
                  </tr>
                ) : filteredVehicles.map(v => {
                  const fcDays = calculateDaysLeft(v.fc?.expiryDate);
                  const insDays = calculateDaysLeft(v.insurance?.expiryDate);

                  return (
                    <tr key={v.id}>
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                          {v.regNo}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {v.model} · {v.type} ({v.fuelType})
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={13} color="var(--primary)" />
                          {v.driverName || <span style={{ color: 'var(--text-dim)' }}>Unassigned</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--cyan)" />
                          {v.assignedRoute || 'No Beat Assigned'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '12px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                          {v.payloadKg} kg ({v.crateCapacity} Crates)
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          Odo: {v.currentOdo?.toLocaleString()} km
                        </div>
                      </td>

                      <td>
                        {fcDays === null ? (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>Exempt</span>
                        ) : fcDays < 0 ? (
                          <div>
                            <span className="badge badge-rose">EXPIRED {Math.abs(fcDays)}d ago</span>
                            <div style={{ fontSize: '10.5px', color: 'var(--rose)', marginTop: '2px' }}>{v.fc?.expiryDate}</div>
                          </div>
                        ) : fcDays <= 30 ? (
                          <div>
                            <span className="badge badge-amber">{fcDays}d remaining</span>
                            <div style={{ fontSize: '10.5px', color: 'var(--amber)', marginTop: '2px' }}>{v.fc?.expiryDate}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-emerald">Valid</span>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{v.fc?.expiryDate}</div>
                          </div>
                        )}
                      </td>

                      <td>
                        {insDays === null ? (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>—</span>
                        ) : insDays < 0 ? (
                          <div>
                            <span className="badge badge-rose">EXPIRED</span>
                            <div style={{ fontSize: '10.5px', color: 'var(--rose)', marginTop: '2px' }}>{v.insurance?.insurer || 'Policy Due'}</div>
                          </div>
                        ) : insDays <= 30 ? (
                          <div>
                            <span className="badge badge-amber">{insDays}d left</span>
                            <div style={{ fontSize: '10.5px', color: 'var(--amber)', marginTop: '2px' }}>{v.insurance?.insurer}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-emerald">Valid</span>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{v.insurance?.insurer}</div>
                          </div>
                        )}
                      </td>

                      <td>
                        <span className={`badge ${v.status === 'Active' ? 'badge-emerald' : 'badge-rose'}`}>
                          {v.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => openAddService(v.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '5px 8px' }}
                            title="Log Service Bill"
                          >
                            <Wrench size={12} />
                            Service
                          </button>
                          <button
                            onClick={() => openEditVehicle(v)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '5px 8px' }}
                            title="Edit Vehicle Specs"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id, v.regNo)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '5px 7px', color: 'var(--rose)' }}
                            title="Delete Vehicle"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: COMPLIANCE & FC VAULT
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'compliance' && (
        <div>
          {/* Top Info Banner */}
          <div className="panel" style={{
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={24} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Commercial Transport Regulatory Matrix
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Monitor RTO Fitness Certificates, Comprehensive Motor Insurance, Pollution (PUC), and Road Tax to avoid transit delays and fines.
                </div>
              </div>
            </div>

            <button onClick={handleExportPDF} className="btn btn-primary btn-sm">
              <FileDown size={14} />
              Download Audit PDF
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Fitness Cert (FC)</th>
                  <th>RTO Authority</th>
                  <th>Motor Insurance</th>
                  <th>Policy # & Premium</th>
                  <th>PUC Emissions</th>
                  <th>Road Tax</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                      No vehicles in compliance matrix. Add a vehicle to begin tracking RTO Fitness Certificates.
                    </td>
                  </tr>
                ) : vehicles.map(v => {
                  const fcDays = calculateDaysLeft(v.fc?.expiryDate);
                  const insDays = calculateDaysLeft(v.insurance?.expiryDate);
                  const pucDays = calculateDaysLeft(v.puc?.expiryDate);

                  return (
                    <tr key={v.id}>
                      {/* Vehicle info */}
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)' }}>
                          {v.regNo}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {v.model} ({v.type})
                        </div>
                      </td>

                      {/* FC */}
                      <td>
                        {fcDays === null ? (
                          <span style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>Exempt</span>
                        ) : fcDays < 0 ? (
                          <div>
                            <span className="badge badge-rose">EXPIRED {Math.abs(fcDays)}d ago</span>
                            <div style={{ fontSize: '11px', color: 'var(--rose)', marginTop: '2px' }}>{v.fc?.expiryDate}</div>
                          </div>
                        ) : fcDays <= 30 ? (
                          <div>
                            <span className="badge badge-amber">Expires in {fcDays}d</span>
                            <div style={{ fontSize: '11px', color: 'var(--amber)', marginTop: '2px' }}>{v.fc?.expiryDate}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-emerald">Valid</span>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{v.fc?.expiryDate}</div>
                          </div>
                        )}
                      </td>

                      {/* RTO */}
                      <td>
                        <div style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                          {v.fc?.rtoOffice || '—'}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                          Cert: {v.fc?.certNo || '—'}
                        </div>
                      </td>

                      {/* Insurance */}
                      <td>
                        {insDays === null ? (
                          <span style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>—</span>
                        ) : insDays < 0 ? (
                          <div>
                            <span className="badge badge-rose">EXPIRED {Math.abs(insDays)}d ago</span>
                            <div style={{ fontSize: '11px', color: 'var(--rose)', marginTop: '2px' }}>{v.insurance?.expiryDate}</div>
                          </div>
                        ) : insDays <= 30 ? (
                          <div>
                            <span className="badge badge-amber">Expires in {insDays}d</span>
                            <div style={{ fontSize: '11px', color: 'var(--amber)', marginTop: '2px' }}>{v.insurance?.expiryDate}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-emerald">Valid</span>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{v.insurance?.expiryDate}</div>
                          </div>
                        )}
                      </td>

                      {/* Insurer & Premium */}
                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {v.insurance?.insurer || '—'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {v.insurance?.policyNo} · {formatCurrencyINR(v.insurance?.premium)}
                        </div>
                      </td>

                      {/* PUC */}
                      <td>
                        {pucDays === null ? (
                          <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>—</span>
                        ) : pucDays < 0 ? (
                          <span className="badge badge-rose">Expired</span>
                        ) : pucDays <= 15 ? (
                          <span className="badge badge-amber">{pucDays}d left</span>
                        ) : (
                          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>Valid ({v.puc?.expiryDate})</span>
                        )}
                      </td>

                      {/* Road Tax */}
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          {v.roadTax?.receiptNo ? 'Paid' : 'Due'}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => openEditVehicle(v)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11.5px' }}
                        >
                          Update Docs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: SERVICE & MAINTENANCE LOG
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'service' && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Vehicle Workshop & Preventative Service Records</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Track oil changes, brake repairs, tyre replacements, and garage invoices
              </p>
            </div>

            <button onClick={() => openAddService()} className="btn btn-primary btn-sm">
              <Plus size={15} />
              Log Workshop Bill
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Vehicle</th>
                  <th>Service Type</th>
                  <th>Odometer</th>
                  <th>Garage / Workshop</th>
                  <th>Job Description</th>
                  <th>Parts Cost</th>
                  <th>Labor</th>
                  <th>Total Cost</th>
                  <th>Next Service</th>
                </tr>
              </thead>
              <tbody>
                {serviceLogs.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)' }}>
                        {s.vehicleReg}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {formatDatePretty(s.serviceDate)}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontSize: '11px' }}>
                        {s.serviceType}
                      </span>
                      {s.billNumber && (
                        <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Bill: {s.billNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                      {s.odometer?.toLocaleString()} km
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--text-main)' }}>
                        {s.garageName}
                      </div>
                    </td>
                    <td style={{ maxWidth: '320px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {s.workDescription}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {formatCurrencyINR(s.partsCost)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {formatCurrencyINR(s.laborCost)}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                        {formatCurrencyINR(s.totalCost)}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {s.nextServiceKm ? `${s.nextServiceKm?.toLocaleString()} km` : '—'}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                        {s.nextServiceDate ? formatDatePretty(s.nextServiceDate) : ''}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: FUEL & MILEAGE LOGS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'fuel' && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Fuel Consumption & Mileage Efficiency (Km/L)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Identify fuel theft, driver driving habits, and cost-per-kilometer for delivery routes
              </p>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Vehicle</th>
                  <th>Driver</th>
                  <th>Start Km</th>
                  <th>End Km</th>
                  <th>Distance Run</th>
                  <th>Fuel Liters / Kg</th>
                  <th>Total Cost</th>
                  <th>Mileage Efficiency</th>
                  <th>Fuel Station</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map(f => (
                  <tr key={f.id}>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)' }}>
                        {f.vehicleReg}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {formatDatePretty(f.logDate)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{f.driverName}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{f.startKm?.toLocaleString()} km</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{f.endKm?.toLocaleString()} km</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>
                        {f.totalKm} km
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {f.fuelLiters} L
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrencyINR(f.fuelCost)}
                    </td>
                    <td>
                      <span className="badge badge-emerald" style={{ fontFamily: 'var(--font-mono)' }}>
                        {f.kmpl} km/L
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {f.fuelStation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT VEHICLE
      ═══════════════════════════════════════════════════════════════ */}
      {vehicleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>
                  {editingVehicle ? 'Edit Commercial Fleet Vehicle' : 'Add New Commercial Fleet Vehicle'}
                </h3>
              </div>
              <button
                onClick={() => setVehicleModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Row 1: Reg No & Model */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Vehicle Reg Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN-38-BZ-4921"
                    className="input-field font-mono"
                    value={vehicleForm.regNo}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, regNo: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Make & Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Ace Gold HT Plus"
                    className="input-field"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Type, Fuel, Odo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Vehicle Type</label>
                  <select
                    className="select-field"
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                  >
                    <option value="Mini Truck">Mini Truck (Tata Ace)</option>
                    <option value="Pickup Truck">Pickup Truck (Bolero)</option>
                    <option value="3-Wheeler Auto">3-Wheeler Auto (Ape)</option>
                    <option value="Heavy Truck">Heavy Truck (Eicher)</option>
                    <option value="Two-Wheeler">Two-Wheeler (Sales)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Fuel Type</label>
                  <select
                    className="select-field"
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Current Odometer (km)</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={vehicleForm.currentOdo || ''}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, currentOdo: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Row 3: Driver & Route Pairing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Assigned Driver (from Payroll)</label>
                  <select
                    className="select-field"
                    value={vehicleForm.driverName}
                    onChange={(e) => {
                      const selectedDriver = drivers.find(d => d.name === e.target.value);
                      setVehicleForm({
                        ...vehicleForm,
                        driverName: e.target.value,
                        driverId: selectedDriver ? selectedDriver.id : ''
                      });
                    }}
                  >
                    <option value="">-- Select Driver --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.role}) · DL: {d.licenseNo || 'Verified'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Assigned Route / Delivery Beat</label>
                  <input
                    type="text"
                    placeholder="e.g. Town Beat: Saibaba Colony & RS Puram"
                    className="input-field"
                    value={vehicleForm.assignedRoute}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, assignedRoute: e.target.value })}
                  />
                </div>
              </div>

              {/* Section: Regulatory & Compliance Dates */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  Regulatory & Compliance Certificates
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Fitness Certificate (FC) Expiry</label>
                    <input
                      type="date"
                      className="input-field"
                      value={vehicleForm.fc?.expiryDate || ''}
                      onChange={(e) => setVehicleForm({
                        ...vehicleForm,
                        fc: { ...vehicleForm.fc, expiryDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">RTO Authority Office</label>
                    <input
                      type="text"
                      placeholder="e.g. RTO Coimbatore North (TN-38)"
                      className="input-field"
                      value={vehicleForm.fc?.rtoOffice || ''}
                      onChange={(e) => setVehicleForm({
                        ...vehicleForm,
                        fc: { ...vehicleForm.fc, rtoOffice: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Insurance Company</label>
                    <input
                      type="text"
                      placeholder="e.g. United India / ICICI Lombard"
                      className="input-field"
                      value={vehicleForm.insurance?.insurer || ''}
                      onChange={(e) => setVehicleForm({
                        ...vehicleForm,
                        insurance: { ...vehicleForm.insurance, insurer: e.target.value }
                      })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Insurance Expiry Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={vehicleForm.insurance?.expiryDate || ''}
                      onChange={(e) => setVehicleForm({
                        ...vehicleForm,
                        insurance: { ...vehicleForm.insurance, expiryDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">PUC Expiry Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={vehicleForm.puc?.expiryDate || ''}
                      onChange={(e) => setVehicleForm({
                        ...vehicleForm,
                        puc: { ...vehicleForm.puc, expiryDate: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  {editingVehicle ? 'Update Vehicle' : 'Save Fleet Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: LOG WORKSHOP SERVICE BILL
      ═══════════════════════════════════════════════════════════════ */}
      {serviceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wrench size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>
                  Log Vehicle Workshop / Service Bill
                </h3>
              </div>
              <button
                onClick={() => setServiceModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveService} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Select Fleet Vehicle *</label>
                  <select
                    required
                    className="select-field font-mono"
                    value={serviceForm.vehicleId}
                    onChange={(e) => {
                      const v = fmcgDb.getVehicleById(e.target.value);
                      setServiceForm({
                        ...serviceForm,
                        vehicleId: e.target.value,
                        vehicleReg: v ? v.regNo : '',
                        odometer: v ? v.currentOdo : 0
                      });
                    }}
                  >
                    <option value="">-- Choose Commercial Vehicle --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.regNo} - {v.model} ({v.driverName})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Service Date *</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={serviceForm.serviceDate}
                    onChange={(e) => setServiceForm({ ...serviceForm, serviceDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Workshop / Garage Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthikeya Commercial Motors"
                    className="input-field"
                    value={serviceForm.garageName}
                    onChange={(e) => setServiceForm({ ...serviceForm, garageName: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Odometer at Service (km) *</label>
                  <input
                    type="number"
                    required
                    className="input-field font-mono"
                    value={serviceForm.odometer || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, odometer: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Work Description & Parts Replaced *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Engine oil 15W40, oil filter, brake shoe inspection, propeller shaft greasing"
                  className="textarea-field"
                  value={serviceForm.workDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, workDescription: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Spare Parts Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input-field font-mono"
                    value={serviceForm.partsCost || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, partsCost: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Labor Charges (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input-field font-mono"
                    value={serviceForm.laborCost || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, laborCost: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Garage Bill Number</label>
                  <input
                    type="text"
                    placeholder="INV-2026-09"
                    className="input-field font-mono"
                    value={serviceForm.billNumber}
                    onChange={(e) => setServiceForm({ ...serviceForm, billNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-emerald"
                >
                  <Save size={16} />
                  Record Service Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
