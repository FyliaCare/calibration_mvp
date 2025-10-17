/**
 * Dashboard Manager
 * Handles dashboard statistics, charts, and recent items
 */

const dashboardManager = {
  stats: {
    todayCount: 0,
    weeklyCount: 0,
    overdueCount: 0,
    completedToday: 0
  },

  /**
   * Initialize dashboard
   */
  init() {
    console.log('📊 Initializing dashboard...');
    this.loadStats();
    this.loadRecentWorksheets();
    this.startLiveClock();
  },

  /**
   * Load dashboard statistics
   */
  loadStats() {
    // Get data from storage
    const worksheets = window.storage.get('completed_worksheets', []);
    const certificates = window.storage.get('calibration_certificates', []);
    
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Calculate stats
    this.stats.todayCount = worksheets.filter(w => w.completed_at?.startsWith(today)).length;
    this.stats.weeklyCount = worksheets.filter(w => w.completed_at >= weekAgo).length;
    this.stats.completedToday = certificates.filter(c => c.date_of_issue === today).length;
    this.stats.overdueCount = this.calculateOverdue();

    // Update display
    this.updateStatsDisplay();
  },

  /**
   * Calculate overdue items
   */
  calculateOverdue() {
    const certificates = window.storage.get('calibration_certificates', []);
    const today = new Date();
    
    return certificates.filter(cert => {
      if (!cert.recalibration_due) return false;
      const dueDate = new Date(cert.recalibration_due);
      return dueDate < today;
    }).length;
  },

  /**
   * Update stats display
   */
  updateStatsDisplay() {
    const elements = {
      todayCount: document.getElementById('todayCount'),
      weeklyCount: document.getElementById('weeklyCount'),
      overdueCount: document.getElementById('overdueCount'),
      completedToday: document.getElementById('completedToday')
    };

    Object.entries(this.stats).forEach(([key, value]) => {
      if (elements[key]) {
        elements[key].textContent = value;
      }
    });
  },

  /**
   * Load recent worksheets and certificates
   */
  loadRecentWorksheets() {
    const container = document.querySelector('.recent-worksheets-list');
    if (!container) return;

    const worksheets = window.storage.get('completed_worksheets', []);
    const certificates = window.storage.get('calibration_certificates', []);
    
    // Combine and sort by date
    const allItems = [
      ...worksheets.map(w => ({ ...w, type: 'worksheet' })),
      ...certificates.map(c => ({ ...c, type: 'certificate' }))
    ].sort((a, b) => {
      const dateA = new Date(a.completed_at || a.date_of_issue || 0);
      const dateB = new Date(b.completed_at || b.date_of_issue || 0);
      return dateB - dateA;
    }).slice(0, 10); // Top 10 recent items

    if (allItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #999;">
          <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
          <p>No worksheets or certificates yet</p>
          <button class="btn btn-primary" onclick="window.location.hash='worksheets'">
            <i class="fas fa-plus"></i> Create First Worksheet
          </button>
        </div>
      `;
      return;
    }

    // Generate HTML for recent items
    container.innerHTML = allItems.map(item => this.generateItemCard(item)).join('');
  },

  /**
   * Generate item card HTML
   */
  generateItemCard(item) {
    const iconMap = {
      worksheet: 'fa-file-lines',
      certificate: 'fa-certificate'
    };

    const statusMap = {
      completed: { label: 'Completed', class: 'status-completed' },
      draft: { label: 'Draft', class: 'status-draft' },
      pending: { label: 'Pending Review', class: 'status-pending' }
    };

    const icon = iconMap[item.type] || 'fa-file';
    const status = statusMap[item.status] || statusMap.completed;
    const date = window.dateFormatters.toShort(item.completed_at || item.date_of_issue);

    return `
      <div class="worksheet-item ${status.class}">
        <div class="worksheet-status-indicator"></div>
        <div class="worksheet-icon">
          <i class="fas ${icon}"></i>
        </div>
        <div class="worksheet-info">
          <h4>${item.equipment_description || 'Unnamed Equipment'}</h4>
          <p class="worksheet-details">
            <span><i class="fas fa-hashtag"></i> ${item.certificate_number || item.id}</span>
            <span><i class="fas fa-building"></i> ${item.customer || 'No Customer'}</span>
            <span><i class="fas fa-calendar"></i> ${date}</span>
          </p>
        </div>
        <div class="worksheet-status-badge ${status.class}">
          <i class="fas fa-check-circle"></i> ${status.label}
        </div>
        <div class="worksheet-actions">
          <button class="action-btn" title="View" onclick="dashboardManager.viewItem('${item.id}', '${item.type}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn" title="Download PDF" onclick="dashboardManager.downloadPDF('${item.id}', '${item.type}')">
            <i class="fas fa-file-pdf"></i>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * View item details
   */
  viewItem(id, type) {
    console.log(`View ${type}:`, id);
    // Navigate to appropriate section
    if (type === 'worksheet') {
      window.location.hash = 'worksheets';
    } else if (type === 'certificate') {
      window.location.hash = 'certificates';
    }
  },

  /**
   * Download PDF
   */
  async downloadPDF(id, type) {
    console.log(`Download PDF for ${type}:`, id);
    
    try {
      let data;
      if (type === 'worksheet') {
        const worksheets = window.storage.get('completed_worksheets', []);
        data = worksheets.find(w => w.id == id);
      } else {
        const certificates = window.storage.get('calibration_certificates', []);
        data = certificates.find(c => c.id == id);
      }

      if (!data) {
        alert('Item not found');
        return;
      }

      // Generate PDF
      await window.pdfGenerator.download(data);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  },

  /**
   * Start live clock
   */
  startLiveClock() {
    const updateClock = () => {
      const now = new Date();
      
      const timeEl = document.getElementById('currentTime');
      const dateEl = document.getElementById('currentDate');

      if (timeEl) {
        timeEl.textContent = window.dateFormatters.toTime(now);
      }

      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
    };

    // Update immediately and every second
    updateClock();
    setInterval(updateClock, 1000);
  },

  /**
   * Refresh dashboard
   */
  refresh() {
    this.loadStats();
    this.loadRecentWorksheets();
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = dashboardManager;
}

// Export to window for global access
window.dashboardManager = dashboardManager;
