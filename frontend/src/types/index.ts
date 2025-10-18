export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'USER';
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  industry: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  equipmentId: string;
  name: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  category: string;
  calibrationInterval: number;
  lastCalibrationDate: string | null;
  nextCalibrationDate: string | null;
  status: string;
  location: string | null;
  clientId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client?: Client;
}

export interface CalibrationRecord {
  id: string;
  recordNumber: string;
  equipmentId: string;
  calibrationDate: string;
  nextDueDate: string;
  technicianId: string;
  result: string;
  certificateNumber: string | null;
  certificateUrl: string | null;
  asFoundCondition: string | null;
  asLeftCondition: string | null;
  standardsUsed: string | null;
  environmentalConditions: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  equipment?: Equipment;
  technician?: User;
}
