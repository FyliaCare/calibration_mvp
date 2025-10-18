/**
 * MOCK USER DATA
 * ⚠️ REMOVE FOR PRODUCTION - DELETE THIS FILE when deploying with real backend
 * 
 * This file contains:
 * - Extended User interface with additional profile fields
 * - Mock user accounts (15 users across different roles)
 * - User activity/audit log data
 * - Helper functions for filtering and statistics
 */

import type { User } from '@/types';

// Extended User interface with additional profile fields
export interface UserProfile extends User {
  phone: string | null;
  department: string | null;
  position: string | null;
  avatar: string | null;
  bio: string | null;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  permissions: string[];
  lastPasswordChange: string | null;
  loginAttempts: number;
  lockedUntil: string | null;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  lockedUsers: number;
  byRole: {
    admin: number;
    manager: number;
    technician: number;
    user: number;
  };
  byDepartment: Record<string, number>;
  recentLogins: number;
  newThisMonth: number;
}

// Mock user data (15 users)
export const mockUsers: UserProfile[] = [
  {
    id: '1',
    email: 'admin@calibrationpro.com',
    name: 'Sarah Johnson',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-18T09:30:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2025-10-18T09:30:00Z',
    phone: '+1 (555) 123-4567',
    department: 'Administration',
    position: 'System Administrator',
    avatar: null,
    bio: 'Experienced system administrator with 10+ years in calibration management.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
    },
    permissions: ['all'],
    lastPasswordChange: '2025-09-01T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '2',
    email: 'mike.chen@calibrationpro.com',
    name: 'Mike Chen',
    role: 'MANAGER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-18T08:15:00Z',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2025-10-18T08:15:00Z',
    phone: '+1 (555) 234-5678',
    department: 'Calibration Services',
    position: 'Calibration Manager',
    avatar: null,
    bio: 'Managing calibration operations and technician teams.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    permissions: ['manage_users', 'manage_equipment', 'manage_jobs', 'view_reports', 'approve_calibrations'],
    lastPasswordChange: '2025-08-15T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '3',
    email: 'emily.rodriguez@calibrationpro.com',
    name: 'Emily Rodriguez',
    role: 'TECHNICIAN',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-17T16:45:00Z',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2025-10-17T16:45:00Z',
    phone: '+1 (555) 345-6789',
    department: 'Calibration Services',
    position: 'Senior Calibration Technician',
    avatar: null,
    bio: 'Certified technician specializing in electrical and pressure calibration.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    permissions: ['perform_calibrations', 'create_worksheets', 'view_equipment', 'view_clients'],
    lastPasswordChange: '2025-07-20T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '4',
    email: 'david.kim@calibrationpro.com',
    name: 'David Kim',
    role: 'TECHNICIAN',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-18T07:00:00Z',
    createdAt: '2024-04-05T08:30:00Z',
    updatedAt: '2025-10-18T07:00:00Z',
    phone: '+1 (555) 456-7890',
    department: 'Calibration Services',
    position: 'Calibration Technician',
    avatar: null,
    bio: 'Specializing in temperature and dimensional calibration.',
    notificationPreferences: {
      email: true,
      push: false,
      sms: false,
    },
    permissions: ['perform_calibrations', 'create_worksheets', 'view_equipment', 'view_clients'],
    lastPasswordChange: '2025-06-10T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '5',
    email: 'lisa.thompson@calibrationpro.com',
    name: 'Lisa Thompson',
    role: 'MANAGER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-17T17:30:00Z',
    createdAt: '2024-05-12T09:00:00Z',
    updatedAt: '2025-10-17T17:30:00Z',
    phone: '+1 (555) 567-8901',
    department: 'Quality Assurance',
    position: 'QA Manager',
    avatar: null,
    bio: 'Ensuring quality standards and compliance across all calibration activities.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
    },
    permissions: ['manage_equipment', 'manage_jobs', 'view_reports', 'approve_calibrations', 'audit_logs'],
    lastPasswordChange: '2025-09-10T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '6',
    email: 'james.wilson@calibrationpro.com',
    name: 'James Wilson',
    role: 'TECHNICIAN',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-18T06:30:00Z',
    createdAt: '2024-06-18T10:30:00Z',
    updatedAt: '2025-10-18T06:30:00Z',
    phone: '+1 (555) 678-9012',
    department: 'Calibration Services',
    position: 'Calibration Technician',
    avatar: null,
    bio: 'Focus on mechanical and torque calibration equipment.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    permissions: ['perform_calibrations', 'create_worksheets', 'view_equipment', 'view_clients'],
    lastPasswordChange: '2025-05-15T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '7',
    email: 'maria.garcia@calibrationpro.com',
    name: 'Maria Garcia',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-16T14:20:00Z',
    createdAt: '2024-07-22T11:00:00Z',
    updatedAt: '2025-10-16T14:20:00Z',
    phone: '+1 (555) 789-0123',
    department: 'Client Services',
    position: 'Client Relations Specialist',
    avatar: null,
    bio: 'Managing client communications and service requests.',
    notificationPreferences: {
      email: true,
      push: false,
      sms: false,
    },
    permissions: ['view_clients', 'view_equipment', 'create_jobs'],
    lastPasswordChange: '2025-04-20T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '8',
    email: 'robert.brown@calibrationpro.com',
    name: 'Robert Brown',
    role: 'TECHNICIAN',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-17T15:10:00Z',
    createdAt: '2024-08-30T09:30:00Z',
    updatedAt: '2025-10-17T15:10:00Z',
    phone: '+1 (555) 890-1234',
    department: 'Calibration Services',
    position: 'Junior Calibration Technician',
    avatar: null,
    bio: 'New technician learning flow and pressure calibration.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    permissions: ['perform_calibrations', 'create_worksheets', 'view_equipment'],
    lastPasswordChange: '2025-08-30T09:30:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '9',
    email: 'jennifer.lee@calibrationpro.com',
    name: 'Jennifer Lee',
    role: 'MANAGER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-18T08:45:00Z',
    createdAt: '2024-09-15T08:00:00Z',
    updatedAt: '2025-10-18T08:45:00Z',
    phone: '+1 (555) 901-2345',
    department: 'Operations',
    position: 'Operations Manager',
    avatar: null,
    bio: 'Overseeing daily operations and workflow optimization.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
    },
    permissions: ['manage_equipment', 'manage_jobs', 'view_reports', 'manage_clients'],
    lastPasswordChange: '2025-09-15T08:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '10',
    email: 'thomas.anderson@calibrationpro.com',
    name: 'Thomas Anderson',
    role: 'USER',
    isActive: false,
    emailVerified: true,
    lastLogin: '2025-09-20T10:00:00Z',
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: '2025-09-25T10:00:00Z',
    phone: '+1 (555) 012-3456',
    department: 'Client Services',
    position: 'Customer Support',
    avatar: null,
    bio: null,
    notificationPreferences: {
      email: false,
      push: false,
      sms: false,
    },
    permissions: ['view_clients'],
    lastPasswordChange: '2024-10-10T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '11',
    email: 'patricia.martinez@calibrationpro.com',
    name: 'Patricia Martinez',
    role: 'TECHNICIAN',
    isActive: true,
    emailVerified: false,
    lastLogin: null,
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-01T09:00:00Z',
    phone: '+1 (555) 123-7890',
    department: 'Calibration Services',
    position: 'Calibration Technician',
    avatar: null,
    bio: null,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    permissions: ['perform_calibrations', 'view_equipment'],
    lastPasswordChange: null,
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '12',
    email: 'kevin.nguyen@calibrationpro.com',
    name: 'Kevin Nguyen',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-15T11:30:00Z',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-10-15T11:30:00Z',
    phone: '+1 (555) 234-8901',
    department: 'Sales',
    position: 'Sales Representative',
    avatar: null,
    bio: 'Connecting clients with our calibration services.',
    notificationPreferences: {
      email: true,
      push: false,
      sms: false,
    },
    permissions: ['view_clients', 'create_jobs'],
    lastPasswordChange: '2025-01-20T10:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '13',
    email: 'amanda.white@calibrationpro.com',
    name: 'Amanda White',
    role: 'TECHNICIAN',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-18T07:20:00Z',
    createdAt: '2025-02-28T09:00:00Z',
    updatedAt: '2025-10-18T07:20:00Z',
    phone: '+1 (555) 345-9012',
    department: 'Calibration Services',
    position: 'Calibration Technician',
    avatar: null,
    bio: 'Specializing in electrical and electronic equipment calibration.',
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
    },
    permissions: ['perform_calibrations', 'create_worksheets', 'view_equipment', 'view_clients'],
    lastPasswordChange: '2025-02-28T09:00:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '14',
    email: 'christopher.davis@calibrationpro.com',
    name: 'Christopher Davis',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-17T13:00:00Z',
    createdAt: '2025-03-15T08:30:00Z',
    updatedAt: '2025-10-17T13:00:00Z',
    phone: null,
    department: 'IT Support',
    position: 'IT Specialist',
    avatar: null,
    bio: null,
    notificationPreferences: {
      email: true,
      push: false,
      sms: false,
    },
    permissions: ['view_equipment', 'view_reports'],
    lastPasswordChange: '2025-03-15T08:30:00Z',
    loginAttempts: 0,
    lockedUntil: null,
  },
  {
    id: '15',
    email: 'locked.user@calibrationpro.com',
    name: 'Locked User',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    lastLogin: '2025-10-10T10:00:00Z',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-10-10T10:05:00Z',
    phone: null,
    department: 'Other',
    position: 'Temporary User',
    avatar: null,
    bio: null,
    notificationPreferences: {
      email: false,
      push: false,
      sms: false,
    },
    permissions: [],
    lastPasswordChange: '2024-12-01T10:00:00Z',
    loginAttempts: 5,
    lockedUntil: '2025-10-25T10:05:00Z',
  },
];

