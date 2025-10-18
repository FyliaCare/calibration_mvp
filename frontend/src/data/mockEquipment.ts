// Mock Equipment Data (REMOVE FOR PRODUCTION)
// This file contains seed data for testing and development
// DELETE THIS FILE when deploying to production

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  assetNumber: string;
  category: 'electrical' | 'pressure' | 'temperature' | 'mechanical' | 'dimensional' | 'flow' | 'torque' | 'other';
  type: string;
  range: string;
  accuracy: string;
  resolution: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired' | 'calibration-due';
  calibrationInterval: number; // in months
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  purchaseDate: string;
  warrantyExpiry: string;
  cost: number;
  supplier: string;
  notes: string;
  clientId?: string;
  clientName?: string;
  calibrationHistory: {
    id: string;
    date: string;
    technician: string;
    result: 'pass' | 'fail';
    certificateNumber: string;
  }[];
}

export const mockEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    name: 'Digital Multimeter DMM-2500',
    manufacturer: 'Fluke',
    model: '287',
    serialNumber: 'DMM-2500-001',
    assetNumber: 'AST-DMM-001',
    category: 'electrical',
    type: 'Multimeter',
    range: '0-1000V DC/AC',
    accuracy: '±0.025%',
    resolution: '0.001V',
    location: 'Lab A - Shelf 3',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2024-10-15',
    nextCalibrationDate: '2025-10-15',
    purchaseDate: '2020-03-15',
    warrantyExpiry: '2023-03-15',
    cost: 1250.00,
    supplier: 'Fluke Corporation',
    notes: 'Primary multimeter for electrical calibration',
    clientName: 'ABC Manufacturing',
    calibrationHistory: [
      { id: 'CAL-001', date: '2024-10-15', technician: 'John Smith', result: 'pass', certificateNumber: 'CERT-2024-001' },
      { id: 'CAL-002', date: '2023-10-15', technician: 'Sarah Johnson', result: 'pass', certificateNumber: 'CERT-2023-045' },
      { id: 'CAL-003', date: '2022-10-15', technician: 'Mike Davis', result: 'pass', certificateNumber: 'CERT-2022-128' },
    ],
  },
  {
    id: 'EQ-002',
    name: 'Pressure Gauge PG-1000',
    manufacturer: 'Ashcroft',
    model: '1009',
    serialNumber: 'PG-1000-002',
    assetNumber: 'AST-PG-002',
    category: 'pressure',
    type: 'Pressure Gauge',
    range: '0-1000 PSI',
    accuracy: '±0.5%',
    resolution: '1 PSI',
    location: 'Lab B - Station 1',
    status: 'calibration-due',
    calibrationInterval: 6,
    lastCalibrationDate: '2025-04-10',
    nextCalibrationDate: '2025-10-10',
    purchaseDate: '2019-06-20',
    warrantyExpiry: '2022-06-20',
    cost: 850.00,
    supplier: 'Ashcroft Inc.',
    notes: 'High accuracy pressure standard',
    clientName: 'XYZ Industries',
    calibrationHistory: [
      { id: 'CAL-004', date: '2025-04-10', technician: 'Emily Chen', result: 'pass', certificateNumber: 'CERT-2025-012' },
      { id: 'CAL-005', date: '2024-10-10', technician: 'John Smith', result: 'pass', certificateNumber: 'CERT-2024-089' },
    ],
  },
  {
    id: 'EQ-003',
    name: 'Temperature Block Calibrator',
    manufacturer: 'Fluke',
    model: '9142',
    serialNumber: 'TB-550-003',
    assetNumber: 'AST-TB-003',
    category: 'temperature',
    type: 'Dry Block Calibrator',
    range: '-25°C to 660°C',
    accuracy: '±0.25°C',
    resolution: '0.01°C',
    location: 'Lab A - Station 2',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2025-01-20',
    nextCalibrationDate: '2026-01-20',
    purchaseDate: '2021-02-10',
    warrantyExpiry: '2024-02-10',
    cost: 3500.00,
    supplier: 'Fluke Corporation',
    notes: 'Primary temperature standard',
    clientName: 'Tech Corp',
    calibrationHistory: [
      { id: 'CAL-006', date: '2025-01-20', technician: 'Sarah Johnson', result: 'pass', certificateNumber: 'CERT-2025-003' },
      { id: 'CAL-007', date: '2024-01-20', technician: 'Mike Davis', result: 'pass', certificateNumber: 'CERT-2024-015' },
    ],
  },
  {
    id: 'EQ-004',
    name: 'Digital Caliper 0-6 inch',
    manufacturer: 'Mitutoyo',
    model: '500-196-30',
    serialNumber: 'DC-150-004',
    assetNumber: 'AST-DC-004',
    category: 'dimensional',
    type: 'Digital Caliper',
    range: '0-150mm (0-6 inch)',
    accuracy: '±0.02mm',
    resolution: '0.01mm',
    location: 'Lab C - Drawer 5',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2024-09-05',
    nextCalibrationDate: '2025-09-05',
    purchaseDate: '2020-08-12',
    warrantyExpiry: '2023-08-12',
    cost: 180.00,
    supplier: 'Mitutoyo America',
    notes: 'High precision digital caliper',
    calibrationHistory: [
      { id: 'CAL-008', date: '2024-09-05', technician: 'Emily Chen', result: 'pass', certificateNumber: 'CERT-2024-067' },
    ],
  },
  {
    id: 'EQ-005',
    name: 'Torque Wrench 0-100 ft-lb',
    manufacturer: 'Snap-on',
    model: 'TECH3FR100',
    serialNumber: 'TW-100-005',
    assetNumber: 'AST-TW-005',
    category: 'torque',
    type: 'Torque Wrench',
    range: '20-100 ft-lb',
    accuracy: '±3%',
    resolution: '0.1 ft-lb',
    location: 'Lab B - Cabinet 2',
    status: 'maintenance',
    calibrationInterval: 12,
    lastCalibrationDate: '2024-11-15',
    nextCalibrationDate: '2025-11-15',
    purchaseDate: '2019-11-20',
    warrantyExpiry: '2022-11-20',
    cost: 450.00,
    supplier: 'Snap-on Tools',
    notes: 'Currently in maintenance - handle repair',
    clientName: 'Global Systems',
    calibrationHistory: [
      { id: 'CAL-009', date: '2024-11-15', technician: 'John Smith', result: 'pass', certificateNumber: 'CERT-2024-102' },
    ],
  },
  {
    id: 'EQ-006',
    name: 'Flow Meter 1-10 GPM',
    manufacturer: 'Omega',
    model: 'FTB-9509',
    serialNumber: 'FM-350-006',
    assetNumber: 'AST-FM-006',
    category: 'flow',
    type: 'Turbine Flow Meter',
    range: '1-10 GPM',
    accuracy: '±1%',
    resolution: '0.01 GPM',
    location: 'Lab B - Station 3',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2025-03-10',
    nextCalibrationDate: '2026-03-10',
    purchaseDate: '2021-05-15',
    warrantyExpiry: '2024-05-15',
    cost: 720.00,
    supplier: 'Omega Engineering',
    notes: 'Water flow calibration standard',
    calibrationHistory: [
      { id: 'CAL-010', date: '2025-03-10', technician: 'Sarah Johnson', result: 'pass', certificateNumber: 'CERT-2025-025' },
    ],
  },
  {
    id: 'EQ-007',
    name: 'Micrometer 0-1 inch',
    manufacturer: 'Starrett',
    model: '436RL-1',
    serialNumber: 'MC-025-007',
    assetNumber: 'AST-MC-007',
    category: 'dimensional',
    type: 'Digital Micrometer',
    range: '0-25mm (0-1 inch)',
    accuracy: '±0.002mm',
    resolution: '0.001mm',
    location: 'Lab C - Drawer 3',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2024-12-01',
    nextCalibrationDate: '2025-12-01',
    purchaseDate: '2020-04-08',
    warrantyExpiry: '2023-04-08',
    cost: 220.00,
    supplier: 'Starrett Company',
    notes: 'Primary micrometer for precision measurements',
    calibrationHistory: [
      { id: 'CAL-011', date: '2024-12-01', technician: 'Emily Chen', result: 'pass', certificateNumber: 'CERT-2024-115' },
    ],
  },
  {
    id: 'EQ-008',
    name: 'Clamp Meter 0-1000A',
    manufacturer: 'Fluke',
    model: '376 FC',
    serialNumber: 'CM-1000-008',
    assetNumber: 'AST-CM-008',
    category: 'electrical',
    type: 'Clamp Meter',
    range: '0-1000A AC/DC',
    accuracy: '±1.5%',
    resolution: '0.1A',
    location: 'Lab A - Shelf 2',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2024-08-22',
    nextCalibrationDate: '2025-08-22',
    purchaseDate: '2021-07-14',
    warrantyExpiry: '2024-07-14',
    cost: 580.00,
    supplier: 'Fluke Corporation',
    notes: 'Wireless clamp meter with iFlex',
    clientName: 'ABC Manufacturing',
    calibrationHistory: [
      { id: 'CAL-012', date: '2024-08-22', technician: 'Mike Davis', result: 'pass', certificateNumber: 'CERT-2024-078' },
    ],
  },
  {
    id: 'EQ-009',
    name: 'Dead Weight Tester',
    manufacturer: 'Fluke',
    model: 'P3100',
    serialNumber: 'DW-500-009',
    assetNumber: 'AST-DW-009',
    category: 'pressure',
    type: 'Pressure Standard',
    range: '0-10,000 PSI',
    accuracy: '±0.015%',
    resolution: '0.001 PSI',
    location: 'Lab B - Bench 1',
    status: 'active',
    calibrationInterval: 24,
    lastCalibrationDate: '2024-06-15',
    nextCalibrationDate: '2026-06-15',
    purchaseDate: '2022-01-10',
    warrantyExpiry: '2025-01-10',
    cost: 8500.00,
    supplier: 'Fluke Corporation',
    notes: 'Primary pressure standard',
    calibrationHistory: [
      { id: 'CAL-013', date: '2024-06-15', technician: 'John Smith', result: 'pass', certificateNumber: 'CERT-2024-056' },
    ],
  },
  {
    id: 'EQ-010',
    name: 'Infrared Thermometer',
    manufacturer: 'Raytek',
    model: 'ST80',
    serialNumber: 'IR-600-010',
    assetNumber: 'AST-IR-010',
    category: 'temperature',
    type: 'IR Thermometer',
    range: '-30°C to 600°C',
    accuracy: '±1°C',
    resolution: '0.1°C',
    location: 'Lab A - Cabinet 1',
    status: 'retired',
    calibrationInterval: 12,
    lastCalibrationDate: '2023-05-10',
    nextCalibrationDate: '2024-05-10',
    purchaseDate: '2018-03-20',
    warrantyExpiry: '2021-03-20',
    cost: 320.00,
    supplier: 'Raytek Corporation',
    notes: 'Retired - replaced with newer model',
    calibrationHistory: [
      { id: 'CAL-014', date: '2023-05-10', technician: 'Sarah Johnson', result: 'pass', certificateNumber: 'CERT-2023-042' },
    ],
  },
  {
    id: 'EQ-011',
    name: 'Analytical Balance 0-220g',
    manufacturer: 'Mettler Toledo',
    model: 'MS204S',
    serialNumber: 'AB-220-011',
    assetNumber: 'AST-AB-011',
    category: 'mechanical',
    type: 'Analytical Balance',
    range: '0-220g',
    accuracy: '±0.1mg',
    resolution: '0.1mg',
    location: 'Lab C - Station 1',
    status: 'active',
    calibrationInterval: 6,
    lastCalibrationDate: '2025-09-01',
    nextCalibrationDate: '2026-03-01',
    purchaseDate: '2022-08-05',
    warrantyExpiry: '2025-08-05',
    cost: 2100.00,
    supplier: 'Mettler Toledo',
    notes: 'High precision balance for weight calibration',
    calibrationHistory: [
      { id: 'CAL-015', date: '2025-09-01', technician: 'Emily Chen', result: 'pass', certificateNumber: 'CERT-2025-082' },
      { id: 'CAL-016', date: '2025-03-01', technician: 'John Smith', result: 'pass', certificateNumber: 'CERT-2025-028' },
    ],
  },
  {
    id: 'EQ-012',
    name: 'Oscilloscope 100MHz',
    manufacturer: 'Tektronix',
    model: 'TBS2104',
    serialNumber: 'OSC-100-012',
    assetNumber: 'AST-OSC-012',
    category: 'electrical',
    type: 'Oscilloscope',
    range: '100MHz, 4 Channel',
    accuracy: '±2%',
    resolution: '1mV',
    location: 'Lab A - Bench 3',
    status: 'active',
    calibrationInterval: 12,
    lastCalibrationDate: '2025-02-14',
    nextCalibrationDate: '2026-02-14',
    purchaseDate: '2021-11-22',
    warrantyExpiry: '2024-11-22',
    cost: 1800.00,
    supplier: 'Tektronix Inc.',
    notes: 'Used for waveform analysis and calibration',
    calibrationHistory: [
      { id: 'CAL-017', date: '2025-02-14', technician: 'Mike Davis', result: 'pass', certificateNumber: 'CERT-2025-018' },
    ],
  },
];

