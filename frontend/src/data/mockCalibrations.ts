// Mock Calibration Data (REMOVE FOR PRODUCTION)
// This file contains seed data for testing and development
// DELETE THIS FILE when deploying to production

export interface CalibrationRecord {
  id: string;
  certificateNumber: string;
  equipmentId: string;
  equipmentName: string;
  equipmentSerialNumber: string;
  equipmentCategory: 'electrical' | 'pressure' | 'temperature' | 'mechanical' | 'dimensional' | 'flow' | 'torque' | 'other';
  clientId: string;
  clientName: string;
  calibrationDate: string;
  nextDueDate: string;
  technician: string;
  technicianId: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed' | 'cancelled';
  result: 'pass' | 'fail' | 'conditional' | 'pending';
  location: 'on-site' | 'in-lab';
  temperature: string;
  humidity: string;
  standard: string;
  standardSerialNumber: string;
  standardCertificate: string;
  standardExpiry: string;
  asFound: 'pass' | 'fail' | 'out-of-tolerance';
  asLeft: 'pass' | 'fail' | 'adjusted';
  procedure: string;
  notes: string;
  dataPoints: number;
  certificateIssued: boolean;
  certificateIssuedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  attachments?: string[];
}

export const mockCalibrations: CalibrationRecord[] = [
  {
    id: 'CAL-001',
    certificateNumber: 'CERT-2025-001',
    equipmentId: 'EQ-001',
    equipmentName: 'Digital Multimeter DMM-2500',
    equipmentSerialNumber: 'DMM-2500-001',
    equipmentCategory: 'electrical',
    clientId: 'CLT-001',
    clientName: 'ABC Manufacturing',
    calibrationDate: '2025-10-17',
    nextDueDate: '2026-10-17',
    technician: 'John Smith',
    technicianId: 'TECH-001',
    status: 'completed',
    result: 'pass',
    location: 'in-lab',
    temperature: '23°C ± 2°C',
    humidity: '50% ± 10%',
    standard: 'Fluke 8508A Multimeter',
    standardSerialNumber: 'STD-8508-012',
    standardCertificate: 'NIST-2025-4521',
    standardExpiry: '2026-08-15',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-ELEC-001 Rev. 3',
    notes: 'All readings within tolerance. No adjustments required.',
    dataPoints: 10,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-17',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2025-10-17',
    attachments: ['cert-2025-001.pdf', 'data-sheet-001.xlsx'],
  },
  {
    id: 'CAL-002',
    certificateNumber: 'CERT-2025-002',
    equipmentId: 'EQ-002',
    equipmentName: 'Pressure Gauge PG-1000',
    equipmentSerialNumber: 'PG-1000-002',
    equipmentCategory: 'pressure',
    clientId: 'CLT-002',
    clientName: 'XYZ Industries',
    calibrationDate: '2025-10-16',
    nextDueDate: '2026-04-16',
    technician: 'Sarah Johnson',
    technicianId: 'TECH-002',
    status: 'completed',
    result: 'pass',
    location: 'on-site',
    temperature: '22°C ± 2°C',
    humidity: '55% ± 10%',
    standard: 'Fluke 719 Pressure Calibrator',
    standardSerialNumber: 'STD-719-008',
    standardCertificate: 'NIST-2025-3312',
    standardExpiry: '2026-06-20',
    asFound: 'out-of-tolerance',
    asLeft: 'adjusted',
    procedure: 'CAL-PROC-PRES-002 Rev. 2',
    notes: 'Gauge found out of tolerance at 500 PSI. Adjusted and verified. Customer notified.',
    dataPoints: 11,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-16',
    approvedBy: 'John Smith',
    approvedDate: '2025-10-16',
    attachments: ['cert-2025-002.pdf'],
  },
  {
    id: 'CAL-003',
    certificateNumber: 'CERT-2025-003',
    equipmentId: 'EQ-003',
    equipmentName: 'Temperature Block Calibrator',
    equipmentSerialNumber: 'TB-550-003',
    equipmentCategory: 'temperature',
    clientId: 'CLT-003',
    clientName: 'Tech Corp',
    calibrationDate: '2025-10-15',
    nextDueDate: '2026-04-15',
    technician: 'Mike Davis',
    technicianId: 'TECH-003',
    status: 'completed',
    result: 'pass',
    location: 'in-lab',
    temperature: '23°C ± 2°C',
    humidity: '48% ± 10%',
    standard: 'Hart Scientific 1523 Reference Thermometer',
    standardSerialNumber: 'STD-1523-005',
    standardCertificate: 'NIST-2025-2145',
    standardExpiry: '2026-09-10',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-TEMP-003 Rev. 4',
    notes: 'Temperature stability excellent across all test points.',
    dataPoints: 8,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-15',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2025-10-15',
    attachments: ['cert-2025-003.pdf', 'stability-data-003.pdf'],
  },
  {
    id: 'CAL-004',
    certificateNumber: 'CERT-2025-004',
    equipmentId: 'EQ-004',
    equipmentName: 'Torque Wrench 0-100 ft-lb',
    equipmentSerialNumber: 'TW-100-004',
    equipmentCategory: 'torque',
    clientId: 'CLT-004',
    clientName: 'Global Systems',
    calibrationDate: '2025-10-14',
    nextDueDate: '2025-11-14',
    technician: 'Emily Chen',
    technicianId: 'TECH-004',
    status: 'completed',
    result: 'conditional',
    location: 'on-site',
    temperature: '21°C ± 2°C',
    humidity: '52% ± 10%',
    standard: 'Norbar Professional Torque Analyzer',
    standardSerialNumber: 'STD-NBA-015',
    standardCertificate: 'ISO-2025-7821',
    standardExpiry: '2026-05-25',
    asFound: 'out-of-tolerance',
    asLeft: 'adjusted',
    procedure: 'CAL-PROC-TORQ-001 Rev. 3',
    notes: 'Wrench found -3% out of tolerance at 80 ft-lb. Adjusted and verified. Recommend 1-month follow-up.',
    dataPoints: 10,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-14',
    approvedBy: 'John Smith',
    approvedDate: '2025-10-14',
    attachments: ['cert-2025-004.pdf', 'torque-data-004.xlsx'],
  },
  {
    id: 'CAL-005',
    certificateNumber: 'CERT-2025-005',
    equipmentId: 'EQ-005',
    equipmentName: 'Digital Caliper 0-6 inch',
    equipmentSerialNumber: 'DC-6-005',
    equipmentCategory: 'dimensional',
    clientId: 'CLT-005',
    clientName: 'Precision Instruments',
    calibrationDate: '2025-10-13',
    nextDueDate: '2026-10-13',
    technician: 'John Smith',
    technicianId: 'TECH-001',
    status: 'completed',
    result: 'pass',
    location: 'in-lab',
    temperature: '20°C ± 1°C',
    humidity: '50% ± 5%',
    standard: 'Mitutoyo Gage Block Set Grade 0',
    standardSerialNumber: 'STD-MIT-022',
    standardCertificate: 'NIST-2025-8934',
    standardExpiry: '2027-03-15',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-DIM-005 Rev. 2',
    notes: 'Dimensional accuracy verified at 6 measurement points. Zero function working correctly.',
    dataPoints: 6,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-13',
    approvedBy: 'Mike Davis',
    approvedDate: '2025-10-13',
    attachments: ['cert-2025-005.pdf'],
  },
  {
    id: 'CAL-006',
    certificateNumber: 'CERT-2025-006',
    equipmentId: 'EQ-006',
    equipmentName: 'Flow Meter 1-100 GPM',
    equipmentSerialNumber: 'FM-100-006',
    equipmentCategory: 'flow',
    clientId: 'CLT-001',
    clientName: 'ABC Manufacturing',
    calibrationDate: '2025-10-12',
    nextDueDate: '2026-04-12',
    technician: 'Sarah Johnson',
    technicianId: 'TECH-002',
    status: 'completed',
    result: 'pass',
    location: 'on-site',
    temperature: '23°C ± 2°C',
    humidity: '48% ± 10%',
    standard: 'Micro Motion Elite Coriolis Flow Meter',
    standardSerialNumber: 'STD-MM-019',
    standardCertificate: 'NIST-2025-5678',
    standardExpiry: '2026-07-30',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-FLOW-001 Rev. 3',
    notes: 'Flow accuracy within specification at all test points. Customer satisfied with results.',
    dataPoints: 10,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-12',
    approvedBy: 'Emily Chen',
    approvedDate: '2025-10-12',
    attachments: ['cert-2025-006.pdf', 'flow-curves-006.pdf'],
  },
  {
    id: 'CAL-007',
    certificateNumber: 'CERT-2025-007',
    equipmentId: 'EQ-007',
    equipmentName: 'Oscilloscope 200MHz',
    equipmentSerialNumber: 'OSC-200-007',
    equipmentCategory: 'electrical',
    clientId: 'CLT-002',
    clientName: 'XYZ Industries',
    calibrationDate: '2025-10-11',
    nextDueDate: '2026-10-11',
    technician: 'Mike Davis',
    technicianId: 'TECH-003',
    status: 'completed',
    result: 'pass',
    location: 'in-lab',
    temperature: '23°C ± 2°C',
    humidity: '50% ± 10%',
    standard: 'Tektronix 5080 Calibrator',
    standardSerialNumber: 'STD-TEK-031',
    standardCertificate: 'NIST-2025-1256',
    standardExpiry: '2026-04-18',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-ELEC-007 Rev. 5',
    notes: 'Amplitude, frequency, and timing accuracy verified. All channels calibrated.',
    dataPoints: 12,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-11',
    approvedBy: 'John Smith',
    approvedDate: '2025-10-11',
    attachments: ['cert-2025-007.pdf'],
  },
  {
    id: 'CAL-008',
    certificateNumber: 'CERT-2025-008',
    equipmentId: 'EQ-008',
    equipmentName: 'Clamp Meter 0-1000A',
    equipmentSerialNumber: 'CM-1000-008',
    equipmentCategory: 'electrical',
    clientId: 'CLT-001',
    clientName: 'ABC Manufacturing',
    calibrationDate: '2025-10-10',
    nextDueDate: '2026-04-10',
    technician: 'Emily Chen',
    technicianId: 'TECH-004',
    status: 'completed',
    result: 'pass',
    location: 'on-site',
    temperature: '24°C ± 2°C',
    humidity: '45% ± 10%',
    standard: 'Fluke 5520A Multi-Product Calibrator',
    standardSerialNumber: 'STD-5520-007',
    standardCertificate: 'NIST-2025-6789',
    standardExpiry: '2026-11-22',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-ELEC-002 Rev. 4',
    notes: 'Current measurement verified at 6 points. Jaw alignment checked and verified.',
    dataPoints: 6,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-10',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2025-10-10',
    attachments: ['cert-2025-008.pdf'],
  },
  {
    id: 'CAL-009',
    certificateNumber: 'CERT-2025-009',
    equipmentId: 'EQ-009',
    equipmentName: 'Humidity Transmitter 0-100% RH',
    equipmentSerialNumber: 'HT-100-009',
    equipmentCategory: 'other',
    clientId: 'CLT-003',
    clientName: 'Tech Corp',
    calibrationDate: '2025-10-09',
    nextDueDate: '2026-10-09',
    technician: 'John Smith',
    technicianId: 'TECH-001',
    status: 'completed',
    result: 'pass',
    location: 'in-lab',
    temperature: '23°C ± 1°C',
    humidity: 'Controlled environment',
    standard: 'Vaisala HMK15 Humidity Calibrator',
    standardSerialNumber: 'STD-VAI-011',
    standardCertificate: 'NIST-2025-3421',
    standardExpiry: '2026-08-05',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-HUM-001 Rev. 2',
    notes: 'Humidity readings verified at 10%, 50%, and 90% RH. Response time within specification.',
    dataPoints: 9,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-09',
    approvedBy: 'Mike Davis',
    approvedDate: '2025-10-09',
    attachments: ['cert-2025-009.pdf', 'humidity-data-009.xlsx'],
  },
  {
    id: 'CAL-010',
    certificateNumber: 'CERT-2025-010',
    equipmentId: 'EQ-010',
    equipmentName: 'Scale 0-500 lbs',
    equipmentSerialNumber: 'SC-500-010',
    equipmentCategory: 'mechanical',
    clientId: 'CLT-004',
    clientName: 'Global Systems',
    calibrationDate: '2025-10-08',
    nextDueDate: '2026-10-08',
    technician: 'Sarah Johnson',
    technicianId: 'TECH-002',
    status: 'completed',
    result: 'pass',
    location: 'on-site',
    temperature: '22°C ± 2°C',
    humidity: '55% ± 10%',
    standard: 'NIST Class F Weights Set',
    standardSerialNumber: 'STD-NIST-F-018',
    standardCertificate: 'NIST-2025-9012',
    standardExpiry: '2027-01-15',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-MASS-001 Rev. 3',
    notes: 'Linearity and repeatability verified across full range. Zero function tested.',
    dataPoints: 10,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-08',
    approvedBy: 'Emily Chen',
    approvedDate: '2025-10-08',
    attachments: ['cert-2025-010.pdf'],
  },
  {
    id: 'CAL-011',
    certificateNumber: 'CERT-2025-011',
    equipmentId: 'EQ-011',
    equipmentName: 'Pressure Transducer 0-500 PSI',
    equipmentSerialNumber: 'PT-500-011',
    equipmentCategory: 'pressure',
    clientId: 'CLT-005',
    clientName: 'Precision Instruments',
    calibrationDate: '2025-10-07',
    nextDueDate: '2026-04-07',
    technician: 'Mike Davis',
    technicianId: 'TECH-003',
    status: 'completed',
    result: 'pass',
    location: 'in-lab',
    temperature: '23°C ± 2°C',
    humidity: '50% ± 10%',
    standard: 'Paroscientific Digiquartz Pressure Standard',
    standardSerialNumber: 'STD-PARO-025',
    standardCertificate: 'NIST-2025-4567',
    standardExpiry: '2026-12-10',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-PRES-003 Rev. 2',
    notes: 'Transducer linearity excellent. Zero and span verified.',
    dataPoints: 11,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-07',
    approvedBy: 'John Smith',
    approvedDate: '2025-10-07',
    attachments: ['cert-2025-011.pdf'],
  },
  {
    id: 'CAL-012',
    certificateNumber: 'CERT-2025-012',
    equipmentId: 'EQ-012',
    equipmentName: 'RTD Temperature Sensor',
    equipmentSerialNumber: 'RTD-PT100-012',
    equipmentCategory: 'temperature',
    clientId: 'CLT-001',
    clientName: 'ABC Manufacturing',
    calibrationDate: '2025-10-06',
    nextDueDate: '2026-10-06',
    technician: 'Emily Chen',
    technicianId: 'TECH-004',
    status: 'completed',
    result: 'fail',
    location: 'in-lab',
    temperature: '23°C ± 2°C',
    humidity: '48% ± 10%',
    standard: 'Hart Scientific 1523 Reference Thermometer',
    standardSerialNumber: 'STD-1523-005',
    standardCertificate: 'NIST-2025-2145',
    standardExpiry: '2026-09-10',
    asFound: 'fail',
    asLeft: 'fail',
    procedure: 'CAL-PROC-TEMP-002 Rev. 3',
    notes: 'RTD failed at 100°C test point - reading 2.5°C high. Sensor likely damaged. Recommend replacement.',
    dataPoints: 8,
    certificateIssued: true,
    certificateIssuedDate: '2025-10-06',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2025-10-06',
    attachments: ['cert-2025-012.pdf', 'failure-report-012.pdf'],
  },
  {
    id: 'CAL-013',
    certificateNumber: 'PENDING',
    equipmentId: 'EQ-006',
    equipmentName: 'Flow Meter 1-100 GPM',
    equipmentSerialNumber: 'FM-100-006',
    equipmentCategory: 'flow',
    clientId: 'CLT-002',
    clientName: 'XYZ Industries',
    calibrationDate: '2025-10-18',
    nextDueDate: '2026-04-18',
    technician: 'John Smith',
    technicianId: 'TECH-001',
    status: 'in-progress',
    result: 'pending',
    location: 'on-site',
    temperature: '23°C ± 2°C',
    humidity: '50% ± 10%',
    standard: 'Micro Motion Elite Coriolis Flow Meter',
    standardSerialNumber: 'STD-MM-019',
    standardCertificate: 'NIST-2025-5678',
    standardExpiry: '2026-07-30',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-FLOW-001 Rev. 3',
    notes: 'Calibration in progress. Data collection 75% complete.',
    dataPoints: 8,
    certificateIssued: false,
  },
  {
    id: 'CAL-014',
    certificateNumber: 'PENDING',
    equipmentId: 'EQ-008',
    equipmentName: 'Clamp Meter 0-1000A',
    equipmentSerialNumber: 'CM-1000-008',
    equipmentCategory: 'electrical',
    clientId: 'CLT-003',
    clientName: 'Tech Corp',
    calibrationDate: '2025-10-19',
    nextDueDate: '2026-04-19',
    technician: 'Sarah Johnson',
    technicianId: 'TECH-002',
    status: 'pending',
    result: 'pending',
    location: 'in-lab',
    temperature: 'N/A',
    humidity: 'N/A',
    standard: 'Fluke 5520A Multi-Product Calibrator',
    standardSerialNumber: 'STD-5520-007',
    standardCertificate: 'NIST-2025-6789',
    standardExpiry: '2026-11-22',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-ELEC-002 Rev. 4',
    notes: 'Scheduled for calibration tomorrow. Equipment received and inspected.',
    dataPoints: 0,
    certificateIssued: false,
  },
  {
    id: 'CAL-015',
    certificateNumber: 'PENDING',
    equipmentId: 'EQ-004',
    equipmentName: 'Torque Wrench 0-100 ft-lb',
    equipmentSerialNumber: 'TW-100-004',
    equipmentCategory: 'torque',
    clientId: 'CLT-004',
    clientName: 'Global Systems',
    calibrationDate: '2025-10-20',
    nextDueDate: '2025-11-20',
    technician: 'Mike Davis',
    technicianId: 'TECH-003',
    status: 'pending',
    result: 'pending',
    location: 'on-site',
    temperature: 'N/A',
    humidity: 'N/A',
    standard: 'Norbar Professional Torque Analyzer',
    standardSerialNumber: 'STD-NBA-015',
    standardCertificate: 'ISO-2025-7821',
    standardExpiry: '2026-05-25',
    asFound: 'pass',
    asLeft: 'pass',
    procedure: 'CAL-PROC-TORQ-001 Rev. 3',
    notes: 'Follow-up calibration after previous conditional pass. Scheduled for on-site visit.',
    dataPoints: 0,
    certificateIssued: false,
  },
];

