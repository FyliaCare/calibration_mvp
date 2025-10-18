// Mock Client Data (REMOVE FOR PRODUCTION)
// This file contains seed data for testing and development
// DELETE THIS FILE when deploying to production

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  accountType: 'standard' | 'premium' | 'enterprise';
  registrationDate: string;
  lastServiceDate: string;
  totalJobs: number;
  activeJobs: number;
  totalRevenue: number;
  website?: string;
  notes: string;
  billingEmail?: string;
  taxId?: string;
  paymentTerms: string;
  equipment: {
    id: string;
    name: string;
    serialNumber: string;
    category: string;
    nextCalibrationDate: string;
  }[];
  contacts: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
  recentActivity: {
    id: string;
    date: string;
    type: 'job' | 'calibration' | 'invoice' | 'contact';
    description: string;
  }[];
}

export const mockClients: Client[] = [
  {
    id: 'CLI-001',
    companyName: 'ABC Manufacturing Inc.',
    contactPerson: 'John Anderson',
    email: 'john.anderson@abcmanufacturing.com',
    phone: '+1 (555) 123-4567',
    alternatePhone: '+1 (555) 123-4568',
    address: '1234 Industrial Parkway',
    city: 'Detroit',
    state: 'MI',
    zipCode: '48201',
    country: 'USA',
    industry: 'Manufacturing',
    status: 'active',
    accountType: 'enterprise',
    registrationDate: '2020-01-15',
    lastServiceDate: '2025-10-15',
    totalJobs: 156,
    activeJobs: 8,
    totalRevenue: 125000.00,
    website: 'https://abcmanufacturing.com',
    billingEmail: 'accounting@abcmanufacturing.com',
    taxId: 'EIN-12-3456789',
    paymentTerms: 'Net 30',
    notes: 'Premium client - priority service. Monthly calibration schedule.',
    equipment: [
      { id: 'EQ-001', name: 'Digital Multimeter DMM-2500', serialNumber: 'DMM-2500-001', category: 'Electrical', nextCalibrationDate: '2025-10-15' },
      { id: 'EQ-008', name: 'Clamp Meter 0-1000A', serialNumber: 'CM-1000-008', category: 'Electrical', nextCalibrationDate: '2025-08-22' },
    ],
    contacts: [
      { id: 'CNT-001', name: 'John Anderson', role: 'Engineering Manager', email: 'john.anderson@abcmanufacturing.com', phone: '+1 (555) 123-4567', isPrimary: true },
      { id: 'CNT-002', name: 'Sarah Mitchell', role: 'Quality Supervisor', email: 'sarah.mitchell@abcmanufacturing.com', phone: '+1 (555) 123-4569', isPrimary: false },
      { id: 'CNT-003', name: 'Robert Chen', role: 'Maintenance Lead', email: 'robert.chen@abcmanufacturing.com', phone: '+1 (555) 123-4570', isPrimary: false },
    ],
    recentActivity: [
      { id: 'ACT-001', date: '2025-10-15', type: 'calibration', description: 'Completed calibration for Digital Multimeter DMM-2500' },
      { id: 'ACT-002', date: '2025-10-10', type: 'job', description: 'Scheduled monthly calibration service' },
      { id: 'ACT-003', date: '2025-10-05', type: 'invoice', description: 'Invoice #INV-2025-089 paid - $3,250' },
    ],
  },
  {
    id: 'CLI-002',
    companyName: 'XYZ Industries Ltd.',
    contactPerson: 'Michael Roberts',
    email: 'michael.roberts@xyzindustries.com',
    phone: '+1 (555) 234-5678',
    address: '5678 Technology Drive',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95110',
    country: 'USA',
    industry: 'Technology',
    status: 'active',
    accountType: 'premium',
    registrationDate: '2019-06-20',
    lastServiceDate: '2025-09-28',
    totalJobs: 98,
    activeJobs: 5,
    totalRevenue: 78000.00,
    website: 'https://xyzindustries.com',
    billingEmail: 'billing@xyzindustries.com',
    taxId: 'EIN-98-7654321',
    paymentTerms: 'Net 15',
    notes: 'Fast turnaround required. Prefers on-site calibration.',
    equipment: [
      { id: 'EQ-002', name: 'Pressure Gauge PG-1000', serialNumber: 'PG-1000-002', category: 'Pressure', nextCalibrationDate: '2025-10-10' },
    ],
    contacts: [
      { id: 'CNT-004', name: 'Michael Roberts', role: 'Operations Director', email: 'michael.roberts@xyzindustries.com', phone: '+1 (555) 234-5678', isPrimary: true },
      { id: 'CNT-005', name: 'Emily Wong', role: 'Lab Manager', email: 'emily.wong@xyzindustries.com', phone: '+1 (555) 234-5679', isPrimary: false },
    ],
    recentActivity: [
      { id: 'ACT-004', date: '2025-09-28', type: 'calibration', description: 'On-site calibration completed for Pressure Gauge' },
      { id: 'ACT-005', date: '2025-09-20', type: 'contact', description: 'Updated primary contact information' },
    ],
  },
  {
    id: 'CLI-003',
    companyName: 'Tech Corp Solutions',
    contactPerson: 'Lisa Martinez',
    email: 'lisa.martinez@techcorp.com',
    phone: '+1 (555) 345-6789',
    address: '9012 Innovation Boulevard',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'USA',
    industry: 'Electronics',
    status: 'active',
    accountType: 'standard',
    registrationDate: '2021-02-10',
    lastServiceDate: '2025-10-12',
    totalJobs: 45,
    activeJobs: 3,
    totalRevenue: 32000.00,
    website: 'https://techcorp.com',
    taxId: 'EIN-45-6789012',
    paymentTerms: 'Net 30',
    notes: 'Growing account with potential for premium upgrade.',
    equipment: [
      { id: 'EQ-003', name: 'Temperature Block Calibrator', serialNumber: 'TB-550-003', category: 'Temperature', nextCalibrationDate: '2026-01-20' },
    ],
    contacts: [
      { id: 'CNT-006', name: 'Lisa Martinez', role: 'QA Manager', email: 'lisa.martinez@techcorp.com', phone: '+1 (555) 345-6789', isPrimary: true },
    ],
    recentActivity: [
      { id: 'ACT-006', date: '2025-10-12', type: 'calibration', description: 'Temperature calibration completed' },
      { id: 'ACT-007', date: '2025-10-01', type: 'invoice', description: 'Invoice #INV-2025-095 sent - $1,850' },
    ],
  },
  {
    id: 'CLI-004',
    companyName: 'Global Systems International',
    contactPerson: 'David Thompson',
    email: 'david.thompson@globalsystems.com',
    phone: '+1 (555) 456-7890',
    alternatePhone: '+1 (555) 456-7891',
    address: '3456 Corporate Center',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    industry: 'Aerospace',
    status: 'active',
    accountType: 'enterprise',
    registrationDate: '2018-11-05',
    lastServiceDate: '2025-10-08',
    totalJobs: 234,
    activeJobs: 12,
    totalRevenue: 215000.00,
    website: 'https://globalsystems.com',
    billingEmail: 'finance@globalsystems.com',
    taxId: 'EIN-78-9012345',
    paymentTerms: 'Net 45',
    notes: 'Largest client - VIP treatment. ISO 17025 certification required.',
    equipment: [
      { id: 'EQ-005', name: 'Torque Wrench 0-100 ft-lb', serialNumber: 'TW-100-005', category: 'Torque', nextCalibrationDate: '2025-11-15' },
    ],
    contacts: [
      { id: 'CNT-007', name: 'David Thompson', role: 'VP of Operations', email: 'david.thompson@globalsystems.com', phone: '+1 (555) 456-7890', isPrimary: true },
      { id: 'CNT-008', name: 'Jennifer Lee', role: 'Quality Director', email: 'jennifer.lee@globalsystems.com', phone: '+1 (555) 456-7892', isPrimary: false },
      { id: 'CNT-009', name: 'Mark Stevens', role: 'Procurement Manager', email: 'mark.stevens@globalsystems.com', phone: '+1 (555) 456-7893', isPrimary: false },
    ],
    recentActivity: [
      { id: 'ACT-008', date: '2025-10-08', type: 'job', description: 'Scheduled Q4 calibration batch - 15 items' },
      { id: 'ACT-009', date: '2025-09-30', type: 'invoice', description: 'Invoice #INV-2025-087 paid - $12,500' },
      { id: 'ACT-010', date: '2025-09-25', type: 'calibration', description: 'Completed batch calibration service' },
    ],
  },
  {
    id: 'CLI-005',
    companyName: 'Precision Instruments Co.',
    contactPerson: 'Amanda Foster',
    email: 'amanda.foster@precisioninst.com',
    phone: '+1 (555) 567-8901',
    address: '7890 Precision Way',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    country: 'USA',
    industry: 'Medical Devices',
    status: 'active',
    accountType: 'premium',
    registrationDate: '2020-08-12',
    lastServiceDate: '2025-09-15',
    totalJobs: 72,
    activeJobs: 4,
    totalRevenue: 56000.00,
    website: 'https://precisioninstruments.com',
    billingEmail: 'accounts@precisioninst.com',
    taxId: 'EIN-23-4567890',
    paymentTerms: 'Net 30',
    notes: 'Medical device calibration - FDA compliance required.',
    equipment: [],
    contacts: [
      { id: 'CNT-010', name: 'Amanda Foster', role: 'Compliance Officer', email: 'amanda.foster@precisioninst.com', phone: '+1 (555) 567-8901', isPrimary: true },
      { id: 'CNT-011', name: 'Brian Parker', role: 'Lab Technician', email: 'brian.parker@precisioninst.com', phone: '+1 (555) 567-8902', isPrimary: false },
    ],
    recentActivity: [
      { id: 'ACT-011', date: '2025-09-15', type: 'calibration', description: 'FDA compliance calibration completed' },
    ],
  },
  {
    id: 'CLI-006',
    companyName: 'Metro Engineering Group',
    contactPerson: 'Kevin Walsh',
    email: 'kevin.walsh@metroeng.com',
    phone: '+1 (555) 678-9012',
    address: '2345 Metro Plaza',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
    industry: 'Construction',
    status: 'pending',
    accountType: 'standard',
    registrationDate: '2025-09-01',
    lastServiceDate: '2025-09-10',
    totalJobs: 2,
    activeJobs: 1,
    totalRevenue: 1200.00,
    website: 'https://metroeng.com',
    paymentTerms: 'Net 15',
    notes: 'New client - trial period. First calibration completed.',
    equipment: [],
    contacts: [
      { id: 'CNT-012', name: 'Kevin Walsh', role: 'Project Manager', email: 'kevin.walsh@metroeng.com', phone: '+1 (555) 678-9012', isPrimary: true },
    ],
    recentActivity: [
      { id: 'ACT-012', date: '2025-09-10', type: 'calibration', description: 'First calibration service completed' },
      { id: 'ACT-013', date: '2025-09-01', type: 'contact', description: 'Account registration completed' },
    ],
  },
  {
    id: 'CLI-007',
    companyName: 'Advanced Materials Lab',
    contactPerson: 'Dr. Patricia Kim',
    email: 'patricia.kim@advancedmaterials.com',
    phone: '+1 (555) 789-0123',
    address: '4567 Research Park',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92101',
    country: 'USA',
    industry: 'Research & Development',
    status: 'active',
    accountType: 'premium',
    registrationDate: '2019-03-20',
    lastServiceDate: '2025-10-14',
    totalJobs: 118,
    activeJobs: 6,
    totalRevenue: 92000.00,
    website: 'https://advancedmaterials.com',
    billingEmail: 'finance@advancedmaterials.com',
    taxId: 'EIN-67-8901234',
    paymentTerms: 'Net 30',
    notes: 'University research lab - special academic pricing.',
    equipment: [],
    contacts: [
      { id: 'CNT-013', name: 'Dr. Patricia Kim', role: 'Lab Director', email: 'patricia.kim@advancedmaterials.com', phone: '+1 (555) 789-0123', isPrimary: true },
      { id: 'CNT-014', name: 'Tom Bradley', role: 'Research Associate', email: 'tom.bradley@advancedmaterials.com', phone: '+1 (555) 789-0124', isPrimary: false },
    ],
    recentActivity: [
      { id: 'ACT-014', date: '2025-10-14', type: 'calibration', description: 'Research equipment calibration completed' },
    ],
  },
  {
    id: 'CLI-008',
    companyName: 'Industrial Automation Inc.',
    contactPerson: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@indauto.com',
    phone: '+1 (555) 890-1234',
    address: '8901 Automation Drive',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    country: 'USA',
    industry: 'Automation',
    status: 'inactive',
    accountType: 'standard',
    registrationDate: '2017-05-15',
    lastServiceDate: '2024-03-20',
    totalJobs: 38,
    activeJobs: 0,
    totalRevenue: 28000.00,
    paymentTerms: 'Net 30',
    notes: 'Account inactive - last service over 6 months ago. Follow-up needed.',
    equipment: [],
    contacts: [
      { id: 'CNT-015', name: 'Carlos Rodriguez', role: 'Operations Manager', email: 'carlos.rodriguez@indauto.com', phone: '+1 (555) 890-1234', isPrimary: true },
    ],
    recentActivity: [
      { id: 'ACT-015', date: '2024-03-20', type: 'calibration', description: 'Last calibration service' },
    ],
  },
];