// Mock user activity logs (30 recent activities)
export const mockUserActivities: UserActivity[] = [
  {
    id: 'act-1',
    userId: '1',
    action: 'LOGIN',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-18T09:30:00Z',
  },
  {
    id: 'act-2',
    userId: '2',
    action: 'LOGIN',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2025-10-18T08:15:00Z',
  },
  {
    id: 'act-3',
    userId: '3',
    action: 'CALIBRATION_COMPLETED',
    description: 'Completed calibration for equipment ELEC-001',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-17T16:45:00Z',
    metadata: { equipmentId: 'ELEC-001', calibrationId: 'CAL-001' },
  },
  {
    id: 'act-4',
    userId: '4',
    action: 'LOGIN',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-18T07:00:00Z',
  },
  {
    id: 'act-5',
    userId: '1',
    action: 'USER_CREATED',
    description: 'Created new user account',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-17T14:30:00Z',
    metadata: { newUserId: '11', email: 'patricia.martinez@calibrationpro.com' },
  },
  {
    id: 'act-6',
    userId: '5',
    action: 'REPORT_GENERATED',
    description: 'Generated calibration report',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2025-10-17T17:30:00Z',
    metadata: { reportType: 'calibration', dateRange: 'month' },
  },
  {
    id: 'act-7',
    userId: '6',
    action: 'LOGIN',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-18T06:30:00Z',
  },
  {
    id: 'act-8',
    userId: '2',
    action: 'EQUIPMENT_UPDATED',
    description: 'Updated equipment status',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2025-10-17T15:00:00Z',
    metadata: { equipmentId: 'PRESS-002', field: 'status', oldValue: 'in-service', newValue: 'maintenance' },
  },
  {
    id: 'act-9',
    userId: '7',
    action: 'CLIENT_CREATED',
    description: 'Added new client',
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-16T14:20:00Z',
    metadata: { clientId: 'client-8', companyName: 'Sample Industries' },
  },
  {
    id: 'act-10',
    userId: '8',
    action: 'WORKSHEET_CREATED',
    description: 'Created new calibration worksheet',
    ipAddress: '192.168.1.107',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2025-10-17T15:10:00Z',
    metadata: { worksheetId: 'ws-123', equipmentCategory: 'pressure' },
  },
];

