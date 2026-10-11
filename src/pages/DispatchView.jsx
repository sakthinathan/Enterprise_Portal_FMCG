import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { fmcgDb, formatCurrencyINR, formatDatePretty } from '../lib/fmcgDb';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Truck,
  Plus,
  FileDown,
  CheckCircle2,
  Box,
  Layers,
  ArrowRight,
  Printer,
  Calendar,
  X
} from 'lucide-react';

export default function DispatchView() {
  const { activeAgency, refreshData } = useTenant();
  const dispatchSheets = fmcgDb.getDispatchSheets(activeAgency.id);
  const vehicles = fmcgDb.getVehicles(activeAgency.id).filter(v => v.status === 'Active');
  const drivers = fmcgDb.getEmployees(activeAgency.id).filter(e => e.role.toLowerCase().includes('driver') || e.role.toLowerCase().includes('pilot'));

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    dispatchDate: new Date().toISOString().split('T')[0],
    vehicleReg: vehicles[0]?.regNo || '',
    driverName: vehicles[0]?.driverName || '',
    routeBeat: '',
    totalCartons: 50,
    plasticCratesIssued: 15,
    plasticCratesReturned: 0,
    retailerCount: 25,
    invoiceValue: 120000,
    status: 'On Delivery Beat'
  });

  const handleCreateDispatch = (e) => {
    e.preventDefault();
    fmcgDb.addDispatchSheet(form);
    confetti({ particleCount: 50, spread: 50 });
    setModalOpen(false);
    refreshData();
  };

  const handlePrintGatePass = (dsp) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(activeAgency.name, 14, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Official Godown Delivery Van Gate Pass & Loading Sheet`, 14, 23);
    doc.text(`GSTIN: ${activeAgency.gstin} · Date: ${dsp.dispatchDate}`, 14, 29);

    autoTable(doc, {
      startY: 42,
      head: [['Field Description', 'Dispatch Particulars']],
      body: [
        ['Vehicle Registration No', dsp.vehicleReg],
        ['Assigned Delivery Pilot', dsp.driverName],
        ['Delivery Route / Beat', dsp.routeBeat],
        ['Total FMCG Cartons Loaded', `${dsp.totalCartons} Cartons`],
        ['Returnable Delivery Crates Issued', `${dsp.plasticCratesIssued} Crates`],
        ['Retail Stores / Supermarkets', `${dsp.retailerCount} Outlets`],
        ['Invoice Manifest Total', formatCurrencyINR(dsp.invoiceValue)],
        ['Current Trip Status', dsp.status]
      ],
      theme: 'grid',
      headStyles: { fillColor: [6, 182, 212], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorized Godown Supervisor Signature: _______________________', 14, doc.lastAutoTable.finalY + 25);
    doc.text('Delivery Driver Acknowledgment: _______________________', 14, doc.lastAutoTable.finalY + 35);

    doc.save(`GatePass_${dsp.vehicleReg}_${dsp.dispatchDate}.pdf`);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#0891B2',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #0E7490'
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>
              Van Loading & Gate Pass Generator
            </h1>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              FMCG Route Delivery Beats, Carton Loading Manifests & Plastic Crate Reconciliation for <strong style={{ color: 'var(--text-main)' }}>{activeAgency.name}</strong>
            </p>
          </div>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Create New Van Dispatch Run
        </button>
      </div>

      {/* Dispatches List */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Today's Delivery Route Dispatches</h3>
          <span className="badge badge-cyan">{dispatchSheets.length} Delivery Manifests</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Vehicle</th>
                <th>Driver</th>
                <th>Route / Delivery Beat</th>
                <th>Cartons</th>
                <th>Crates (Out / In)</th>
                <th>Retail Outlets</th>
                <th>Invoice Value</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dispatchSheets.map(dsp => (
                <tr key={dsp.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)' }}>
                      {dsp.vehicleReg}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatDatePretty(dsp.dispatchDate)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{dsp.driverName}</div>
                  </td>
                  <td style={{ maxWidth: '260px', fontSize: '12.5px', color: 'var(--text-main)' }}>
                    {dsp.routeBeat}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px' }}>
                    {dsp.totalCartons} ctns
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>
                      {dsp.plasticCratesIssued} issued / {dsp.plasticCratesReturned} returned
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {dsp.retailerCount} stores
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald)' }}>
                    {formatCurrencyINR(dsp.invoiceValue)}
                  </td>
                  <td>
                    <span className={`badge ${dsp.status === 'Completed & Settled' ? 'badge-emerald' : 'badge-cyan'}`}>
                      {dsp.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handlePrintGatePass(dsp)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11.5px', padding: '4px 10px' }}
                    >
                      <Printer size={13} />
                      Gate Pass PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Dispatch */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="var(--cyan)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Create Van Loading Sheet & Gate Pass</h3>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Select Active Delivery Vehicle *</label>
                  <select
                    required
                    className="select-field font-mono"
                    value={form.vehicleReg}
                    onChange={(e) => {
                      const v = vehicles.find(veh => veh.regNo === e.target.value);
                      setForm({
                        ...form,
                        vehicleReg: e.target.value,
                        driverName: v ? v.driverName : form.driverName,
                        routeBeat: v ? v.assignedRoute : form.routeBeat
                      });
                    }}
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.regNo}>
                        {v.regNo} - {v.model} ({v.driverName})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Driver Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={form.driverName}
                    onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Delivery Route / Beat Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Town: Saibaba Colony & Koundampalayam"
                  className="input-field"
                  value={form.routeBeat}
                  onChange={(e) => setForm({ ...form, routeBeat: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Total Cartons</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={form.totalCartons}
                    onChange={(e) => setForm({ ...form, totalCartons: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Plastic Crates Issued</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={form.plasticCratesIssued}
                    onChange={(e) => setForm({ ...form, plasticCratesIssued: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Retail Outlets Count</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={form.retailerCount}
                    onChange={(e) => setForm({ ...form, retailerCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Estimated Invoice Manifest Value (₹)</label>
                <input
                  type="number"
                  className="input-field font-mono"
                  value={form.invoiceValue}
                  onChange={(e) => setForm({ ...form, invoiceValue: Number(e.target.value) })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