// Helper function to filter clients
export const filterClients = (
  clients: Client[],
  filters: {
    search?: string;
    status?: string;
    accountType?: string;
    industry?: string;
  }
): Client[] => {
  return clients.filter((client) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        client.companyName.toLowerCase().includes(searchLower) ||
        client.contactPerson.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchLower) ||
        client.city.toLowerCase().includes(searchLower) ||
        client.industry.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (client.status !== filters.status) return false;
    }

    // Account Type filter
    if (filters.accountType && filters.accountType !== 'all') {
      if (client.accountType !== filters.accountType) return false;
    }

    // Industry filter
    if (filters.industry && filters.industry !== 'all') {
      if (client.industry !== filters.industry) return false;
    }

    return true;
  });
};

// Helper function to get client statistics
export const getClientStats = (clients: Client[]) => {
  return {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    pending: clients.filter(c => c.status === 'pending').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    totalJobs: clients.reduce((sum, c) => sum + c.totalJobs, 0),
    activeJobs: clients.reduce((sum, c) => sum + c.activeJobs, 0),
    byAccountType: {
      standard: clients.filter(c => c.accountType === 'standard').length,
      premium: clients.filter(c => c.accountType === 'premium').length,
      enterprise: clients.filter(c => c.accountType === 'enterprise').length,
    },
  };
};
