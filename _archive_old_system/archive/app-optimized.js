/**
 * CalPro Calibration Management System - Mobile Optimized
 * Extracted and optimized JavaScript for fast mobile loading
 * Version: 2.0.0
 */

// Check authentication before loading the page
(function() {
  const token = localStorage.getItem('auth_token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // If no token or user, redirect to login
  if (!token || !user) {
    window.location.href = '/login.html';
    return;
  }
  
  // Store user info globally for use throughout the app
  window.currentUser = user;
  window.authToken = token;
  
  // Demo mode detection
  const isDemoMode = window.location.hostname.includes('netlify') || 
                     window.location.hostname.includes('github.io') ||
                     window.location.hostname !== 'localhost';
  
  // Set default headers for all fetch requests
  window.fetchWithAuth = function(url, options = {}) {
    // Demo mode - return mock responses
    if (isDemoMode) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(getMockApiResponse(url)),
        text: () => Promise.resolve('Mock response')
      });
    }

    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return fetch(url, options)
      .then(response => {
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login.html';
          throw new Error('Session expired');
        }
        return response;
      });
  };

  // Mock API responses for demo mode
  function getMockApiResponse(url) {
    if (url.includes('/api/user/profile')) {
      return {
        id: 1,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        profile_picture: null,
        last_login: new Date().toISOString()
      };
    }
    if (url.includes('/api/users')) {
      return {
        users: [
          { id: 1, name: 'Demo Admin', email: 'admin@demo.com', role: 'admin', status: 'active' },
          { id: 2, name: 'Demo User', email: 'user@demo.com', role: 'calibrator', status: 'active' }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      };
    }
    // Default mock response
    return { message: 'Demo mode - mock response', success: true };
  }
})();

// Core Application Functions
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 CalPro Mobile Optimized Loading...');
  
  // Initialize core functionality
  initializeNavigation();
  initializeNotifications();
  initializeTime();
  initializeMobileFeatures();
  
  // Load dashboard data
  setTimeout(() => {
    loadDashboardData();
    updateDashboardStats();
  }, 100);
  
  console.log('✅ CalPro Mobile Optimized Ready');
});

// Navigation Functions
function initializeNavigation() {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('mobile-open');
      document.body.classList.toggle('sidebar-open');
    });
  }

  // Menu item clicks
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        showSection(sectionId);
        
        // Close mobile menu
        if (sidebar) {
          sidebar.classList.remove('mobile-open');
          document.body.classList.remove('sidebar-open');
        }
      }
    });
  });

  // Header logo click to toggle sidebar
  const headerLogo = document.getElementById('headerLogo');
  if (headerLogo) {
    headerLogo.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Hash change handling
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      showSection(hash);
    }
  });

  // Initialize with current hash
  const currentHash = window.location.hash.substring(1);
  if (currentHash) {
    showSection(currentHash);
  }
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    
    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const targetMenuItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
    if (targetMenuItem) {
      targetMenuItem.classList.add('active');
    }
  }
}

// Notification System
function initializeNotifications() {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      notificationDropdown.classList.remove('show');
    });
  }

  // User profile dropdown
  const userProfileBtn = document.getElementById('userProfileBtn');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userProfileBtn && userDropdown) {
    userProfileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function() {
      userDropdown.classList.remove('show');
    });
  }
}

function showNotification(message, type = 'info', duration = 5000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  // Add to container or create one
  let container = document.querySelector('.notification-container-fixed');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container-fixed';
    document.body.appendChild(container);
  }
  
  container.appendChild(notification);
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);
  }
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'times-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// Time and Date Functions
function initializeTime() {
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
}