/**
 * Filter users based on search and filter criteria
 */
export function filterUsers(
  users: UserProfile[],
  filters: {
    search?: string;
    role?: string;
    department?: string;
    status?: 'all' | 'active' | 'inactive' | 'locked' | 'unverified';
  }
): UserProfile[] {
  return users.filter(user => {
    // Search filter (name, email, department, position)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower) ||
        user.position?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      if (user.role !== filters.role.toUpperCase()) return false;
    }

    // Department filter
    if (filters.department && filters.department !== 'all') {
      if (user.department !== filters.department) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' && !user.isActive) return false;
      if (filters.status === 'inactive' && user.isActive) return false;
      if (filters.status === 'locked' && !user.lockedUntil) return false;
      if (filters.status === 'unverified' && user.emailVerified) return false;
    }

    return true;
  });
}

/**
 * Get user statistics
 */
export function getUserStats(users: UserProfile[]): UserStats {
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const stats: UserStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    inactiveUsers: users.filter(u => !u.isActive).length,
    verifiedUsers: users.filter(u => u.emailVerified).length,
    unverifiedUsers: users.filter(u => !u.emailVerified).length,
    lockedUsers: users.filter(u => u.lockedUntil && new Date(u.lockedUntil) > now).length,
    byRole: {
      admin: users.filter(u => u.role === 'ADMIN').length,
      manager: users.filter(u => u.role === 'MANAGER').length,
      technician: users.filter(u => u.role === 'TECHNICIAN').length,
      user: users.filter(u => u.role === 'USER').length,
    },
    byDepartment: {},
    recentLogins: users.filter(u => u.lastLogin && new Date(u.lastLogin) > dayAgo).length,
    newThisMonth: users.filter(u => new Date(u.createdAt) > monthAgo).length,
  };

  // Calculate by department
  users.forEach(user => {
    if (user.department) {
      stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Get activities for a specific user
 */
export function getUserActivities(userId: string, limit: number = 20): UserActivity[] {
  return mockUserActivities
    .filter(activity => activity.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Get all activities (for admin view)
 */
export function getAllActivities(limit: number = 50): UserActivity[] {
  return mockUserActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
