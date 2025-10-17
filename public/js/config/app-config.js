/**
 * Application Configuration
 * Central configuration for the CalPro application
 */

const APP_CONFIG = {
  // App Information
  APP_NAME: 'CalPro',
  APP_VERSION: '2.0.0',
  APP_TITLE: 'Calibration Management System',
  
  // Environment
  IS_DEMO_MODE: window.location.hostname.includes('netlify') || 
                window.location.hostname.includes('github.io') ||
                window.location.hostname !== 'localhost',
  
  // API Configuration
  API_BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : '/api',
  
  // Authentication
  AUTH_TOKEN_KEY: 'auth_token',
  USER_DATA_KEY: 'user',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  
  // UI Configuration
  DEFAULT_PAGE: 'dashboard',
  NOTIFICATION_DURATION: 3000, // 3 seconds
  LOADING_DELAY: 300, // Show loading after 300ms
  
  // Mobile Configuration
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  
  // Feature Flags
  FEATURES: {
    OFFLINE_MODE: true,
    PWA_ENABLED: true,
    DARK_MODE: false, // Future feature
    ADVANCED_SEARCH: true,
    BULK_OPERATIONS: true,
    EXPORT_PDF: true,
    EXPORT_EXCEL: true,
    REAL_TIME_SYNC: false, // Future feature
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'csv'],
  
  // Date Formats
  DATE_FORMAT: 'YYYY-MM-DD',
  DISPLAY_DATE_FORMAT: 'MMM DD, YYYY',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  
  // Calibration Specific
  EQUIPMENT_TYPES: [
    'Pressure',
    'Temperature',
    'Dimensional',
    'Mass',
    'Volume',
    'Electrical',
    'Force',
    'Torque',
    'Flow',
    'Other'
  ],
  
  CERTIFICATE_STATUSES: [
    'Draft',
    'Pending Review',
    'Approved',
    'Issued',
    'Expired',
    'Cancelled'
  ],
  
  WORKSHEET_STATUSES: [
    'Draft',
    'In Progress',
    'Completed',
    'Approved',
    'Converted to Certificate'
  ],
  
  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    TECHNICIAN: 'technician',
    VIEWER: 'viewer'
  },
  
  // Permissions
  PERMISSIONS: {
    CREATE_WORKSHEET: ['admin', 'manager', 'technician'],
    APPROVE_WORKSHEET: ['admin', 'manager'],
    CREATE_CERTIFICATE: ['admin', 'manager'],
    APPROVE_CERTIFICATE: ['admin'],
    MANAGE_USERS: ['admin'],
    MANAGE_EQUIPMENT: ['admin', 'manager'],
    VIEW_REPORTS: ['admin', 'manager', 'technician'],
    EXPORT_DATA: ['admin', 'manager']
  }
};

// Make config immutable
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.FEATURES);
Object.freeze(APP_CONFIG.PERMISSIONS);

// Export to window
window.APP_CONFIG = APP_CONFIG;