function updateCurrentTime() {
  const now = new Date();
  const timeElement = document.getElementById('currentTime');
  const dateElement = document.getElementById('currentDate');
  
  if (timeElement) {
    timeElement.textContent = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Mobile Features
function initializeMobileFeatures() {
  // Add touch feedback to interactive elements
  document.querySelectorAll('button, .btn, .menu-item').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    element.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Mobile-specific optimizations
  if (window.innerWidth <= 768) {
    document.body.classList.add('mobile-device');
    
    // Disable hover effects on mobile
    const style = document.createElement('style');
    style.textContent = `
      @media (hover: none) {
        .btn:hover,
        .menu-item:hover,
        .card:hover {
          transform: none !important;
          box-shadow: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Dashboard Functions
function loadDashboardData() {
  // Load recent worksheets
  loadRecentWorksheets();
  
  // Show demo mode banner if needed
  const isDemoMode = window.location.hostname.includes('netlify') || 
                     window.location.hostname.includes('github.io') ||
                     window.location.hostname !== 'localhost';
  
  if (isDemoMode) {
    const banner = document.getElementById('demo-mode-banner');
    if (banner) {
      banner.style.display = 'block';
    }
  }
}

function loadRecentWorksheets() {
  const worksheetsContainer = document.querySelector('.recent-worksheets-list');
  if (!worksheetsContainer) return;

  // Show loading state
  worksheetsContainer.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; color: #999;">
      <i class="fas fa-spinner fa-spin" style="font-size: 32px; margin-bottom: 12px;"></i>
      <p>Loading recent worksheets...</p>
    </div>
  `;

  // Simulate loading delay for demo
  setTimeout(() => {
    const mockWorksheets = [
      {
        id: 'ws-001',
        title: 'Pressure Transmitter - Rosemount 3051',
        customer: 'Ghana Oil Company',
        date: 'Oct 14, 2025',
        status: 'completed',
        certNo: 'P-2025-001',
        icon: 'fa-gauge-high'
      },
      {
        id: 'ws-002',
        title: 'Pt100 RTD Temperature Sensor',
        customer: 'Food Processing Ltd',
        date: 'Oct 14, 2025',
        status: 'draft',
        certNo: 'P-2025-002',
        icon: 'fa-thermometer-half'
      },
      {
        id: 'ws-003',
        title: 'Fluke 87V Digital Multimeter',
        customer: 'Mining Operations',
        date: 'Oct 13, 2025',
        status: 'pending',
        certNo: 'P-2025-003',
        icon: 'fa-bolt'
      }
    ];

    let html = '';
    mockWorksheets.forEach(worksheet => {
      html += createWorksheetItemHTML(worksheet);
    });
    
    worksheetsContainer.innerHTML = html;
  }, 1000);
}

function createWorksheetItemHTML(worksheet) {
  const statusConfig = {
    completed: { class: 'status-completed', icon: 'fa-check-circle', text: 'Completed' },
    draft: { class: 'status-draft', icon: 'fa-pen', text: 'Draft' },
    pending: { class: 'status-pending', icon: 'fa-hourglass-half', text: 'Pending Review' }
  };
  
  const status = statusConfig[worksheet.status] || statusConfig.draft;
  
  return `
    <div class="worksheet-item ${status.class}">
      <div class="worksheet-status-indicator"></div>
      <div class="worksheet-icon">
        <i class="fas ${worksheet.icon}"></i>
      </div>
      <div class="worksheet-info">
        <h4>${worksheet.title}</h4>
        <p class="worksheet-details">
          <span><i class="fas fa-hashtag"></i> ${worksheet.certNo}</span>
          <span><i class="fas fa-building"></i> ${worksheet.customer}</span>
          <span><i class="fas fa-calendar"></i> ${worksheet.date}</span>
        </p>
      </div>
      <div class="worksheet-status-badge ${status.class}">
        <i class="fas ${status.icon}"></i> ${status.text}
      </div>
      <div class="worksheet-actions">
        ${worksheet.status === 'completed' ? 
          `<button class="action-btn" title="View Certificate">
            <i class="fas fa-file-pdf"></i>
          </button>` : 
          `<button class="action-btn primary" title="Continue">
            <i class="fas fa-play"></i>
          </button>`
        }
        <button class="action-btn" title="Duplicate">
          <i class="fas fa-copy"></i>
        </button>
        <button class="action-btn" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    </div>
  `;
}

function updateDashboardStats() {
  // Update quick stats with mock data
  const stats = {
    todayCount: 3,
    weeklyCount: 12,
    overdueCount: 2,
    completedToday: 1
  };
  
  document.getElementById('todayCount').textContent = stats.todayCount;
  document.getElementById('weeklyCount').textContent = stats.weeklyCount;
  document.getElementById('overdueCount').textContent = stats.overdueCount;
  document.getElementById('completedToday').textContent = stats.completedToday;
}

// Worksheet Functions
function showPressureTemplates() {
  const modal = document.getElementById('pressureTemplateModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePressureTemplates() {
  const modal = document.getElementById('pressureTemplateModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function selectPressureTemplate(templateId) {
  closePressureTemplates();
  window.location.hash = 'worksheets';
  
  setTimeout(() => {
    if (typeof applyPressureTemplate === 'function') {
      applyPressureTemplate(templateId);
    } else {
      showNotification('Pressure templates will be loaded shortly', 'info');
    }
  }, 500);
}

// Modal Functions
function openQuickScanModal() {
  const modal = document.getElementById('quickScanModal');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('scanInput');
    if (input) input.focus();
  }
}

function closeQuickScanModal() {
  const modal = document.getElementById('quickScanModal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('scanInput').value = '';
    document.getElementById('scanResults').style.display = 'none';
  }
}

function performQuickScan() {
  const input = document.getElementById('scanInput');
  const resultsDiv = document.getElementById('scanResults');
  const resultsList = document.getElementById('scanResultsList');
  
  if (!input.value.trim()) {
    showNotification('Please enter an equipment tag or serial number', 'warning');
    return;
  }
  
  // Show loading
  resultsList.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
  resultsDiv.style.display = 'block';
  
  // Simulate search
  setTimeout(() => {
    resultsList.innerHTML = `
      <div class="scan-result-item">
        <i class="fas fa-gauge-high"></i>
        <div>
          <h4>Pressure Transmitter</h4>
          <p>Serial: ${input.value} • Customer: Ghana Oil Company</p>
          <small>Last calibrated: Oct 2024 • Due: Oct 2025</small>
        </div>
        <button class="btn-sm btn-primary" onclick="viewEquipmentDetails('${input.value}')">View</button>
      </div>
    `;
  }, 1000);
}

function openExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.style.display = 'flex';
    
    // Set default dates
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    document.getElementById('exportStartDate').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('exportEndDate').value = today.toISOString().split('T')[0];
  }
}

function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function performExport() {
  showNotification('Export feature will be available in the next update', 'info');
  closeExportModal();
}

// Settings Functions
function switchSettingsTab(tab) {
  // Hide all panels
  document.querySelectorAll('.settings-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Show target panel
  const targetPanel = document.getElementById(`settings-${tab}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
  
  // Update tab buttons
  document.querySelectorAll('.settings-tab').forEach(tabBtn => {
    tabBtn.classList.remove('active');
  });
  
  const targetTab = document.querySelector(`[data-tab="${tab}"]`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

function saveAllSettings() {
  showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    showNotification('Settings reset to defaults', 'success');
  }
}

// Global Event Listeners
document.addEventListener('click', function(event) {
  // Close modals when clicking outside
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal[style*="flex"]');
    openModals.forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
  }
});

// Connection status monitoring
function updateConnectionStatus() {
  const status = document.getElementById('connectionStatus');
  const icon = document.getElementById('connectionIcon');
  const text = document.getElementById('connectionText');
  
  if (navigator.onLine) {
    if (status) status.className = 'status-item online';
    if (icon) icon.className = 'fas fa-wifi';
    if (text) text.textContent = 'Online';
  } else {
    if (status) status.className = 'status-item offline';
    if (icon) icon.className = 'fas fa-wifi-slash';
    if (text) text.textContent = 'Offline';
  }
}

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// Make functions globally available
window.showSection = showSection;
window.showNotification = showNotification;
window.showPressureTemplates = showPressureTemplates;
window.selectPressureTemplate = selectPressureTemplate;
window.openQuickScanModal = openQuickScanModal;
window.closeQuickScanModal = closeQuickScanModal;
window.performQuickScan = performQuickScan;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.performExport = performExport;
window.switchSettingsTab = switchSettingsTab;
window.saveAllSettings = saveAllSettings;
window.resetSettings = resetSettings;
window.updateDashboardStats = updateDashboardStats;

console.log('📱 CalPro Mobile Optimized JavaScript Loaded');