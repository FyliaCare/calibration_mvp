/**
 * Main Application Entry Point
 * Initializes all modules and starts the application
 */

const CalibrationApp = {
  initialized: false,

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) {
      console.warn('⚠️ Application already initialized');
      return;
    }

    console.log('🚀 Starting Calibration Management System...');

    try {
      // Load templates
      await this.loadTemplates();

      // Initialize core modules
      this.initializeCore();

      // Initialize feature modules
      this.initializeFeatures();

      // Set up routing
      this.setupRouting();

      // Initialize current view
      this.navigateToCurrentHash();

      this.initialized = true;
      console.log('✅ Application initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      this.showError('Failed to start application. Please refresh the page.');
    }
  },

  /**
   * Load all HTML templates
   */
  async loadTemplates() {
    console.log('📄 Loading templates...');

    try {
      await Promise.all([
        window.templateLoader.load('partials/mobile-header', 'mobile-header-container'),
        window.templateLoader.load('partials/sidebar', 'sidebar-container'),
        window.templateLoader.load('partials/top-header', 'header-container'),
        window.templateLoader.load('modals/common-modals', 'modals-container')
      ]);

      console.log('✅ Templates loaded');
    } catch (error) {
      console.error('❌ Template loading failed:', error);
      throw error;
    }
  },

  /**
   * Initialize core modules
   */
  initializeCore() {
    console.log('⚙️ Initializing core modules...');

    // Initialize state manager if available
    if (window.stateManager) {
      window.stateManager.init();
    }

    // Set up mobile navigation
    this.setupMobileNavigation();

    // Set up sidebar toggle
    this.setupSidebarToggle();
  },

  /**
   * Initialize feature modules
   */
  initializeFeatures() {
    console.log('🎯 Initializing features...');

    // Initialize certificate features
    if (window.certificateForm) {
      window.certificateForm.init();
    }

    // Initialize worksheet features
    if (window.worksheetManager) {
      window.worksheetManager.init();
    }

    // Initialize dashboard
    if (window.dashboardManager) {
      window.dashboardManager.init();
    }
  },

  /**
   * Set up routing
   */
  setupRouting() {
    console.log('🧭 Setting up routing...');

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.navigateToCurrentHash();
    });

    // Set up navigation links
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('data-nav');
        window.location.hash = target;
      });
    });
  },

  /**
   * Navigate based on current hash
   */
  async navigateToCurrentHash() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    console.log('🧭 Navigating to:', hash);

    // Update active nav
    this.updateActiveNav(hash);

    // Load appropriate section
    await this.loadSection(hash);

    // Initialize section-specific features
    this.initializeSection(hash);
  },

  /**
   * Update active navigation highlight
   */
  updateActiveNav(section) {
    // Remove active class from all nav items
    document.querySelectorAll('[data-nav]').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to current section
    document.querySelectorAll(`[data-nav="${section}"]`).forEach(item => {
      item.classList.add('active');
    });
  },

  /**
   * Load section template
   */
  async loadSection(section) {
    const container = document.getElementById('content-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="loading-spinner">Loading...</div>';

    try {
      // Map sections to templates
      const templateMap = {
        'dashboard': 'sections/dashboard',
        'worksheets': 'sections/worksheets',
        'certificates': 'sections/certificates',
        'equipment-reports': 'sections/equipment-reports',
        'settings': 'sections/settings-admin'
      };

      const template = templateMap[section] || 'sections/dashboard';
      await window.templateLoader.load(template, 'content-container');

    } catch (error) {
      console.error('Failed to load section:', error);
      container.innerHTML = `
        <div class="error-message">
          <h2>Failed to load section</h2>
          <p>Please try again or contact support.</p>
        </div>
      `;
    }
  },

  /**
   * Initialize section-specific features
   */
  initializeSection(section) {
    switch (section) {
      case 'dashboard':
        if (window.dashboardManager) {
          window.dashboardManager.refresh();
        }
        break;

      case 'worksheets':
        if (window.worksheetManager) {
          window.worksheetManager.attachEventListeners();
        }
        break;

      case 'certificates':
        if (window.certificateForm) {
          window.certificateForm.attachEventListeners();
        }
        break;
    }
  },

  /**
   * Set up mobile navigation
   */
  setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenu');

    if (mobileMenuBtn && mobileSidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileSidebar.classList.add('active');
      });
    }

    if (closeMobileMenuBtn && mobileSidebar) {
      closeMobileMenuBtn.addEventListener('click', () => {
        mobileSidebar.classList.remove('active');
      });
    }

    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileSidebar && mobileSidebar.classList.contains('active')) {
        if (!mobileSidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          mobileSidebar.classList.remove('active');
        }
      }
    });

    // Close mobile sidebar when navigating
    window.addEventListener('hashchange', () => {
      if (mobileSidebar) {
        mobileSidebar.classList.remove('active');
      }
    });
  },

  /**
   * Set up sidebar toggle
   */
  setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        // Save preference
        const isCollapsed = sidebar.classList.contains('collapsed');
        window.storage.set('sidebar_collapsed', isCollapsed);
      });

      // Restore preference
      const isCollapsed = window.storage.get('sidebar_collapsed', false);
      if (isCollapsed) {
        sidebar.classList.add('collapsed');
      }
    }
  },

  /**
   * Show error message
   */
  showError(message) {
    alert(message);
  }
};

// Global helper functions for backward compatibility
window.showNewRecordForm = function() {
  window.location.hash = 'worksheets';
  setTimeout(() => {
    const createBtn = document.querySelector('[data-action="create-worksheet"]');
    if (createBtn) createBtn.click();
  }, 100);
};

window.showTemplateDialog = function() {
  const modal = document.getElementById('templateModal');
  if (modal) modal.style.display = 'block';
};

window.saveBasicCertificate = async function() {
  if (window.certificateForm) {
    const data = window.certificateForm.collectFormData();
    const certificates = window.storage.get('calibration_certificates', []);
    
    data.id = Date.now();
    data.date_of_issue = new Date().toISOString().split('T')[0];
    
    certificates.push(data);
    window.storage.set('calibration_certificates', certificates);
    
    alert('✅ Certificate saved successfully!');
    window.location.hash = 'certificates';
  }
};

window.nextStep = function() {
  if (window.certificateForm) {
    window.certificateForm.nextStep();
  }
};

window.prevStep = function() {
  if (window.certificateForm) {
    window.certificateForm.prevStep();
  }
};

window.addBasicTestRow = function() {
  if (window.worksheetManager) {
    window.worksheetManager.addTestRow();
  }
};

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    CalibrationApp.init();
  });
} else {
  CalibrationApp.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalibrationApp;
}

// Export to window
window.CalibrationApp = CalibrationApp;
