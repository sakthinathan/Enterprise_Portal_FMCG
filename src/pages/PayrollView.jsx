import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { fmcgDb, formatCurrencyINR, formatDatePretty } from '../lib/fmcgDb';
import { calculateMonthWorkingDays, getCalendarWeeksForMonth } from '../lib/payrollCalendar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import {
  Users,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Plus,
  FileDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  Search,
  Filter,
  X,
  Save,
  Check,
  Building2,
  FileText,
  Sliders,
  Printer,
  ChevronRight,
  TrendingUp,
  Percent,
  Wallet,
  ShieldAlert
} from 'lucide-react';

const EMPTY_EMPLOYEE = {
  name: '',
  role: 'Van Driver',
  department: 'Logistics',
  payType: 'Monthly',
  basicSalary: 18000,
  dailyWage: 692,
  hra: 3000,
  conveyance: 1500,
  incentives: 1000,
  phone: '',
  licenseNo: '',
  licenseExpiry: '',
  bankName: '',
  accountNo: '',
  ifsc: '',
  status: 'Active'
};

export default function PayrollView() {
  const { activeAgency, refreshData } = useTenant();

  // Tabs: 'dashboard' | 'employees' | 'monthly' | 'weekly' | 'ledger' | 'payslips' | 'approvals' | 'config'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Calendar Working Days State
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(8); // 8 = September
  const monthCalc = calculateMonthWorkingDays(selectedYear, selectedMonthIndex);
  const calendarWeeks = getCalendarWeeksForMonth(selectedYear, selectedMonthIndex);

  // Modals & Forms
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [empForm, setEmpForm] = useState(EMPTY_EMPLOYEE);

  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);

  // Live Data
  const employees = fmcgDb.getEmployees(activeAgency.id);
  const monthlyEntries = fmcgDb.getMonthlyPayroll();
  const dbData = fmcgDb.get();
  const [config, setConfig] = useState(dbData.payrollConfig || {
    workingDaysInMonth: 26,
    weeklyOffDay: 'Sunday',
    defaultOtRatePerHour: 120,
    currentPeriod: 'September 2026',
    pfPercentage: 12,
    esiPercentage: 0.75
  });

  // Totals calculations
  const totalStaff = employees.length;
  const driversCount = employees.filter(e => e.role.toLowerCase().includes('driver') || e.role.toLowerCase().includes('pilot')).length;
  const totalGrossSalaries = employees.reduce((acc, e) => acc + (Number(e.basicSalary) || 0) + (Number(e.hra) || 0) + (Number(e.conveyance) || 0), 0);
  const totalNetProcessed = monthlyEntries.reduce((acc, m) => acc + (Number(m.netPay) || 0), 0);
  const pendingApprovals = monthlyEntries.filter(m => m.status === 'Pending Approval');

  // Filtered employees
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery);
    const matchesRole = selectedRole === 'ALL' || e.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Open Add Employee Modal
  const openAddEmployee = () => {
    setEditingEmp(null);
    setEmpForm({ ...EMPTY_EMPLOYEE, agencyId: activeAgency.id });
    setEmpModalOpen(true);
  };

  // Open Edit Employee
  const openEditEmployee = (emp) => {
    setEditingEmp(emp);
    setEmpForm(JSON.parse(JSON.stringify(emp)));
    setEmpModalOpen(true);
  };

  // Save Employee
  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (editingEmp) {
      fmcgDb.updateEmployee(editingEmp.id, empForm);
    } else {
      fmcgDb.addEmployee(empForm);
      confetti({ particleCount: 50, spread: 60 });
    }
    setEmpModalOpen(false);
    refreshData();
  };

  // Approve Payroll Entry
  const handleApprovePayroll = (id) => {
    fmcgDb.updatePayrollStatus(id, 'Approved');
    confetti({ particleCount: 40, spread: 45 });
    refreshData();
  };

  // Save Configuration
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const current = fmcgDb.get();
    current.payrollConfig = config;
    fmcgDb.save(current);
    confetti({ particleCount: 30, spread: 40 });
    alert('Payroll Working Days & Settings updated successfully!');
  };

  // Generate & Download Payslip PDF
  const handleDownloadPayslipPDF = (entry) => {
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(activeAgency.name, 14, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Official Salary Payslip · Pay Period: ${entry.period || config.currentPeriod}`, 14, 24);
    doc.text(`GSTIN: ${activeAgency.gstin} · Hub: ${activeAgency.hubLocation}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 36);

    autoTable(doc, {
      startY: 48,
      head: [['Employee Particulars', 'Details']],
      body: [
        ['Employee Name', entry.empName],
        ['Designation / Role', entry.role],
        ['Working Days in Month', `${entry.totalWorkingDays || 26} Days`],
        ['Actual Days Worked', `${entry.daysWorked || 26} Days`],
        ['Overtime Hours Worked', `${entry.otHours || 0} Hours`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Earnings Head', 'Amount (INR)', 'Deductions Head', 'Amount (INR)']],
      body: [
        ['Basic Salary Earned', formatCurrencyINR(entry.basicEarned), 'Provident Fund (PF)', formatCurrencyINR(entry.pfDeduction)],
        ['House Rent Allowance (HRA)', formatCurrencyINR(entry.hraEarned), 'Employee State Ins (ESI)', formatCurrencyINR(entry.esiDeduction)],
        ['Conveyance Allowance', formatCurrencyINR(entry.conveyanceEarned), 'Staff Advance Recovery', formatCurrencyINR(entry.advancesDeduction)],
        ['Sales / Trip Incentives', formatCurrencyINR(entry.incentivesEarned), 'Shortages Recovery', formatCurrencyINR(entry.shortagesRecovery)],
        ['Overtime (OT) Pay', formatCurrencyINR(entry.otPay), 'Other Deductions', '0'],
        ['GROSS EARNINGS', formatCurrencyINR(entry.grossPay), 'TOTAL DEDUCTIONS', formatCurrencyINR(entry.totalDeductions)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`NET PAYABLE AMOUNT: ${formatCurrencyINR(entry.netPay)}`, 14, doc.lastAutoTable.finalY + 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Payment Status: PAID & TRANSFERRED via Bank NEFT / Direct UPI', 14, doc.lastAutoTable.finalY + 23);
    doc.text('Employer Signature: _______________________      Employee Signature: _______________________', 14, doc.lastAutoTable.finalY + 40);

    doc.save(`Payslip_${entry.empName.replace(/\s+/g, '_')}_${entry.period || 'Sept2026'}.pdf`);
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
            background: '#D97706',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #B45309'
          }}>
            <Users size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>
              HR, Staff & Payroll Operations Engine
            </h1>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Calendar Working Days Engine, Driver Master, Salary Processing, Advances Ledger & Payslips for <strong style={{ color: 'var(--text-main)' }}>{activeAgency.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={openAddEmployee} className="btn btn-primary btn-sm">
            <Plus size={16} />
            Add Staff / Driver
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
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
          { id: 'dashboard', label: 'Payroll Summary', icon: <LayoutDashboard size={16} /> },
          { id: 'employees', label: 'Staff Directory (Driver Master)', icon: <Users size={16} />, count: employees.length },
          { id: 'monthly', label: 'Monthly Salary Processing', icon: <DollarSign size={16} /> },
          { id: 'weekly', label: 'Weekly / Daily Payouts', icon: <Calendar size={16} /> },
          { id: 'ledger', label: 'Advances & Shortage Ledger', icon: <Wallet size={16} /> },
          { id: 'payslips', label: 'Payslip Generator & PDF', icon: <FileText size={16} /> },
          { id: 'approvals', label: 'Attendance Approvals', icon: <CheckCircle2 size={16} />, count: pendingApprovals.length },
          { id: 'config', label: 'Working Days Calendar', icon: <Sliders size={16} /> }
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
                color: isActive ? '#FDE68A' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #F59E0B' : '2px solid transparent',
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
                  background: isActive ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#FDE68A' : 'var(--text-dim)',
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
          TAB 1: PAYROLL DASHBOARD
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Staff Strength
                </span>
                <Users size={18} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {totalStaff} Employees
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '4px' }}>
                <span className="badge badge-cyan">{driversCount} Commercial Drivers</span>
                <span style={{ color: 'var(--text-muted)' }}>on active roster</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Monthly Gross Commitment
                </span>
                <DollarSign size={18} color="var(--emerald)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {formatCurrencyINR(totalGrossSalaries)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Basic + HRA + Conveyance + Allowances
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  September 2026 Disbursed
                </span>
                <CheckCircle2 size={18} color="var(--cyan)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {formatCurrencyINR(totalNetProcessed)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--emerald)', marginTop: '4px' }}>
                ✓ {monthlyEntries.length - pendingApprovals.length} Salaries Disbursed · {pendingApprovals.length} Pending
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Calendar Working Days Engine
                </span>
                <Calendar size={18} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {monthCalc.workingDays} Days
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {monthCalc.monthLabel}: {monthCalc.totalDays} Total Days ({monthCalc.sundaysCount} Sundays Excluded)
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Key FMCG Personnel & Delivery Pilots</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Active drivers and sales order bookers paired with FMCG fleet vehicles
                </p>
              </div>
              <button onClick={() => setActiveTab('employees')} className="btn btn-secondary btn-sm">
                View All {employees.length} Staff →
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Role & Dept</th>
                    <th>Pay Type</th>
                    <th>Basic + Allowances</th>
                    <th>Driving License (DL)</th>
                    <th>Bank & Account</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                          No Staff or Drivers on Roster Yet
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '14px' }}>
                          Register your delivery drivers, loaders, and salesmen to process daily wages and monthly salaries.
                        </div>
                        <button onClick={openAddEmployee} className="btn btn-primary btn-sm">
                          <Plus size={14} /> Add First Employee
                        </button>
                      </td>
                    </tr>
                  ) : employees.slice(0, 5).map(e => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-main)' }}>
                          {e.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          +91 {e.phone}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${e.role.toLowerCase().includes('driver') ? 'badge-cyan' : 'badge-neutral'}`} style={{ fontSize: '11px' }}>
                          {e.role}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{e.payType}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {formatCurrencyINR(e.basicSalary + e.hra + e.conveyance)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
                        {e.licenseNo ? (
                          <span style={{ color: 'var(--emerald)' }}>✓ {e.licenseNo}</span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>Not required</span>
                        )}
                      </td>
                      <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {e.bankName} ({e.accountNo?.slice(-4) ? `•••• ${e.accountNo.slice(-4)}` : '—'})
                      </td>
                      <td>
                        <span className="badge badge-emerald">Active</span>
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
          TAB 2: EMPLOYEES / DRIVER MASTER
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'employees' && (
        <div>
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
                placeholder="Search staff by name, role, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="select-field"
                style={{ width: 'auto', padding: '8px 14px' }}
              >
                <option value="ALL">All Roles</option>
                <option value="Van Driver">Van Driver</option>
                <option value="Truck Driver">Truck Driver</option>
                <option value="Auto Van Pilot">Auto Van Pilot</option>
                <option value="Heavy Logistic Driver">Heavy Logistic Driver</option>
                <option value="Senior Sales Representative">Senior Sales Representative</option>
                <option value="Sales Order Booker">Sales Order Booker</option>
                <option value="Godown Supervisor">Godown Supervisor</option>
                <option value="Warehouse Loader">Warehouse Loader</option>
              </select>

              <button onClick={openAddEmployee} className="btn btn-primary btn-sm">
                <Plus size={15} />
                New Employee
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Role & Dept</th>
                    <th>Basic Pay</th>
                    <th>HRA + Conveyance</th>
                    <th>Incentives</th>
                    <th>Commercial DL #</th>
                    <th>DL Expiry</th>
                    <th>Bank Particulars</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                          No Staff Members Registered
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '14px' }}>
                          Add employees to compute working days, calendar off-days, and salary disbursements.
                        </div>
                        <button onClick={openAddEmployee} className="btn btn-primary btn-sm">
                          <Plus size={14} /> Add Employee Record
                        </button>
                      </td>
                    </tr>
                  ) : filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-main)' }}>
                          {emp.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          +91 {emp.phone}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          {emp.role}
                        </span>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {emp.department} · {emp.payType}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {formatCurrencyINR(emp.basicSalary)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {formatCurrencyINR(emp.hra + emp.conveyance)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--emerald)' }}>
                        +{formatCurrencyINR(emp.incentives)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
                        {emp.licenseNo || <span style={{ color: 'var(--text-dim)' }}>—</span>}
                      </td>
                      <td>
                        {emp.licenseExpiry ? (
                          <span className="badge badge-emerald" style={{ fontSize: '10.5px' }}>
                            {formatDatePretty(emp.licenseExpiry)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-main)' }}>
                          {emp.bankName || 'Cash / UPI'}
                        </div>
                        <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                          {emp.accountNo || ''}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => openEditEmployee(emp)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Edit
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
          TAB 3: MONTHLY SALARY PROCESSING & ENTRY
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'monthly' && (
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
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Monthly Salary Calculation & Payout Register</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Processing calculations for period: <strong style={{ color: '#FDE68A' }}>{config.currentPeriod}</strong> ({monthCalc.workingDays} standard working days)
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Worked Days</th>
                    <th>OT Hours</th>
                    <th>Basic + Allowances</th>
                    <th>OT Pay</th>
                    <th>Gross Pay</th>
                    <th>Advances / Shortage</th>
                    <th>PF / ESI</th>
                    <th>Net Payout</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyEntries.map(entry => (
                    <tr key={entry.id}>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-main)' }}>
                          {entry.empName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {entry.role}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {entry.daysWorked} / {entry.totalWorkingDays}d
                        {entry.daysAbsent > 0 && (
                          <span style={{ fontSize: '10.5px', color: 'var(--rose)', marginLeft: '4px' }}>
                            ({entry.daysAbsent} absent)
                          </span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {entry.otHours} hrs
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {formatCurrencyINR(entry.basicEarned + entry.hraEarned + entry.conveyanceEarned)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--emerald)' }}>
                        +{formatCurrencyINR(entry.otPay)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {formatCurrencyINR(entry.grossPay)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--rose)' }}>
                        -{formatCurrencyINR(entry.advancesDeduction + entry.shortagesRecovery)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
                        -{formatCurrencyINR(entry.pfDeduction + entry.esiDeduction)}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)', fontSize: '13.5px' }}>
                          {formatCurrencyINR(entry.netPay)}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${entry.status === 'Approved' ? 'badge-emerald' : 'badge-amber'}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDownloadPayslipPDF(entry)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          <Printer size={12} />
                          Payslip
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
          TAB 4: WEEKLY / DAILY PAYOUTS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'weekly' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Weekly & Daily Wage Calculations</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Weekly periods processing for godown loaders, daily wage workers, and temporary helpers
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {calendarWeeks.map(w => (
                <div key={w.weekNum} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '13px' }}>{w.label}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {formatDatePretty(w.dateFrom)} to {formatDatePretty(w.dateTo)}
                  </div>
                  <span className="badge badge-emerald" style={{ marginTop: '8px' }}>Active Payout Window</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 5: ADVANCES & SHORTAGES LEDGER
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'ledger' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Advances & Van Shortages Recovery Ledger</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Track cash loans given to staff and delivery van shortages deducted during monthly payroll
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Advance Cash Loan</th>
                    <th>Transit / Shortage Recovery</th>
                    <th>Total Monthly Deductions</th>
                    <th>Ledger Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyEntries.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 800 }}>{e.empName} ({e.role})</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrencyINR(e.advancesDeduction)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--rose)' }}>{formatCurrencyINR(e.shortagesRecovery)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{formatCurrencyINR(e.advancesDeduction + e.shortagesRecovery)}</td>
                      <td>
                        <span className="badge badge-emerald">Deducted from {e.period} Salary</span>
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
          TAB 6: PAYSLIP VIEWER & PDF EXPORT
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'payslips' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
                Select Employee Salary Record ({config.currentPeriod})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {monthlyEntries.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedPayslipEmp(entry)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: selectedPayslipEmp?.id === entry.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.03)',
                      border: selectedPayslipEmp?.id === entry.id ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                        {entry.empName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {entry.role} · Worked {entry.daysWorked} days
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald)', fontSize: '13px' }}>
                        {formatCurrencyINR(entry.netPay)}
                      </div>
                      <span className={`badge ${entry.status === 'Approved' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '10px' }}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-medium)' }}>
              {selectedPayslipEmp ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{activeAgency.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GSTIN: {activeAgency.gstin} · {activeAgency.address}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#FDE68A', marginTop: '4px' }}>
                        SALARY PAYSLIP - {selectedPayslipEmp.period}
                      </div>
                    </div>
                    <button onClick={() => handleDownloadPayslipPDF(selectedPayslipEmp)} className="btn btn-primary btn-sm">
                      <FileDown size={14} />
                      Export PDF
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                    <div><strong>Name:</strong> {selectedPayslipEmp.empName}</div>
                    <div><strong>Designation:</strong> {selectedPayslipEmp.role}</div>
                    <div><strong>Days Worked:</strong> {selectedPayslipEmp.daysWorked} / {selectedPayslipEmp.totalWorkingDays}</div>
                    <div><strong>OT Hours:</strong> {selectedPayslipEmp.otHours} hrs</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', marginBottom: '18px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--emerald)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                        EARNINGS
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Basic:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.basicEarned)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>HRA:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.hraEarned)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Conveyance:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.conveyanceEarned)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Incentives:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.incentivesEarned)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>OT Pay:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.otPay)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', fontWeight: 700 }}>
                        <span>Gross:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.grossPay)}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--rose)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                        DEDUCTIONS
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>PF (12%):</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.pfDeduction)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>ESI (0.75%):</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.esiDeduction)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Advances:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.advancesDeduction)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Shortages:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.shortagesRecovery)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', fontWeight: 700 }}>
                        <span>Total Deductions:</span> <span className="font-mono">{formatCurrencyINR(selectedPayslipEmp.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--emerald-bg)',
                    border: '1px solid var(--emerald-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-main)' }}>NET PAYABLE:</span>
                    <strong style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrencyINR(selectedPayslipEmp.netPay)}
                    </strong>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                  <FileText size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p>Click any salary voucher on the left to preview the official payslip</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 7: ATTENDANCE APPROVALS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'approvals' && (
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
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Management Salary Approvals Queue</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Review attendance days and verify net salary before releasing bank transfer
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Days Worked</th>
                    <th>Gross Pay</th>
                    <th>Deductions</th>
                    <th>Net Payout</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Authorization</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyEntries.map(entry => (
                    <tr key={entry.id}>
                      <td style={{ fontWeight: 800, fontSize: '13.5px' }}>{entry.empName}</td>
                      <td>{entry.role}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{entry.daysWorked} / {entry.totalWorkingDays}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrencyINR(entry.grossPay)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--rose)' }}>-{formatCurrencyINR(entry.totalDeductions)}</td>
                      <td>
                        <strong style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrencyINR(entry.netPay)}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${entry.status === 'Approved' ? 'badge-emerald' : 'badge-amber'}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {entry.status === 'Pending Approval' ? (
                          <button
                            onClick={() => handleApprovePayroll(entry.id)}
                            className="btn btn-emerald btn-sm"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            <Check size={13} />
                            Approve & Disburse
                          </button>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--emerald)', fontWeight: 700 }}>
                            ✓ Approved
                          </span>
                        )}
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
          TAB 8: WORKING DAYS CALENDAR CONFIG
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'config' && (
        <div style={{ maxWidth: '780px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>
              Working Days Calendar & Payroll Engine Setup
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Calculates exact calendar days, Sundays count, and working days for salary calculation
            </p>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="input-group" style={{ width: '160px' }}>
                <label className="input-label">Select Month</label>
                <select
                  className="select-field"
                  value={selectedMonthIndex}
                  onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                >
                  {monthCalc.monthName && ['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, idx) => (
                    <option key={idx} value={idx}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ width: '120px' }}>
                <label className="input-label">Select Year</label>
                <input
                  type="number"
                  className="input-field font-mono"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                />
              </div>

              <div style={{ flex: 1, paddingLeft: '12px', borderLeft: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                <div><strong>Month Label:</strong> {monthCalc.monthLabel}</div>
                <div><strong>Total Days:</strong> {monthCalc.totalDays} Days | <strong>Sundays:</strong> {monthCalc.sundaysCount} Days</div>
                <div><strong>Standard Net Working Days:</strong> <strong style={{ color: 'var(--emerald)' }}>{monthCalc.workingDays} Working Days</strong></div>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="input-group">
                <label className="input-label">Standard Working Days Override</label>
                <input
                  type="number"
                  className="input-field font-mono"
                  value={config.workingDaysInMonth}
                  onChange={(e) => setConfig({ ...config, workingDaysInMonth: Number(e.target.value) })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Default Overtime (OT) Hourly Rate (₹)</label>
                <input
                  type="number"
                  className="input-field font-mono"
                  value={config.defaultOtRatePerHour}
                  onChange={(e) => setConfig({ ...config, defaultOtRatePerHour: Number(e.target.value) })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Provident Fund (PF %)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field font-mono"
                    value={config.pfPercentage}
                    onChange={(e) => setConfig({ ...config, pfPercentage: Number(e.target.value) })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">ESI (% Contribution)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field font-mono"
                    value={config.esiPercentage}
                    onChange={(e) => setConfig({ ...config, esiPercentage: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT EMPLOYEE
      ═══════════════════════════════════════════════════════════════ */}
      {empModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="#F59E0B" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>
                  {editingEmp ? 'Edit Staff / Driver Profile' : 'Add New Staff / Commercial Driver'}
                </h3>
              </div>
              <button onClick={() => setEmpModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Selvam K"
                    className="input-field"
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Role / Designation *</label>
                  <select
                    className="select-field"
                    value={empForm.role}
                    onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                  >
                    <option value="Van Driver">Van Driver</option>
                    <option value="Truck Driver">Truck Driver</option>
                    <option value="Auto Van Pilot">Auto Van Pilot</option>
                    <option value="Heavy Logistic Driver">Heavy Logistic Driver</option>
                    <option value="Senior Sales Representative">Senior Sales Representative</option>
                    <option value="Sales Order Booker">Sales Order Booker</option>
                    <option value="Godown Supervisor">Godown Supervisor</option>
                    <option value="Warehouse Loader">Warehouse Loader</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Department</label>
                  <input
                    type="text"
                    className="input-field"
                    value={empForm.department}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Pay Payout Type</label>
                  <select
                    className="select-field"
                    value={empForm.payType}
                    onChange={(e) => setEmpForm({ ...empForm, payType: e.target.value })}
                  >
                    <option value="Monthly">Monthly Salaried</option>
                    <option value="Weekly">Weekly / Daily Wage</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="9842100001"
                    className="input-field font-mono"
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                  SALARY STRUCTURE & ALLOWANCES (MONTHLY)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Basic Salary (₹)</label>
                    <input
                      type="number"
                      required
                      className="input-field font-mono"
                      value={empForm.basicSalary || ''}
                      onChange={(e) => setEmpForm({ ...empForm, basicSalary: Number(e.target.value) })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">HRA (₹)</label>
                    <input
                      type="number"
                      className="input-field font-mono"
                      value={empForm.hra || ''}
                      onChange={(e) => setEmpForm({ ...empForm, hra: Number(e.target.value) })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Conveyance (₹)</label>
                    <input
                      type="number"
                      className="input-field font-mono"
                      value={empForm.conveyance || ''}
                      onChange={(e) => setEmpForm({ ...empForm, conveyance: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Commercial Driving License (DL #)</label>
                  <input
                    type="text"
                    placeholder="e.g. TN38 20120003421"
                    className="input-field font-mono"
                    value={empForm.licenseNo}
                    onChange={(e) => setEmpForm({ ...empForm, licenseNo: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">DL Expiry Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={empForm.licenseExpiry || ''}
                    onChange={(e) => setEmpForm({ ...empForm, licenseExpiry: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Canara Bank"
                    className="input-field"
                    value={empForm.bankName}
                    onChange={(e) => setEmpForm({ ...empForm, bankName: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="input-field font-mono"
                    value={empForm.accountNo}
                    onChange={(e) => setEmpForm({ ...empForm, accountNo: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEmpModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {editingEmp ? 'Update Staff Member' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