// Helper function to filter calibrations
export const filterCalibrations = (
  searchTerm: string = '',
  status?: CalibrationRecord['status'],
  result?: CalibrationRecord['result'],
  category?: CalibrationRecord['equipmentCategory'],
  clientId?: string,
  equipmentId?: string,
  startDate?: string,
  endDate?: string
): CalibrationRecord[] => {
  return mockCalibrations.filter((cal) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      cal.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cal.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cal.equipmentSerialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cal.technician.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = !status || cal.status === status;

    // Result filter
    const matchesResult = !result || cal.result === result;

    // Category filter
    const matchesCategory = !category || cal.equipmentCategory === category;

    // Client filter
    const matchesClient = !clientId || cal.clientId === clientId;

    // Equipment filter
    const matchesEquipment = !equipmentId || cal.equipmentId === equipmentId;

    // Date range filter
    const matchesDateRange =
      (!startDate || cal.calibrationDate >= startDate) &&
      (!endDate || cal.calibrationDate <= endDate);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesResult &&
      matchesCategory &&
      matchesClient &&
      matchesEquipment &&
      matchesDateRange
    );
  });
};

// Helper function to get calibration statistics
export const getCalibrationStats = () => {
  const total = mockCalibrations.length;
  const completed = mockCalibrations.filter((c) => c.status === 'completed').length;
  const inProgress = mockCalibrations.filter((c) => c.status === 'in-progress').length;
  const pending = mockCalibrations.filter((c) => c.status === 'pending').length;
  const failed = mockCalibrations.filter((c) => c.result === 'fail').length;
  const passed = mockCalibrations.filter((c) => c.result === 'pass').length;
  const conditional = mockCalibrations.filter((c) => c.result === 'conditional').length;
  const certificatesIssued = mockCalibrations.filter((c) => c.certificateIssued).length;
  const thisMonth = mockCalibrations.filter((c) => 
    c.calibrationDate >= '2025-10-01' && c.calibrationDate <= '2025-10-31'
  ).length;
  const thisWeek = mockCalibrations.filter((c) => 
    c.calibrationDate >= '2025-10-13' && c.calibrationDate <= '2025-10-19'
  ).length;

  // By category
  const byCategory = {
    electrical: mockCalibrations.filter((c) => c.equipmentCategory === 'electrical').length,
    pressure: mockCalibrations.filter((c) => c.equipmentCategory === 'pressure').length,
    temperature: mockCalibrations.filter((c) => c.equipmentCategory === 'temperature').length,
    mechanical: mockCalibrations.filter((c) => c.equipmentCategory === 'mechanical').length,
    dimensional: mockCalibrations.filter((c) => c.equipmentCategory === 'dimensional').length,
    flow: mockCalibrations.filter((c) => c.equipmentCategory === 'flow').length,
    torque: mockCalibrations.filter((c) => c.equipmentCategory === 'torque').length,
    other: mockCalibrations.filter((c) => c.equipmentCategory === 'other').length,
  };

  // By location
  const byLocation = {
    'in-lab': mockCalibrations.filter((c) => c.location === 'in-lab').length,
    'on-site': mockCalibrations.filter((c) => c.location === 'on-site').length,
  };

  return {
    total,
    completed,
    inProgress,
    pending,
    failed,
    passed,
    conditional,
    certificatesIssued,
    thisMonth,
    thisWeek,
    byCategory,
    byLocation,
  };
};