// Helper function to filter equipment
export const filterEquipment = (
  equipment: Equipment[],
  filters: {
    search?: string;
    category?: string;
    status?: string;
    location?: string;
  }
): Equipment[] => {
  return equipment.filter((item) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.manufacturer.toLowerCase().includes(searchLower) ||
        item.model.toLowerCase().includes(searchLower) ||
        item.serialNumber.toLowerCase().includes(searchLower) ||
        item.assetNumber.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (item.category !== filters.category) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (item.status !== filters.status) return false;
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      if (!item.location.includes(filters.location)) return false;
    }

    return true;
  });
};

// Helper function to get equipment statistics
export const getEquipmentStats = (equipment: Equipment[]) => {
  return {
    total: equipment.length,
    active: equipment.filter(e => e.status === 'active').length,
    calibrationDue: equipment.filter(e => e.status === 'calibration-due').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    retired: equipment.filter(e => e.status === 'retired').length,
    byCategory: {
      electrical: equipment.filter(e => e.category === 'electrical').length,
      pressure: equipment.filter(e => e.category === 'pressure').length,
      temperature: equipment.filter(e => e.category === 'temperature').length,
      mechanical: equipment.filter(e => e.category === 'mechanical').length,
      dimensional: equipment.filter(e => e.category === 'dimensional').length,
      flow: equipment.filter(e => e.category === 'flow').length,
      torque: equipment.filter(e => e.category === 'torque').length,
      other: equipment.filter(e => e.category === 'other').length,
    },
  };
};
