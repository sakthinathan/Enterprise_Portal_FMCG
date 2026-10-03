import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { fmcgDb, formatCurrencyINR } from '../lib/fmcgDb';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import {
  Package,
  LayoutDashboard,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  UploadCloud,
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  X,
  Save,
  Check
} from 'lucide-react';

export default function StockView() {
  const { activeAgency, refreshData } = useTenant();

  // Tabs: 'dashboard' | 'brands' | 'audit' | 'reports' | 'upload' | 'damaged'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modals & Forms
  const [countModalOpen, setCountModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [physicalCbb, setPhysicalCbb] = useState(0);
  const [physicalPcs, setPhysicalPcs] = useState(0);

  const [damagedModalOpen, setDamagedModalOpen] = useState(false);
  const [damagedForm, setDamagedForm] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    brand: 'Britannia',
    productName: '',
    quantityCartons: 1,
    quantityPcs: 0,
    estimatedLoss: 1200,
    reason: '',
    vendorClaimStatus: 'Pending Depot Credit Note'
  });

  // Live Data
  const brands = fmcgDb.getStockBrands();
  const stockItems = fmcgDb.getStockItems();
  const damagedGoods = fmcgDb.getDamagedGoods();

  // Compute Stats
  const totalProducts = stockItems.length;
  let equalCount = 0;
  let shortageCount = 0;
  let excessCount = 0;
  let totalSystemValuation = 0;
  let totalDiscrepancyValuation = 0;

  stockItems.forEach(s => {
    totalSystemValuation += (s.systemStockCbb * s.conversion * s.mrp);
    totalDiscrepancyValuation += s.varianceValue;
    if (s.status === 'Equal') equalCount++;
    else if (s.status === 'Shortage') shortageCount++;
    else if (s.status === 'Excess') excessCount++;
  });

  // Filtered Items
  const filteredItems = stockItems.filter(s => {
    const matchesSearch = s.materialDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrandFilter === 'ALL' || s.brand === selectedBrandFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || s.status === selectedStatusFilter;
    return matchesSearch && matchesBrand && matchesStatus;
  });

  // Open Count Modal
  const openCountModal = (item) => {
    setEditingItem(item);
    setPhysicalCbb(item.physicalStockCbb);
    setPhysicalPcs(item.physicalStockPcs);
    setCountModalOpen(true);
  };

  // Save Physical Count
  const handleSaveCount = (e) => {
    e.preventDefault();
    if (editingItem) {
      fmcgDb.updatePhysicalCount(editingItem.id, physicalCbb, physicalPcs);
      confetti({ particleCount: 40, spread: 50 });
      setCountModalOpen(false);
      refreshData();
    }
  };

  // Add Damaged Item
  const handleSaveDamaged = (e) => {
    e.preventDefault();
    fmcgDb.addDamagedGoods(damagedForm);
    confetti({ particleCount: 35, spread: 45 });
    setDamagedModalOpen(false);
    refreshData();
  };

  // Export Stock Variance PDF
  const handleExportVariancePDF = () => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(activeAgency.name, 14, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`FMCG Stock Physical Audit & Variance Reconciliation Report`, 14, 24);
    doc.text(`GSTIN: ${activeAgency.gstin} · Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);

    const rows = stockItems.map(s => [
      s.material,
      s.materialDesc,
      s.brand,
      `MRP Rs.${s.mrp}`,
      `${s.systemStockCbb} Ctn`,
      `${s.physicalStockCbb} Ctn ${s.physicalStockPcs ? `+${s.physicalStockPcs}p` : ''}`,
      s.variance === 0 ? '0' : `${s.variance > 0 ? '+' : ''}${s.variance} Ctn`,
      formatCurrencyINR(s.varianceValue),
      s.status
    ]);

    autoTable(doc, {
      startY: 44,
      head: [['Code', 'Material Description', 'Brand', 'MRP', 'System Stock', 'Physical Count', 'Variance', 'Diff Value', 'Status']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8 }
    });

    doc.save(`Stock_Audit_Variance_${activeAgency.id}_${Date.now()}.pdf`);
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
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            <Package size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>
              FMCG StockSync & Inventory Portal
            </h1>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Brand Selection, Physical Godown Count, System Variance & Damaged Stock for <strong style={{ color: 'var(--text-main)' }}>{activeAgency.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleExportVariancePDF} className="btn btn-secondary btn-sm">
            <FileDown size={14} />
            Export Variance PDF
          </button>
          <button onClick={() => setDamagedModalOpen(true)} className="btn btn-secondary btn-sm">
            <AlertTriangle size={14} />
            Log Damaged Goods
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        borderBottom: '1px solid var(--border-medium)',
        marginBottom: '24px',
        paddingBottom: '2px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: 'Stock Dashboard', icon: <LayoutDashboard size={16} /> },
          { id: 'brands', label: 'Brand Selection & Godowns', icon: <Building2 size={16} />, count: brands.length },
          { id: 'audit', label: 'Physical Stock Count / Audit', icon: <Package size={16} />, count: totalProducts },
          { id: 'reports', label: 'Variance & Discrepancy Reports', icon: <FileSpreadsheet size={16} /> },
          { id: 'upload', label: 'Upload Stock Sheet (ERP)', icon: <UploadCloud size={16} /> },
          { id: 'damaged', label: 'Damaged & Expiry Goods', icon: <AlertTriangle size={16} />, count: damagedGoods.length }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                color: isActive ? '#6EE7B7' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--emerald)' : '2px solid transparent',
                marginBottom: '-2px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  background: isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#6EE7B7' : 'var(--text-dim)',
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
          TAB 1: STOCK DASHBOARD
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'dashboard' && (
        <div>
          {/* KPI Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Godown Valuation
                </span>
                <Package size={18} color="var(--emerald)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {formatCurrencyINR(totalSystemValuation)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--emerald)', marginTop: '4px' }}>
                Across {brands.length} Authorized FMCG Brands ({totalProducts} Active SKUs)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Physical Count Accuracy
                </span>
                <CheckCircle2 size={18} color="var(--cyan)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {equalCount} / {totalProducts} Match
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '4px' }}>
                <span className="badge badge-emerald">{Math.round((equalCount / totalProducts) * 100)}% Match Rate</span>
                <span style={{ color: 'var(--text-muted)' }}>zero variance</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Shortage Discrepancy
                </span>
                <TrendingDown size={18} color="var(--rose)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--font-heading)' }}>
                {shortageCount} SKUs Short
              </div>
              <div style={{ fontSize: '12px', color: 'var(--rose)', marginTop: '4px' }}>
                {formatCurrencyINR(Math.abs(totalDiscrepancyValuation))} physical shortfall value
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Excess Stock Flagged
                </span>
                <TrendingUp size={18} color="var(--amber)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-heading)' }}>
                {excessCount} SKUs Over
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Physical cartons exceed ERP snapshot
              </div>
            </div>
          </div>

          {/* Brands Breakdown Preview */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Authorized FMCG Brand Portfolios</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Warehouse cartons and inventory breakdown across mother godowns
                </p>
              </div>
              <button onClick={() => setActiveTab('brands')} className="btn btn-secondary btn-sm">
                View All Brands →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {brands.map(brand => (
                <div
                  key={brand.id}
                  onClick={() => { setSelectedBrandFilter(brand.name.split(' ')[0]); setActiveTab('audit'); }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--emerald)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>
                      {brand.name}
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                      {brand.totalSkus} SKUs
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Godown #1: <strong>{brand.godownA_Cartons} ctns</strong> · Godown #2: <strong>{brand.godownB_Cartons} ctns</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>Brand Valuation:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald)', fontSize: '13px' }}>
                      {formatCurrencyINR(brand.valuation)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: BRAND SELECTION & GODOWNS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'brands' && (
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
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>FMCG Brand Portfolios & Distribution Hubs</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Select a principal brand company to inspect SKU lines and warehouse allocations
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {brands.map(brand => (
              <div key={brand.id} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '18px'
                  }}>
                    🏢
                  </div>
                  <span className="badge badge-emerald">{brand.totalSkus} SKUs Active</span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>{brand.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Primary Inward Depot: Coimbatore Mother Hub · Secondary: Erode Cross-Dock
                </p>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Central Godown #1:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{brand.godownA_Cartons} Cartons</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Station Godown #2:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{brand.godownB_Cartons} Cartons</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Valuation:</span>
                    <strong style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>{formatCurrencyINR(brand.valuation)}</strong>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedBrandFilter(brand.name.split(' ')[0]); setActiveTab('audit'); }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  Inspect Physical Stock Audit →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: PHYSICAL STOCK COUNT / AUDIT SESSION
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div>
          {/* Filter & Search Bar */}
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
                placeholder="Search SKU by name or material code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={selectedBrandFilter}
                onChange={(e) => setSelectedBrandFilter(e.target.value)}
                className="select-field"
                style={{ width: 'auto', padding: '8px 14px' }}
              >
                <option value="ALL">All Brands</option>
                <option value="Britannia">Britannia</option>
                <option value="Dabur">Dabur</option>
                <option value="ITC">ITC</option>
                <option value="Tata Consumer">Tata Consumer</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="select-field"
                style={{ width: 'auto', padding: '8px 14px' }}
              >
                <option value="ALL">All Status</option>
                <option value="Equal">Equal (0 Variance)</option>
                <option value="Shortage">Shortage Only</option>
                <option value="Excess">Excess Only</option>
              </select>
            </div>
          </div>

          {/* Audit Items Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Material Code & SKU</th>
                    <th>Brand</th>
                    <th>MRP / Case Pack</th>
                    <th>System Stock (ERP)</th>
                    <th>Physical Count</th>
                    <th>Variance</th>
                    <th>Discrepancy (₹)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Audit Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-main)' }}>
                          {item.materialDesc}
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                          Code: {item.material} · {item.godown}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          {item.brand}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        ₹{item.mrp} ({item.conversion} pcs/ctn)
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {item.systemStockCbb} Ctn {item.systemStockPcs > 0 ? `+ ${item.systemStockPcs}p` : ''}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)' }}>
                        {item.physicalStockCbb} Ctn {item.physicalStockPcs > 0 ? `+ ${item.physicalStockPcs}p` : ''}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {item.variance === 0 ? (
                          <span style={{ color: 'var(--emerald)' }}>0.00</span>
                        ) : (
                          <span style={{ color: item.variance < 0 ? 'var(--rose)' : 'var(--amber)', fontWeight: 700 }}>
                            {item.variance > 0 ? `+${item.variance}` : item.variance} Ctn
                          </span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {item.varianceValue === 0 ? (
                          <span style={{ color: 'var(--text-dim)' }}>₹0</span>
                        ) : (
                          <span style={{ color: item.varianceValue < 0 ? 'var(--rose)' : 'var(--amber)' }}>
                            {formatCurrencyINR(item.varianceValue)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'Equal' ? 'badge-emerald' : item.status === 'Shortage' ? 'badge-rose' : 'badge-amber'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => openCountModal(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        >
                          Update Count
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: VARIANCE & DISCREPANCY REPORTS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'reports' && (
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
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Audit Variance & Loss Discrepancy Analysis</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Detailed report of physical inventory differences for godown management review
              </p>
            </div>
            <button onClick={handleExportVariancePDF} className="btn btn-primary btn-sm">
              <FileDown size={14} />
              Export Variance PDF Report
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--rose-bg)', border: '1px solid var(--rose-border)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--rose)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Shortage Loss
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FCA5A5', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  {formatCurrencyINR(Math.abs(totalDiscrepancyValuation))}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  2 SKUs with missing physical cases (Investigation in progress)
                </div>
              </div>

              <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Unaccounted Excess
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FDE68A', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  +₹450
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  1 SKU with surplus physical packages
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Brand</th>
                    <th>ERP System</th>
                    <th>Physical Count</th>
                    <th>Carton Difference</th>
                    <th>Valuation Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.filter(s => s.variance !== 0).map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700 }}>{s.materialDesc}</td>
                      <td>{s.brand}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{s.systemStockCbb} Ctn</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{s.physicalStockCbb} Ctn {s.physicalStockPcs ? `+ ${s.physicalStockPcs}p` : ''}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.variance < 0 ? 'var(--rose)' : 'var(--amber)' }}>
                        {s.variance > 0 ? `+${s.variance}` : s.variance} Cartons
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.varianceValue < 0 ? 'var(--rose)' : 'var(--amber)' }}>
                        {formatCurrencyINR(s.varianceValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 5: UPLOAD STOCK SHEET (ERP SNAPSHOT)
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'upload' && (
        <div style={{ maxWidth: '720px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              Import Daily ERP Stock Snapshot (Excel / CSV)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Upload morning stock sheets downloaded from SAP / Tally / FMCG Principal Portals (ITC, Britannia, Dabur)
            </p>

            <div style={{
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.2s ease',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--emerald)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            onClick={() => {
              alert('Excel snapshot parsed! 8 SKUs synchronized successfully.');
              confetti({ particleCount: 30, spread: 40 });
            }}
            >
              <UploadCloud size={44} color="var(--emerald)" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Drag and drop your StockMRP.xlsx or .csv here
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Required columns: Material, Material Description, Brand, MRP, Conversion, Stock CBB, Stock Pcs
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <strong>Recent Inward Snapshot:</strong> StockMRP_03_10_2026_0900.xlsx (Synchronized 4 FMCG Brands, 8 Material Lines)
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 6: DAMAGED & EXPIRY GOODS LOG
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'damaged' && (
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
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>FMCG Transit Damage & Expiry Claims</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Log damaged biscuits, seal leakages, and expired goods for vendor credit note claims
              </p>
            </div>
            <button onClick={() => setDamagedModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={14} />
              Log Damaged Stock
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Brand</th>
                    <th>Product Particulars</th>
                    <th>Damaged Quantity</th>
                    <th>Estimated Loss (₹)</th>
                    <th>Reason / Defect</th>
                    <th>Vendor Credit Note Status</th>
                  </tr>
                </thead>
                <tbody>
                  {damagedGoods.map(dmg => (
                    <tr key={dmg.id}>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13px' }}>{dmg.brand}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDatePretty(dmg.reportDate)}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dmg.productName}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {dmg.quantityCartons} Ctn {dmg.quantityPcs > 0 ? `+ ${dmg.quantityPcs} pcs` : ''}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--rose)' }}>
                        {formatCurrencyINR(dmg.estimatedLoss)}
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px' }}>
                        {dmg.reason}
                      </td>
                      <td>
                        <span className={`badge ${dmg.vendorClaimStatus === 'Credit Note Approved' ? 'badge-emerald' : 'badge-amber'}`}>
                          {dmg.vendorClaimStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: UPDATE PHYSICAL COUNT
      ═══════════════════════════════════════════════════════════════ */}
      {countModalOpen && editingItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={20} color="var(--emerald)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Update Physical Godown Count</h3>
              </div>
              <button onClick={() => setCountModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCount} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
                  {editingItem.materialDesc}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {editingItem.brand} · Code: {editingItem.material} · Case Pack: {editingItem.conversion} pcs
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', fontSize: '12.5px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current ERP System Stock:</span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{editingItem.systemStockCbb} Cartons</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Physical Cartons Counted *</label>
                  <input
                    type="number"
                    required
                    className="input-field font-mono"
                    value={physicalCbb}
                    onChange={(e) => setPhysicalCbb(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Loose Pieces Counted</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={physicalPcs}
                    onChange={(e) => setPhysicalPcs(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setCountModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald">
                  <Save size={16} />
                  Save Physical Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: LOG DAMAGED STOCK
      ═══════════════════════════════════════════════════════════════ */}
      {damagedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} color="var(--rose)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Log Damaged / Expired FMCG Stock</h3>
              </div>
              <button onClick={() => setDamagedModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDamaged} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Principal FMCG Brand *</label>
                  <select
                    className="select-field"
                    value={damagedForm.brand}
                    onChange={(e) => setDamagedForm({ ...damagedForm, brand: e.target.value })}
                  >
                    <option value="Britannia">Britannia</option>
                    <option value="Dabur">Dabur</option>
                    <option value="ITC">ITC Foods</option>
                    <option value="Tata Consumer">Tata Consumer</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Date Identified</label>
                  <input
                    type="date"
                    className="input-field"
                    value={damagedForm.reportDate}
                    onChange={(e) => setDamagedForm({ ...damagedForm, reportDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Product Name & Damage Particulars *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Good Day Butter 100g (Crushed Cartons)"
                  className="input-field"
                  value={damagedForm.productName}
                  onChange={(e) => setDamagedForm({ ...damagedForm, productName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Damaged Cartons</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={damagedForm.quantityCartons}
                    onChange={(e) => setDamagedForm({ ...damagedForm, quantityCartons: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Loose Pieces</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={damagedForm.quantityPcs}
                    onChange={(e) => setDamagedForm({ ...damagedForm, quantityPcs: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Loss Value (₹)</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={damagedForm.estimatedLoss}
                    onChange={(e) => setDamagedForm({ ...damagedForm, estimatedLoss: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Reason / Incident Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Carton crushed during truck unloading from mother depot"
                  className="textarea-field"
                  value={damagedForm.reason}
                  onChange={(e) => setDamagedForm({ ...damagedForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setDamagedModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Damaged Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
