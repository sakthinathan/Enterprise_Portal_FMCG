// FMCG Enterprise Suite - Central Data Store & Local Database Engine
// Integrates Fleet Operations, Payroll System, and FMCG Stock Management

const STORAGE_KEY = 'fmcg_enterprise_suite_data_v2';

const INITIAL_DATA = {
  activeAgencyId: 'sri-murugan',
  agencies: [
    {
      id: 'sri-murugan',
      name: 'Sri Murugan Agencies',
      tradeName: 'Authorized FMCG C&F & Super-Stockist',
      brands: ['ITC Foods', 'Britannia', 'Dabur India', 'Tata Consumer'],
      gstin: '33AAACS1234F1Z8',
      phone: '+91 98422 10293',
      email: 'operations@muruganfmcg.com',
      address: '14/2, Goods Shed Road, Tiruppur, TN 641601',
      hubLocation: 'Tiruppur & Coimbatore East',
      logoEmoji: '📦'
    },
    {
      id: 'annapoorna',
      name: 'Annapoorna Consumer Goods',
      tradeName: 'Direct Distributor & Logistics Hub',
      brands: ['Hindustan Unilever', 'Nestlé India', 'Mondelez Cadbury'],
      gstin: '33AACCA5678B1ZQ',
      phone: '+91 94433 88120',
      email: 'dispatch@annapoornagoods.in',
      address: '88, Perundurai Main Road, Erode, TN 638011',
      hubLocation: 'Erode & Salem South',
      logoEmoji: '🏢'
    }
  ],

  // ═════════════════════════════════════════════════════════════════════════
  // PAYROLL MODULE DATA (from sakthinathan/payroll-system)
  // ═════════════════════════════════════════════════════════════════════════
  payrollConfig: {
    workingDaysInMonth: 26,
    weeklyOffDay: 'Sunday',
    defaultOtRatePerHour: 120,
    currentPeriod: 'September 2026',
    pfPercentage: 12,
    esiPercentage: 0.75
  },
  employees: [
    {
      id: 'emp-01',
      agencyId: 'sri-murugan',
      name: 'Selvam K',
      role: 'Van Driver',
      department: 'Logistics',
      payType: 'Monthly',
      basicSalary: 18500,
      dailyWage: 711,
      hra: 3500,
      conveyance: 1500,
      incentives: 1200,
      phone: '9842100001',
      licenseNo: 'TN38 20120003421',
      licenseExpiry: '2028-06-15',
      bankName: 'Canara Bank',
      accountNo: '3029101004921',
      ifsc: 'CNRB0003029',
      status: 'Active',
      joinDate: '2021-04-10'
    },
    {
      id: 'emp-02',
      agencyId: 'sri-murugan',
      name: 'Marimuthu R',
      role: 'Truck Driver',
      department: 'Logistics',
      payType: 'Monthly',
      basicSalary: 17000,
      dailyWage: 653,
      hra: 3000,
      conveyance: 1500,
      incentives: 800,
      phone: '9842100002',
      licenseNo: 'TN37 20150009112',
      licenseExpiry: '2027-11-20',
      bankName: 'State Bank of India',
      accountNo: '20194827104',
      ifsc: 'SBIN0001244',
      status: 'Active',
      joinDate: '2022-08-15'
    },
    {
      id: 'emp-03',
      agencyId: 'sri-murugan',
      name: 'Vignesh P',
      role: 'Auto Van Pilot',
      department: 'Logistics',
      payType: 'Monthly',
      basicSalary: 16500,
      dailyWage: 634,
      hra: 2800,
      conveyance: 1200,
      incentives: 950,
      phone: '9842100003',
      licenseNo: 'TN38 20190004510',
      licenseExpiry: '2029-03-10',
      bankName: 'Indian Overseas Bank',
      accountNo: '08120100004821',
      ifsc: 'IOBA0000812',
      status: 'Active',
      joinDate: '2023-01-05'
    },
    {
      id: 'emp-04',
      agencyId: 'sri-murugan',
      name: 'Senthil Kumar',
      role: 'Heavy Logistic Driver',
      department: 'Inter-Godown',
      payType: 'Monthly',
      basicSalary: 22000,
      dailyWage: 846,
      hra: 4500,
      conveyance: 2000,
      incentives: 1500,
      phone: '9842100004',
      licenseNo: 'TN66 20080001923',
      licenseExpiry: '2027-02-14',
      bankName: 'HDFC Bank',
      accountNo: '50100294812301',
      ifsc: 'HDFC0000241',
      status: 'Active',
      joinDate: '2019-11-01'
    },
    {
      id: 'emp-05',
      agencyId: 'sri-murugan',
      name: 'Karthik V',
      role: 'Senior Sales Representative',
      department: 'Field Sales',
      payType: 'Monthly',
      basicSalary: 24000,
      dailyWage: 923,
      hra: 5000,
      conveyance: 3000,
      incentives: 4500,
      phone: '9842100005',
      licenseNo: 'TN38 20160007812',
      licenseExpiry: '2030-01-20',
      bankName: 'Axis Bank',
      accountNo: '91802004819234',
      ifsc: 'UTIB0000412',
      status: 'Active',
      joinDate: '2020-03-12'
    },
    {
      id: 'emp-06',
      agencyId: 'sri-murugan',
      name: 'Murugan S',
      role: 'Sales Order Booker',
      department: 'Field Sales',
      payType: 'Monthly',
      basicSalary: 19000,
      dailyWage: 730,
      hra: 3800,
      conveyance: 2500,
      incentives: 2800,
      phone: '9842100006',
      licenseNo: 'TN38 20200005511',
      licenseExpiry: '2032-08-11',
      bankName: 'Union Bank of India',
      accountNo: '48210201009182',
      ifsc: 'UBIN0548210',
      status: 'Active',
      joinDate: '2022-02-18'
    },
    {
      id: 'emp-07',
      agencyId: 'sri-murugan',
      name: 'Anbu Chezhiyan',
      role: 'Godown Supervisor',
      department: 'Warehouse',
      payType: 'Monthly',
      basicSalary: 21000,
      dailyWage: 807,
      hra: 4200,
      conveyance: 1500,
      incentives: 1000,
      phone: '9842100007',
      licenseNo: '',
      licenseExpiry: '',
      bankName: 'Canara Bank',
      accountNo: '3029101009941',
      ifsc: 'CNRB0003029',
      status: 'Active',
      joinDate: '2021-06-20'
    },
    {
      id: 'emp-08',
      agencyId: 'sri-murugan',
      name: 'Ramu M',
      role: 'Warehouse Loader',
      department: 'Warehouse',
      payType: 'Weekly',
      basicSalary: 14000,
      dailyWage: 538,
      hra: 1500,
      conveyance: 800,
      incentives: 600,
      phone: '9842100008',
      licenseNo: '',
      licenseExpiry: '',
      bankName: 'SBI',
      accountNo: '39281048192',
      ifsc: 'SBIN0001244',
      status: 'Active',
      joinDate: '2023-09-01'
    }
  ],

  monthlyPayrollEntries: [
    {
      id: 'pay-01',
      agencyId: 'sri-murugan',
      empId: 'emp-01',
      empName: 'Selvam K',
      role: 'Van Driver',
      period: 'September 2026',
      totalWorkingDays: 26,
      daysWorked: 26,
      daysAbsent: 0,
      otHours: 12,
      otPay: 1440,
      basicEarned: 18500,
      hraEarned: 3500,
      conveyanceEarned: 1500,
      incentivesEarned: 1200,
      grossPay: 26140,
      advancesDeduction: 2000,
      shortagesRecovery: 0,
      pfDeduction: 1800,
      esiDeduction: 196,
      totalDeductions: 3996,
      netPay: 22144,
      status: 'Approved',
      paidDate: '2026-10-02'
    },
    {
      id: 'pay-02',
      agencyId: 'sri-murugan',
      empId: 'emp-02',
      empName: 'Marimuthu R',
      role: 'Truck Driver',
      period: 'September 2026',
      totalWorkingDays: 26,
      daysWorked: 24,
      daysAbsent: 2,
      otHours: 8,
      otPay: 960,
      basicEarned: 15692,
      hraEarned: 2769,
      conveyanceEarned: 1385,
      incentivesEarned: 800,
      grossPay: 21606,
      advancesDeduction: 1500,
      shortagesRecovery: 350, // Goods damage shortage
      pfDeduction: 1600,
      esiDeduction: 162,
      totalDeductions: 3612,
      netPay: 17994,
      status: 'Approved',
      paidDate: '2026-10-02'
    },
    {
      id: 'pay-03',
      agencyId: 'sri-murugan',
      empId: 'emp-05',
      empName: 'Karthik V',
      role: 'Senior Sales Representative',
      period: 'September 2026',
      totalWorkingDays: 26,
      daysWorked: 26,
      daysAbsent: 0,
      otHours: 0,
      otPay: 0,
      basicEarned: 24000,
      hraEarned: 5000,
      conveyanceEarned: 3000,
      incentivesEarned: 4500,
      grossPay: 36500,
      advancesDeduction: 0,
      shortagesRecovery: 0,
      pfDeduction: 1800,
      esiDeduction: 0,
      totalDeductions: 1800,
      netPay: 34700,
      status: 'Approved',
      paidDate: '2026-10-02'
    },
    {
      id: 'pay-04',
      agencyId: 'sri-murugan',
      empId: 'emp-07',
      empName: 'Anbu Chezhiyan',
      role: 'Godown Supervisor',
      period: 'September 2026',
      totalWorkingDays: 26,
      daysWorked: 25,
      daysAbsent: 1,
      otHours: 10,
      otPay: 1200,
      basicEarned: 20192,
      hraEarned: 4038,
      conveyanceEarned: 1442,
      incentivesEarned: 1000,
      grossPay: 27872,
      advancesDeduction: 1000,
      shortagesRecovery: 0,
      pfDeduction: 1800,
      esiDeduction: 209,
      totalDeductions: 3009,
      netPay: 24863,
      status: 'Pending Approval',
      paidDate: ''
    }
  ],

  // ═════════════════════════════════════════════════════════════════════════
  // STOCK MANAGEMENT DATA (from sakthinathan/FMCG-Stock-Management)
  // ═════════════════════════════════════════════════════════════════════════
  fmcgBrands: [
    { id: 'brand-itc', name: 'ITC Foods & Personal Care', totalSkus: 52, godownA_Cartons: 420, godownB_Cartons: 190, valuation: 1485200 },
    { id: 'brand-brit', name: 'Britannia Industries Ltd', totalSkus: 44, godownA_Cartons: 380, godownB_Cartons: 140, valuation: 964000 },
    { id: 'brand-dabur', name: 'Dabur India Ltd', totalSkus: 38, godownA_Cartons: 210, godownB_Cartons: 85, valuation: 642000 },
    { id: 'brand-tata', name: 'Tata Consumer Products', totalSkus: 28, godownA_Cartons: 195, godownB_Cartons: 70, valuation: 754000 }
  ],

  stockItems: [
    {
      id: 'sku-01',
      brand: 'Britannia',
      material: '1004821',
      materialDesc: 'Britannia Good Day Butter 100g',
      mrp: 35,
      conversion: 72, // units per carton
      systemStockCbb: 14,
      systemStockPcs: 0,
      physicalStockCbb: 14,
      physicalStockPcs: 0,
      variance: 0,
      varianceValue: 0,
      status: 'Equal',
      godown: 'Godown #1 - Central'
    },
    {
      id: 'sku-02',
      brand: 'Britannia',
      material: '1004822',
      materialDesc: 'Britannia Marie Gold 250g',
      mrp: 40,
      conversion: 48,
      systemStockCbb: 85,
      systemStockPcs: 0,
      physicalStockCbb: 83,
      physicalStockPcs: 24,
      variance: -1.5,
      varianceValue: -2880,
      status: 'Shortage',
      godown: 'Godown #1 - Central'
    },
    {
      id: 'sku-03',
      brand: 'Dabur',
      material: '2001948',
      materialDesc: 'Dabur Red Toothpaste 150g',
      mrp: 110,
      conversion: 48,
      systemStockCbb: 8,
      systemStockPcs: 0,
      physicalStockCbb: 8,
      physicalStockPcs: 0,
      variance: 0,
      varianceValue: 0,
      status: 'Equal',
      godown: 'Godown #1 - Central'
    },
    {
      id: 'sku-04',
      brand: 'ITC',
      material: '3009182',
      materialDesc: 'Sunfeast Dark Fantasy Choco Fills 75g',
      mrp: 45,
      conversion: 60,
      systemStockCbb: 12,
      systemStockPcs: 0,
      physicalStockCbb: 12,
      physicalStockPcs: 10,
      variance: 0.17,
      varianceValue: 450,
      status: 'Excess',
      godown: 'Godown #1 - Central'
    },
    {
      id: 'sku-05',
      brand: 'Tata Consumer',
      material: '4001923',
      materialDesc: 'Tata Tea Premium 250g Pouch',
      mrp: 160,
      conversion: 36,
      systemStockCbb: 16,
      systemStockPcs: 0,
      physicalStockCbb: 15,
      physicalStockPcs: 0,
      variance: -1,
      varianceValue: -5760,
      status: 'Shortage',
      godown: 'Godown #2 - Station'
    },
    {
      id: 'sku-06',
      brand: 'ITC',
      material: '3001048',
      materialDesc: 'Aashirvaad Shudh Chakki Atta 10kg',
      mrp: 480,
      conversion: 2,
      systemStockCbb: 200,
      systemStockPcs: 0,
      physicalStockCbb: 200,
      physicalStockPcs: 0,
      variance: 0,
      varianceValue: 0,
      status: 'Equal',
      godown: 'Godown #1 - Central'
    },
    {
      id: 'sku-07',
      brand: 'Dabur',
      material: '2008819',
      materialDesc: 'Dabur Honey Squeezy 500g',
      mrp: 240,
      conversion: 24,
      systemStockCbb: 60,
      systemStockPcs: 0,
      physicalStockCbb: 60,
      physicalStockPcs: 0,
      variance: 0,
      varianceValue: 0,
      status: 'Equal',
      godown: 'Godown #2 - Station'
    },
    {
      id: 'sku-08',
      brand: 'ITC',
      material: '3007712',
      materialDesc: 'Yippee Magic Masala Noodles 70g (Pkt 4)',
      mrp: 60,
      conversion: 48,
      systemStockCbb: 135,
      systemStockPcs: 0,
      physicalStockCbb: 135,
      physicalStockPcs: 0,
      variance: 0,
      varianceValue: 0,
      status: 'Equal',
      godown: 'Godown #1 - Central'
    }
  ],

  stockAuditSessions: [
    {
      id: 'sess-01',
      sessionName: 'October Month-Begin Comprehensive Physical Audit',
      auditDate: '2026-10-01',
      auditor: 'Anbu Chezhiyan (Godown Incharge)',
      totalSkusAudited: 8,
      equalCount: 6,
      shortageCount: 2,
      excessCount: 1,
      netVarianceValue: -8190,
      status: 'Completed & Locked'
    }
  ],

  damagedAndExpiryGoods: [
    {
      id: 'dmg-01',
      reportDate: '2026-10-02',
      brand: 'Britannia',
      productName: 'Good Day Cashew 100g (Crushed in Transit)',
      quantityCartons: 1,
      quantityPcs: 18,
      estimatedLoss: 1650,
      reason: 'Transit carton crushing during mother depot unloading',
      vendorClaimStatus: 'Pending Depot Credit Note'
    },
    {
      id: 'dmg-02',
      reportDate: '2026-09-28',
      brand: 'Dabur',
      productName: 'Dabur Gulabari Rose Water 120ml (Cap Leakage)',
      quantityCartons: 0,
      quantityPcs: 8,
      estimatedLoss: 480,
      reason: 'Seal leakage in carton box',
      vendorClaimStatus: 'Credit Note Approved'
    }
  ],

  // ═════════════════════════════════════════════════════════════════════════
  // FLEET MODULE DATA
  // ═════════════════════════════════════════════════════════════════════════
  vehicles: [
    {
      id: 'veh-01',
      agencyId: 'sri-murugan',
      regNo: 'TN-38-BZ-4921',
      model: 'Tata Ace Gold HT Plus',
      type: 'Mini Truck',
      fuelType: 'Diesel',
      payloadKg: 1000,
      crateCapacity: 70,
      assignedRoute: 'Town Beat: Saibaba Colony & RS Puram (32 Outlets)',
      driverId: 'emp-01',
      driverName: 'Selvam K',
      currentOdo: 42850,
      status: 'Active',
      godown: 'Godown #1 - Central Tiruppur',
      insurance: {
        policyNo: 'UIIC/3302003124010009',
        insurer: 'United India Insurance',
        expiryDate: '2027-02-10',
        premium: 14200,
        coverageType: 'Comprehensive Commercial',
        docUrl: ''
      },
      fc: {
        certNo: 'FC/TN38/2025/881',
        rtoOffice: 'RTO Coimbatore North (TN-38)',
        expiryDate: '2026-10-25',
        docUrl: ''
      },
      puc: {
        certNo: 'PUC-2026-8812',
        expiryDate: '2027-01-15'
      },
      roadTax: {
        receiptNo: 'TAX-TN-9921',
        expiryDate: '2027-03-31'
      }
    },
    {
      id: 'veh-02',
      agencyId: 'sri-murugan',
      regNo: 'TN-37-CK-8812',
      model: 'Mahindra Bolero Maxi Truck Plus',
      type: 'Pickup Truck',
      fuelType: 'Diesel',
      payloadKg: 1400,
      crateCapacity: 95,
      assignedRoute: 'Highway Beat: Peelamedu - Singanallur Supermarkets',
      driverId: 'emp-02',
      driverName: 'Marimuthu R',
      currentOdo: 68120,
      status: 'Grounded - Insurance Due',
      godown: 'Godown #1 - Central Tiruppur',
      insurance: {
        policyNo: 'BA-25-1801-0004',
        insurer: 'Bajaj Allianz General',
        expiryDate: '2026-09-28', // Expired
        premium: 16800,
        coverageType: 'Third-Party + Goods Carrier',
        docUrl: ''
      },
      fc: {
        certNo: 'FC/TN37/2024/912',
        rtoOffice: 'RTO Coimbatore South (TN-37)',
        expiryDate: '2027-04-18',
        docUrl: ''
      },
      puc: {
        certNo: 'PUC-2026-1049',
        expiryDate: '2026-12-05'
      },
      roadTax: {
        receiptNo: 'TAX-TN-8810',
        expiryDate: '2026-12-31'
      }
    },
    {
      id: 'veh-03',
      agencyId: 'sri-murugan',
      regNo: 'TN-38-DW-1044',
      model: 'Piaggio Ape Auto DX High-Deck',
      type: '3-Wheeler Auto',
      fuelType: 'CNG',
      payloadKg: 550,
      crateCapacity: 40,
      assignedRoute: 'Old City Bazaar & Cross Cut Road (45 Kirana Stores)',
      driverId: 'emp-03',
      driverName: 'Vignesh P',
      currentOdo: 27400,
      status: 'Active',
      godown: 'Godown #2 - Station Bazaar',
      insurance: {
        policyNo: 'ICICI/2534/009182',
        insurer: 'ICICI Lombard',
        expiryDate: '2027-05-30',
        premium: 9800,
        coverageType: 'Comprehensive',
        docUrl: ''
      },
      fc: {
        certNo: 'FC/TN38/2025/110',
        rtoOffice: 'RTO Coimbatore North (TN-38)',
        expiryDate: '2027-05-30',
        docUrl: ''
      },
      puc: {
        certNo: 'PUC-2026-9011',
        expiryDate: '2026-10-11'
      },
      roadTax: {
        receiptNo: 'TAX-TN-3312',
        expiryDate: '2027-03-31'
      }
    },
    {
      id: 'veh-04',
      agencyId: 'sri-murugan',
      regNo: 'TN-66-AB-3390',
      model: 'Eicher Pro 2049 12-Foot Container',
      type: 'Heavy Truck',
      fuelType: 'Diesel',
      payloadKg: 3500,
      crateCapacity: 240,
      assignedRoute: 'Primary Logistics: Factory Depots to Hub Transfers',
      driverId: 'emp-04',
      driverName: 'Senthil Kumar',
      currentOdo: 94300,
      status: 'Active',
      godown: 'Godown #1 - Central Tiruppur',
      insurance: {
        policyNo: 'HDFC-CV-98214-2026',
        insurer: 'HDFC ERGO General',
        expiryDate: '2027-03-15',
        premium: 28500,
        coverageType: 'Commercial Goods Carrier Comprehensive',
        docUrl: ''
      },
      fc: {
        certNo: 'FC/TN66/2025/441',
        rtoOffice: 'RTO Kangeyam (TN-66)',
        expiryDate: '2027-02-28',
        docUrl: ''
      },
      puc: {
        certNo: 'PUC-2026-7782',
        expiryDate: '2027-03-10'
      },
      roadTax: {
        receiptNo: 'TAX-TN-6620',
        expiryDate: '2027-06-30'
      }
    },
    {
      id: 'veh-05',
      agencyId: 'sri-murugan',
      regNo: 'TN-38-EP-7721',
      model: 'Hero Super Splendor 125',
      type: 'Two-Wheeler',
      fuelType: 'Petrol',
      payloadKg: 60,
      crateCapacity: 2,
      assignedRoute: 'Vadavalli & Thondamuthur Rural Beat (Order Booking)',
      driverId: 'emp-05',
      driverName: 'Karthik V (Sales Rep)',
      currentOdo: 18200,
      status: 'Active',
      godown: 'Field Sales',
      insurance: {
        policyNo: 'NIA-TW-2026-99120',
        insurer: 'New India Assurance',
        expiryDate: '2027-08-12',
        premium: 1950,
        coverageType: 'Two Wheeler Package',
        docUrl: ''
      },
      fc: {
        certNo: 'Exempt (Private 2W)',
        rtoOffice: 'RTO Coimbatore North',
        expiryDate: '2036-05-10',
        docUrl: ''
      },
      puc: {
        certNo: 'PUC-2026-2210',
        expiryDate: '2027-04-10'
      },
      roadTax: {
        receiptNo: 'Life-Tax Paid',
        expiryDate: '2036-05-10'
      }
    }
  ],

  serviceLogs: [
    {
      id: 'srv-01',
      vehicleId: 'veh-01',
      vehicleReg: 'TN-38-BZ-4921',
      serviceDate: '2026-09-12',
      serviceType: 'Scheduled Maintenance',
      odometer: 40100,
      garageName: 'Karthikeya Commercial Motors (Tata Authorized)',
      workDescription: '40,000 km Major Service: Castrol 15W40 Engine Oil Replacement, Oil Filter, Fuel Filter, Brake Shoe Cleaning, Front Wheel Alignment.',
      partsCost: 3850,
      laborCost: 1200,
      totalCost: 5050,
      billNumber: 'INV-KM-9402',
      nextServiceKm: 50000,
      nextServiceDate: '2027-01-15'
    },
    {
      id: 'srv-02',
      vehicleId: 'veh-02',
      vehicleReg: 'TN-37-CK-8812',
      serviceDate: '2026-08-20',
      serviceType: 'Suspension & Brakes',
      odometer: 65400,
      garageName: 'Sri Amman Auto Works, Singanallur',
      workDescription: 'Rear leaf spring bush replacement, Front disc brake pads replacement, differential oil top-up.',
      partsCost: 5200,
      laborCost: 1800,
      totalCost: 7000,
      billNumber: 'INV-AMN-112',
      nextServiceKm: 75000,
      nextServiceDate: '2026-12-20'
    },
    {
      id: 'srv-03',
      vehicleId: 'veh-04',
      vehicleReg: 'TN-66-AB-3390',
      serviceDate: '2026-07-05',
      serviceType: 'Scheduled Inspection',
      odometer: 90000,
      garageName: 'Eicher Express Care, Kangeyam',
      workDescription: '90K km full container truck inspection, air filter change, clutch fluid flush, greasing propeller shaft.',
      partsCost: 7400,
      laborCost: 2600,
      totalCost: 10000,
      billNumber: 'EICHER-SRV-8821',
      nextServiceKm: 100000,
      nextServiceDate: '2026-11-05'
    }
  ],

  fuelLogs: [
    {
      id: 'fuel-01',
      vehicleId: 'veh-01',
      vehicleReg: 'TN-38-BZ-4921',
      logDate: '2026-10-02',
      driverName: 'Selvam K',
      startKm: 42720,
      endKm: 42850,
      totalKm: 130,
      fuelLiters: 9.8,
      fuelCost: 920,
      fuelStation: 'Indian Oil Dealer - Avinashi Road',
      kmpl: 13.26
    },
    {
      id: 'fuel-02',
      vehicleId: 'veh-03',
      vehicleReg: 'TN-38-DW-1044',
      logDate: '2026-10-02',
      driverName: 'Vignesh P',
      startKm: 27310,
      endKm: 27400,
      totalKm: 90,
      fuelLiters: 3.2,
      fuelCost: 285,
      fuelStation: 'Torrent Gas CNG - Brookefields',
      kmpl: 28.12
    }
  ],

  dispatchSheets: [
    {
      id: 'dsp-01',
      agencyId: 'sri-murugan',
      dispatchDate: '2026-10-03',
      vehicleReg: 'TN-38-BZ-4921',
      driverName: 'Selvam K',
      routeBeat: 'Saibaba Colony & RS Puram (Beat 1)',
      totalCartons: 64,
      plasticCratesIssued: 18,
      plasticCratesReturned: 0,
      retailerCount: 26,
      invoiceValue: 148500,
      status: 'On Delivery Beat'
    },
    {
      id: 'dsp-02',
      agencyId: 'sri-murugan',
      dispatchDate: '2026-10-03',
      vehicleReg: 'TN-38-DW-1044',
      driverName: 'Vignesh P',
      routeBeat: 'Old City Bazaar & Cross Cut (Beat 3)',
      totalCartons: 38,
      plasticCratesIssued: 12,
      plasticCratesReturned: 12,
      retailerCount: 35,
      invoiceValue: 92400,
      status: 'Completed & Settled'
    }
  ]
};

