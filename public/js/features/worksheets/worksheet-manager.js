/**
 * Worksheet Manager
 * Handles worksheet creation, templates, and test points
 */

const worksheetManager = {
  currentWorksheet: null,
  testPoints: [],

  /**
   * Initialize worksheet manager
   */
  init() {
    console.log('📝 Initializing worksheet manager...');
    this.attachEventListeners();
  },

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Add test row button
    const addRowBtn = document.getElementById('ws_addRow');
    if (addRowBtn) {
      addRowBtn.addEventListener('click', () => this.addTestRow());
    }

    // Save draft button
    const saveDraftBtn = document.querySelector('[data-action="save-worksheet-draft"]');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => this.saveDraft());
    }

    // Complete worksheet button
    const completeBtn = document.querySelector('[data-action="complete-worksheet"]');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => this.complete());
    }
  },

  /**
   * Add test point row to table
   */
  addTestRow() {
    const table = document.getElementById('ws_resultsTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><input type="number" step="any" placeholder="0.00" class="test-input" data-field="reference"></td>
      <td>
        <select class="test-select" data-field="direction">
          <option value="up">↑ Up</option>
          <option value="down">↓ Down</option>
        </select>
      </td>
      <td><input type="number" step="any" placeholder="0.00" class="test-input" data-field="measured"></td>
      <td class="calculated-deviation">0.000</td>
      <td class="calculated-error">0.00%</td>
      <td><input type="number" step="any" placeholder="0.00" class="test-input" data-field="uncertainty"></td>
      <td class="pass-fail-indicator">-</td>
      <td>
        <button type="button" class="btn-icon btn-danger" onclick="window.removeRow(this)" title="Remove row">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);

    // Attach calculation listeners
    row.querySelectorAll('.test-input').forEach(input => {
      input.addEventListener('input', () => this.calculateRow(row));
    });

    this.updateSummary();
  },

  /**
   * Calculate row values
   */
  calculateRow(row) {
    const refInput = row.querySelector('[data-field="reference"]');
    const measuredInput = row.querySelector('[data-field="measured"]');
    
    if (!refInput || !measuredInput) return;

    const refValue = parseFloat(refInput.value) || 0;
    const measuredValue = parseFloat(measuredInput.value) || 0;

    // Calculate deviation
    const deviation = measuredValue - refValue;
    const deviationCell = row.querySelector('.calculated-deviation');
    if (deviationCell) {
      deviationCell.textContent = deviation.toFixed(3);
    }

    // Calculate % error
    const percentError = refValue !== 0 ? (deviation / refValue) * 100 : 0;
    const errorCell = row.querySelector('.calculated-error');
    if (errorCell) {
      errorCell.textContent = percentError.toFixed(2) + '%';
    }

    // Determine pass/fail (example: ±2% tolerance)
    const tolerance = 2.0;
    const passIcon = row.querySelector('.pass-fail-indicator');
    if (passCell) {
      if (Math.abs(percentError) <= tolerance) {
        passCell.textContent = '✓ PASS';
        passCell.className = 'pass-fail-indicator pass';
      } else {
        passCell.textContent = '✗ FAIL';
        passCell.className = 'pass-fail-indicator fail';
      }
    }

    this.updateSummary();
  },

  /**
   * Update summary statistics
   */
  updateSummary() {
    const rows = document.querySelectorAll('#ws_resultsTable tbody tr');
    
    let totalPoints = rows.length;
    let passedPoints = 0;
    let failedPoints = 0;

    rows.forEach(row => {
      const indicator = row.querySelector('.pass-fail-indicator');
      if (indicator) {
        if (indicator.classList.contains('pass')) passedPoints++;
        if (indicator.classList.contains('fail')) failedPoints++;
      }
    });

    // Update display
    const totalEl = document.getElementById('ws_totalPoints');
    const passedEl = document.getElementById('ws_passedPoints');
    const failedEl = document.getElementById('ws_failedPoints');

    if (totalEl) totalEl.textContent = totalPoints;
    if (passedEl) passedEl.textContent = passedPoints;
    if (failedEl) failedEl.textContent = failedPoints;
  },

  /**
   * Collect worksheet data
   */
  collectData() {
    const data = {
      // Equipment details
      equipment_description: document.getElementById('ws_equipDesc')?.value || '',
      manufacturer: document.getElementById('ws_manufacturer')?.value || '',
      model: document.getElementById('ws_equipModel')?.value || '',
      serial_number: document.getElementById('ws_serialNo')?.value || '',
      type_range: document.getElementById('ws_typeRange')?.value || '',
      accuracy: document.getElementById('ws_accuracy')?.value || '',
      location: document.getElementById('ws_location')?.value || '',
      asset_number: document.getElementById('ws_assetNo')?.value || '',
      
      // Customer info
      customer: document.getElementById('ws_customer')?.value || '',
      site: document.getElementById('ws_site')?.value || '',
      contact: document.getElementById('ws_contact')?.value || '',
      contact_info: document.getElementById('ws_contactInfo')?.value || '',
      
      // Standards
      reference_standard: document.getElementById('ws_refStandard')?.value || '',
      certificate_number: document.getElementById('ws_refCertNo')?.value || '',
      calibration_date: document.getElementById('ws_refCalDate')?.value || '',
      due_date: document.getElementById('ws_refDueDate')?.value || '',
      
      // Test results
      test_points: this.collectTestPoints(),
      
      // Sign-off
      calibrated_by: document.getElementById('ws_calibratedBy')?.value || '',
      calibration_date: document.getElementById('ws_calibrationDate')?.value || '',
      comments: document.getElementById('ws_comments')?.value || ''
    };

    return data;
  },

  /**
   * Collect test points from table
   */
  collectTestPoints() {
    const rows = document.querySelectorAll('#ws_resultsTable tbody tr');
    const testPoints = [];

    rows.forEach(row => {
      const refValue = row.querySelector('[data-field="reference"]')?.value;
      const direction = row.querySelector('[data-field="direction"]')?.value;
      const measured = row.querySelector('[data-field="measured"]')?.value;
      const uncertainty = row.querySelector('[data-field="uncertainty"]')?.value;
      const deviation = row.querySelector('.calculated-deviation')?.textContent;
      const error = row.querySelector('.calculated-error')?.textContent;
      const passIndicator = row.querySelector('.pass-fail-indicator');
      const passFail = passIndicator?.classList.contains('pass') ? 'PASS' : 'FAIL';

      testPoints.push({
        reference_value: parseFloat(refValue) || 0,
        direction,
        measured_value: parseFloat(measured) || 0,
        deviation: parseFloat(deviation) || 0,
        percent_error: error,
        uncertainty: parseFloat(uncertainty) || 0,
        pass_fail: passFail
      });
    });

    return testPoints;
  },

  /**
   * Save worksheet as draft
   */
  saveDraft() {
    const data = this.collectData();
    const drafts = window.storage.get('worksheet_drafts', []);
    
    data.id = Date.now();
    data.status = 'draft';
    data.saved_at = new Date().toISOString();
    
    drafts.push(data);
    window.storage.set('worksheet_drafts', drafts);
    
    alert('Worksheet draft saved successfully!');
    console.log('💾 Worksheet draft saved:', data);
  },

  /**
   * Complete worksheet
   */
  complete() {
    const data = this.collectData();
    
    // Validate required fields
    if (!data.equipment_description || !data.customer) {
      alert('Please fill in all required fields');
      return;
    }

    if (data.test_points.length === 0) {
      alert('Please add at least one test point');
      return;
    }

    // Save completed worksheet
    const worksheets = window.storage.get('completed_worksheets', []);
    
    data.id = Date.now();
    data.status = 'completed';
    data.completed_at = new Date().toISOString();
    
    worksheets.push(data);
    window.storage.set('completed_worksheets', worksheets);
    
    alert('✅ Worksheet completed successfully!');
    console.log('✅ Worksheet completed:', data);
    
    // Navigate back to list
    window.location.hash = 'worksheets';
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = worksheetManager;
}

// Export to window for global access
window.worksheetManager = worksheetManager;

// Global helper for removing rows (used by onclick handlers)
window.removeRow = function(btn) {
  const row = btn.closest('tr');
  if (row) {
    row.remove();
    worksheetManager.updateSummary();
  }
};
