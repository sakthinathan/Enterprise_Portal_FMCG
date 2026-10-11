import React, { useState, useMemo } from 'react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { fmcgDb, formatCurrencyINR, formatDatePretty } from '../lib/fmcgDb';
import { formatCbbPcs, calculateCbbPcs } from '../lib/cbbUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import {
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Search,
  Filter,
  Save,
  Printer,
  Check,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  X,
  Plus
} from 'lucide-react';

export default function GodownStockAudit() {
  const { activeAgency, refreshData } = useTenant();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COUNTED'

  // Modal for editing single count
  const [countModalOpen, setCountModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [inputCbb, setInputCbb] = useState(0);
  const [inputPcs, setInputPcs] = useState(0);

  // Damaged goods modal
  const [damagedModalOpen, setDamagedModalOpen] = useState(false);
  const [damagedItem, setDamagedItem] = useState(null);
  const [damagedForm, setDamagedForm] = useState({
    quantityCartons: 0,
    quantityPcs: 0,
    reason: 'Depot transit crush damage',
    reportedBy: user?.name || 'Godown Stock Checker'
  });

  const [toastMessage, setToastMessage] = useState('');

  // Fetch live stock items for active agency
  const stockItems = fmcgDb.getStockItems(activeAgency.id);

  // Extract unique brands from stock items
  const brands = useMemo(() => {
    const set = new Set();
    stockItems.forEach(item => {
      if (item.brand) set.add(item.brand);
    });
    return Array.from(set).sort();
  }, [stockItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return stockItems.filter(item => {
      const matchesSearch =
        (item.material || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrandFilter === 'ALL' || item.brand === selectedBrandFilter;

      const isCounted = item.physicalStockCbb !== undefined && item.physicalStockCbb !== null && item.physicalStockCbb !== '';
      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'COUNTED' && isCounted) ||
        (selectedStatusFilter === 'PENDING' && !isCounted);

      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [stockItems, searchQuery, selectedBrandFilter, selectedStatusFilter]);

  // Audit Metrics (Strictly Blind-Safe: No System stock totals or shortage values!)
  const totalSkus = stockItems.length;
  const countedCount = stockItems.filter(s => s.physicalStockCbb !== undefined && s.physicalStockCbb !== null && s.physicalStockCbb !== '').length;
  const pendingCount = totalSkus - countedCount;
  const progressPercent = totalSkus > 0 ? Math.round((countedCount / totalSkus) * 100) : 0;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenCountModal = (item) => {
    setEditingItem(item);
    setInputCbb(item.physicalStockCbb !== undefined && item.physicalStockCbb !== null ? item.physicalStockCbb : 0);
    setInputPcs(item.physicalStockPcs !== undefined && item.physicalStockPcs !== null ? item.physicalStockPcs : 0);
    setCountModalOpen(true);
  };

  const handleSaveModalCount = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    fmcgDb.updatePhysicalCount(editingItem.id, Number(inputCbb), Number(inputPcs));
    setCountModalOpen(false);
    refreshData();
    showToast(`Physical count saved for ${editingItem.description}`);
  };

  const handleDirectCountSave = (item, cbbVal, pcsVal) => {
    fmcgDb.updatePhysicalCount(item.id, Number(cbbVal || 0), Number(pcsVal || 0));
    refreshData();
    showToast(`Count updated for ${item.material}`);
  };

  const handleOpenDamagedModal = (item) => {
    setDamagedItem(item);
    setDamagedForm({
      quantityCartons: 0,
      quantityPcs: 1,
      reason: 'Depot transit crush damage',
      reportedBy: user?.name || 'Godown Stock Checker'
    });
    setDamagedModalOpen(true);
  };

  const handleSaveDamaged = (e) => {
    e.preventDefault();
    if (!damagedItem) return;

    const conv = damagedItem.conversion || 1;
    const estLoss = Math.round(
      (Number(damagedForm.quantityCartons) * conv + Number(damagedForm.quantityPcs)) * (damagedItem.mrp || 10)
    );

    fmcgDb.addDamagedGoods({
      brand: damagedItem.brand || 'General',
      productName: damagedItem.description || damagedItem.material,
      quantityCartons: Number(damagedForm.quantityCartons),
      quantityPcs: Number(damagedForm.quantityPcs),
      estimatedLoss: estLoss,
      reason: damagedForm.reason,
      reportedBy: damagedForm.reportedBy,
      reportDate: new Date().toISOString().split('T')[0],
      agencyId: activeAgency.id,
      vendorClaimStatus: 'Pending Depot Inspection'
    });

    setDamagedModalOpen(false);
    refreshData();
    showToast(`Damaged packets recorded for ${damagedItem.material}`);
  };

  const handleCompleteAudit = () => {
    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
    } catch {}
    showToast('Godown Physical Stock Audit entries submitted successfully to Operations!');
  };

  const handleLoadSampleMaster = () => {
    const sampleItems = [
      {
        id: `sku-itc-01`,
        material: 'ITC-DF-75G',
        description: 'Sunfeast Dark Fantasy Choco Fills 75g',
        brand: 'ITC',
        conversion: 24,
        mrp: 30,
        systemStockCbb: 45,
        systemStockPcs: 12,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-itc-02`,
        material: 'ITC-ASH-5KG',
        description: 'Aashirvaad Superior MP Sharbati Atta 5kg',
        brand: 'ITC',
        conversion: 4,
        mrp: 295,
        systemStockCbb: 80,
        systemStockPcs: 2,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-brit-01`,
        material: 'BRIT-GD-CASHEW',
        description: 'Britannia Good Day Cashew Cookies 100g',
        brand: 'Britannia',
        conversion: 36,
        mrp: 25,
        systemStockCbb: 120,
        systemStockPcs: 18,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-brit-02`,
        material: 'BRIT-MARIE-250G',
        description: 'Britannia Marie Gold Biscuit 250g Value Pack',
        brand: 'Britannia',
        conversion: 24,
        mrp: 40,
        systemStockCbb: 95,
        systemStockPcs: 6,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-nes-01`,
        material: 'NEST-MAGGI-70G',
        description: 'Maggi 2-Minute Masala Noodles 70g Pack',
        brand: 'Nestle',
        conversion: 48,
        mrp: 14,
        systemStockCbb: 150,
        systemStockPcs: 20,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-tata-01`,
        material: 'TATA-GOLD-500G',
        description: 'Tata Tea Gold Leaf Pouch 500g',
        brand: 'Tata Consumer',
        conversion: 20,
        mrp: 310,
        systemStockCbb: 60,
        systemStockPcs: 4,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-hul-01`,
        material: 'HUL-SURF-EX-1KG',
        description: 'Surf Excel Easy Wash Detergent Powder 1kg',
        brand: 'HUL',
        conversion: 12,
        mrp: 145,
        systemStockCbb: 75,
        systemStockPcs: 8,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      },
      {
        id: `sku-hul-02`,
        material: 'HUL-DOVE-100G',
        description: 'Dove Cream Beauty Bathing Bar 100g',
        brand: 'HUL',
        conversion: 36,
        mrp: 65,
        systemStockCbb: 110,
        systemStockPcs: 14,
        physicalStockCbb: null,
        physicalStockPcs: null,
        agencyId: activeAgency.id
      }
    ];

    fmcgDb.setStockItems(sampleItems, activeAgency.id);
    refreshData();
    showToast('FMCG stock master loaded for physical audit testing');
  };

  // Generate Printable Physical Audit Checklist (Blank count lines for godown floor)
  const handlePrintAuditSheet = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${activeAgency.name} - Physical Godown Stock Audit Sheet`, 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Warehouse Hub: ${activeAgency.hubLocation} | Date: ${new Date().toLocaleDateString('en-IN')} | Auditor: ${user?.name || 'Godown Staff'}`, 14, 23);
    doc.text(`NOTE: BLIND AUDIT PROTOCOL - Count actual physical packages with eyes. Do not estimate.`, 14, 28);

    const tableRows = filteredItems.map((item, idx) => [
      idx + 1,
      item.material || '—',
      item.description || '—',
      item.brand || '—',
      `1 CBB = ${item.conversion} PCS`,
      formatCurrencyINR(item.mrp),
      item.physicalStockCbb !== undefined ? `${item.physicalStockCbb} CBB` : '[ _____ CBB ]',
      item.physicalStockPcs !== undefined ? `${item.physicalStockPcs} PCS` : '[ _____ PCS ]'
    ]);

    autoTable(doc, {
      startY: 32,
      head: [['#', 'Material Code', 'SKU Description', 'Brand', 'Pack Conv', 'MRP', 'Physical CBB', 'Physical PCS']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 3 }
    });

    doc.save(`${activeAgency.name.replace(/\s+/g, '_')}_Godown_Audit_Sheet.pdf`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'var(--emerald)',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* 1. Header Banner & Blind Audit Protocol Badge */}
      <div className="panel" style={{ padding: '20px 24px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{
                background: 'var(--amber)',
                color: '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EyeOff size={18} />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Godown Physical Stock Audit (Blind Count Entry)
                </h1>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>
                  GODOWN OPERATOR & PHYSICAL RECONCILIATION PORTAL
                </div>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Active warehouse count for <strong style={{ color: 'var(--text-main)' }}>{activeAgency.name}</strong> ({activeAgency.hubLocation}).
              Enter actual counted cartons (CBB) and loose units (PCS) directly from the godown floor.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-amber" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} />
              Blind Protocol: System Stock Masked
            </span>
            <button onClick={handlePrintAuditSheet} className="btn btn-secondary btn-sm">
              <Printer size={14} />
              Print Count Sheet (PDF)
            </button>
            <button onClick={handleCompleteAudit} className="btn btn-primary btn-sm">
              <Save size={14} />
              Submit Completed Audit
            </button>
          </div>
        </div>
      </div>

      {/* 2. Audit KPI Metrics Strip (Strictly Blind-Safe) */}
      <div className="metrics-strip">
        <div className="metric-box">
          <div className="metric-box-title">Total Active SKUs</div>
          <div className="metric-box-val">{totalSkus} SKUs</div>
          <div className="metric-box-sub">Active master from operations</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">Physically Counted</div>
          <div className="metric-box-val" style={{ color: 'var(--emerald)' }}>
            {countedCount} / {totalSkus}
          </div>
          <div className="metric-box-sub">{progressPercent}% Warehouse Progress</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">Pending Physical Count</div>
          <div className="metric-box-val" style={{ color: pendingCount > 0 ? 'var(--amber)' : 'var(--text-main)' }}>
            {pendingCount} Items
          </div>
          <div className="metric-box-sub">Awaiting shelf verification</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">Active Warehouse Brands</div>
          <div className="metric-box-val" style={{ color: 'var(--primary-text)' }}>
            {brands.length} Brands
          </div>
          <div className="metric-box-sub">ITC, HUL, Britannia & more</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search material code, SKU name, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '32px', fontSize: '12.5px' }}
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="select-field"
              style={{ width: '180px', fontSize: '12.5px' }}
            >
              <option value="ALL">All Brands ({brands.length})</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="select-field"
              style={{ width: '170px', fontSize: '12.5px' }}
            >
              <option value="ALL">All Status ({stockItems.length})</option>
              <option value="PENDING">Pending Count ({pendingCount})</option>
              <option value="COUNTED">Counted ✓ ({countedCount})</option>
            </select>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredItems.length}</strong> of {totalSkus} SKUs
          </div>
        </div>
      </div>

      {/* 4. The Blind Audit Table */}
      <div className="panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Physical Stock Count Roster</h3>
            <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
              {activeAgency.name}
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>
            Inputs auto-save directly to agency inventory ledger
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Material Code & Description</th>
                <th>Brand</th>
                <th>Pack & Conv</th>
                <th>MRP</th>
                <th style={{ background: '#FFFBEB', color: '#92400E' }}>System Stock (ERP)</th>
                <th style={{ background: '#EFF6FF', color: '#1D4ED8' }}>Physical CBB (Cartons)</th>
                <th style={{ background: '#EFF6FF', color: '#1D4ED8' }}>Physical PCS (Pieces)</th>
                <th>Audit Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      {stockItems.length === 0 ? 'No Active Stock Master Uploaded' : 'No SKUs Match Current Filter'}
                    </div>
                    <div style={{ fontSize: '12px', maxWidth: '440px', margin: '0 auto 14px auto' }}>
                      {stockItems.length === 0
                        ? 'Operations team has not yet loaded the StockMRP spreadsheet for this agency. Log into the Main Portal as Operations Admin to upload the stock master.'
                        : 'Try adjusting your search query or brand filter to view items.'}
                    </div>
                    {stockItems.length === 0 && (
                      <button
                        type="button"
                        onClick={handleLoadSampleMaster}
                        className="btn btn-primary btn-sm"
                      >
                        <Plus size={14} />
                        Load FMCG Active Master (ITC, Britannia, Nestle, Tata)
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isCounted = item.physicalStockCbb !== undefined && item.physicalStockCbb !== null && item.physicalStockCbb !== '';
                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                          {item.description || item.material}
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Code: {item.material}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                          {item.brand || 'General'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                        1 CBB = {item.conversion || 1} PCS
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {formatCurrencyINR(item.mrp || 0)}
                      </td>

                      {/* BLIND AUDIT MASK: SYSTEM STOCK IS STRICTLY HIDDEN */}
                      <td style={{ background: '#FFFDF5' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span className="badge badge-neutral" style={{
                            letterSpacing: '0.12em',
                            fontWeight: 800,
                            background: '#F1F5F9',
                            color: '#64748B'
                          }}>
                            •••••• MASKED ••••••
                          </span>
                          <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                            Hidden for Blind Audit
                          </span>
                        </div>
                      </td>

                      {/* Physical CBB Input */}
                      <td style={{ background: '#F8FAFC' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            defaultValue={item.physicalStockCbb !== undefined ? item.physicalStockCbb : ''}
                            onBlur={(e) => handleDirectCountSave(item, e.target.value, item.physicalStockPcs || 0)}
                            className="input-field"
                            style={{ width: '80px', padding: '6px 8px', fontSize: '12.5px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>ctns</span>
                        </div>
                      </td>

                      {/* Physical PCS Input */}
                      <td style={{ background: '#F8FAFC' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="0"
                            max={(item.conversion || 1) - 1}
                            placeholder="0"
                            defaultValue={item.physicalStockPcs !== undefined ? item.physicalStockPcs : ''}
                            onBlur={(e) => handleDirectCountSave(item, item.physicalStockCbb || 0, e.target.value)}
                            className="input-field"
                            style={{ width: '70px', padding: '6px 8px', fontSize: '12.5px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>pcs</span>
                        </div>
                      </td>

                      {/* Audit Status */}
                      <td>
                        {isCounted ? (
                          <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            Counted ✓
                          </span>
                        ) : (
                          <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} />
                            Pending Count
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenCountModal(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            title="Detailed Count Entry"
                          >
                            Count Entry →
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDamagedModal(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--rose-text)' }}
                            title="Report damaged cartons/loose pieces"
                          >
                            <AlertTriangle size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Detailed Physical Count Entry */}
      {countModalOpen && editingItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Physical Godown Count Entry</h3>
              </div>
              <button
                type="button"
                onClick={() => setCountModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModalCount} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {editingItem.description}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Material Code: <span className="font-mono">{editingItem.material}</span> · Brand: {editingItem.brand}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Packing Factor: <strong>1 CBB = {editingItem.conversion} PCS</strong> · MRP: {formatCurrencyINR(editingItem.mrp)}
                </div>
              </div>

              {/* Blind audit notice */}
              <div style={{ padding: '10px 12px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: 'var(--radius-md)', fontSize: '11.5px', color: 'var(--amber-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EyeOff size={16} />
                <span>System ERP stock is hidden. Enter the exact physical packages counted on the godown shelf.</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Physical Cartons (CBB) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={inputCbb}
                    onChange={(e) => setInputCbb(e.target.value)}
                    className="input-field font-mono"
                    style={{ fontSize: '15px', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>Full sealed master cartons</span>
                </div>

                <div>
                  <label className="input-label">Loose Units (PCS) *</label>
                  <input
                    type="number"
                    min="0"
                    max={(editingItem.conversion || 1) - 1}
                    required
                    value={inputPcs}
                    onChange={(e) => setInputPcs(e.target.value)}
                    className="input-field font-mono"
                    style={{ fontSize: '15px', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>Loose packets (0 to {(editingItem.conversion || 1) - 1})</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCountModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={14} />
                  Record Physical Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Damaged / Expiry Packets */}
      {damagedModalOpen && damagedItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} color="var(--rose)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Log Damaged / Broken Packets</h3>
              </div>
              <button
                type="button"
                onClick={() => setDamagedModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDamaged} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 700 }}>
                {damagedItem.description} ({damagedItem.material})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Damaged Cartons (CBB)</label>
                  <input
                    type="number"
                    min="0"
                    value={damagedForm.quantityCartons}
                    onChange={(e) => setDamagedForm({ ...damagedForm, quantityCartons: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>
                <div>
                  <label className="input-label">Damaged Pieces (PCS)</label>
                  <input
                    type="number"
                    min="0"
                    value={damagedForm.quantityPcs}
                    onChange={(e) => setDamagedForm({ ...damagedForm, quantityPcs: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Damage / Discrepancy Reason *</label>
                <select
                  value={damagedForm.reason}
                  onChange={(e) => setDamagedForm({ ...damagedForm, reason: e.target.value })}
                  className="select-field"
                >
                  <option value="Depot transit crush damage">Depot transit crush damage</option>
                  <option value="Water seepage / rain damage">Water seepage / rain damage</option>
                  <option value="Rodent / godown pest infestation">Rodent / godown pest infestation</option>
                  <option value="Near-expiry / expired batch on shelf">Near-expiry / expired batch on shelf</option>
                  <option value="Factory packaging defect / leakage">Factory packaging defect / leakage</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setDamagedModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }}>
                  Submit Damage Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