class FMCGDatabase {
  constructor() {
    this.init();
  }

  init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.save(INITIAL_DATA);
    }
  }

  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_DATA;
      return JSON.parse(raw);
    } catch {
      return INITIAL_DATA;
    }
  }

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  resetToDefault() {
    this.save(INITIAL_DATA);
    return INITIAL_DATA;
  }

  // Multi-Tenant Helpers
  getActiveAgency() {
    const data = this.get();
    return data.agencies.find(a => a.id === data.activeAgencyId) || data.agencies[0];
  }

  setActiveAgency(agencyId) {
    const data = this.get();
    data.activeAgencyId = agencyId;
    this.save(data);
    return this.getActiveAgency();
  }

  // Vehicles Helpers
  getVehicles(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.vehicles || []).filter(v => v.agencyId === targetAgency);
  }

  getVehicleById(id) {
    const data = this.get();
    return data.vehicles.find(v => v.id === id);
  }

  addVehicle(vehicle) {
    const data = this.get();
    const newVehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
      agencyId: vehicle.agencyId || data.activeAgencyId
    };
    data.vehicles.unshift(newVehicle);
    this.save(data);
    return newVehicle;
  }

  updateVehicle(id, updates) {
    const data = this.get();
    const index = data.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      data.vehicles[index] = { ...data.vehicles[index], ...updates };
      this.save(data);
      return data.vehicles[index];
    }
    return null;
  }

  deleteVehicle(id) {
    const data = this.get();
    data.vehicles = data.vehicles.filter(v => v.id !== id);
    this.save(data);
  }

  // Service Logs
  getServiceLogs(vehicleId = null) {
    const data = this.get();
    if (!vehicleId) return data.serviceLogs || [];
    return (data.serviceLogs || []).filter(s => s.vehicleId === vehicleId);
  }

  addServiceLog(log) {
    const data = this.get();
    const newLog = { ...log, id: `srv-${Date.now()}` };
    data.serviceLogs.unshift(newLog);
    if (log.vehicleId && log.odometer) {
      const v = data.vehicles.find(v => v.id === log.vehicleId);
      if (v && log.odometer > v.currentOdo) {
        v.currentOdo = log.odometer;
      }
    }
    this.save(data);
    return newLog;
  }

  // Fuel Logs
  getFuelLogs(vehicleId = null) {
    const data = this.get();
    if (!vehicleId) return data.fuelLogs || [];
    return (data.fuelLogs || []).filter(f => f.vehicleId === vehicleId);
  }

  addFuelLog(log) {
    const data = this.get();
    const newLog = { ...log, id: `fuel-${Date.now()}` };
    data.fuelLogs.unshift(newLog);
    if (log.vehicleId && log.endKm) {
      const v = data.vehicles.find(v => v.id === log.vehicleId);
      if (v && log.endKm > v.currentOdo) {
        v.currentOdo = log.endKm;
      }
    }
    this.save(data);
    return newLog;
  }

  // Dispatch Sheets
  getDispatchSheets(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.dispatchSheets || []).filter(d => d.agencyId === targetAgency);
  }

  addDispatchSheet(sheet) {
    const data = this.get();
    const newSheet = {
      ...sheet,
      id: `dsp-${Date.now()}`,
      agencyId: sheet.agencyId || data.activeAgencyId
    };
    data.dispatchSheets.unshift(newSheet);
    this.save(data);
    return newSheet;
  }

  // Employees & Payroll
  getEmployees(agencyId = null) {
    const data = this.get();
    const targetAgency = agencyId || data.activeAgencyId;
    return (data.employees || []).filter(e => e.agencyId === targetAgency);
  }

  addEmployee(emp) {
    const data = this.get();
    const newEmp = {
      ...emp,
      id: `emp-${Date.now()}`,
      agencyId: emp.agencyId || data.activeAgencyId
    };
    data.employees.unshift(newEmp);
    this.save(data);
    return newEmp;
  }

  updateEmployee(id, updates) {
    const data = this.get();
    const idx = data.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.employees[idx] = { ...data.employees[idx], ...updates };
      this.save(data);
      return data.employees[idx];
    }
    return null;
  }

  getMonthlyPayroll() {
    const data = this.get();
    return data.monthlyPayrollEntries || [];
  }

  addMonthlyPayroll(entry) {
    const data = this.get();
    const newEntry = { ...entry, id: `pay-${Date.now()}` };
    data.monthlyPayrollEntries.unshift(newEntry);
    this.save(data);
    return newEntry;
  }

  updatePayrollStatus(id, newStatus) {
    const data = this.get();
    const item = data.monthlyPayrollEntries.find(p => p.id === id);
    if (item) {
      item.status = newStatus;
      if (newStatus === 'Approved') item.paidDate = new Date().toISOString().split('T')[0];
      this.save(data);
      return item;
    }
    return null;
  }

  // Stock & Inventory
  getStockBrands() {
    const data = this.get();
    return data.fmcgBrands || [];
  }

  getStockItems() {
    const data = this.get();
    return data.stockItems || [];
  }

  updatePhysicalCount(skuId, physicalCbb, physicalPcs) {
    const data = this.get();
    const item = data.stockItems.find(s => s.id === skuId);
    if (item) {
      item.physicalStockCbb = Number(physicalCbb);
      item.physicalStockPcs = Number(physicalPcs);
      const totalPhysicalInCartons = Number(physicalCbb) + (Number(physicalPcs) / item.conversion);
      const totalSystemInCartons = item.systemStockCbb + (item.systemStockPcs / item.conversion);
      const variance = Number((totalPhysicalInCartons - totalSystemInCartons).toFixed(2));
      item.variance = variance;
      item.varianceValue = Math.round(variance * item.conversion * item.mrp);

      if (variance === 0) item.status = 'Equal';
      else if (variance < 0) item.status = 'Shortage';
      else item.status = 'Excess';

      this.save(data);
      return item;
    }
    return null;
  }

  getDamagedGoods() {
    const data = this.get();
    return data.damagedAndExpiryGoods || [];
  }

  addDamagedGoods(record) {
    const data = this.get();
    const newRecord = { ...record, id: `dmg-${Date.now()}` };
    data.damagedAndExpiryGoods.unshift(newRecord);
    this.save(data);
    return newRecord;
  }
}

export const fmcgDb = new FMCGDatabase();

// Date & Currency formatting
export function calculateDaysLeft(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatCurrencyINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function formatDatePretty(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}
