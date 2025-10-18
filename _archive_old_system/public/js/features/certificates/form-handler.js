/**
 * Certificate Form Handler
 * Handles certificate form interactions and validation
 */

const certificateForm = {
  currentStep: 1,
  totalSteps: 4,
  formData: {},

  /**
   * Initialize certificate form
   */
  init() {
    console.log('📋 Initializing certificate form...');
    this.attachEventListeners();
    this.loadDraft();
  },

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Step navigation
    const nextButtons = document.querySelectorAll('[data-action="next-step"]');
    nextButtons.forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    const prevButtons = document.querySelectorAll('[data-action="prev-step"]');
    prevButtons.forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    // Save draft button
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => this.saveDraft());
    }

    // Form inputs - auto-save on change
    const formInputs = document.querySelectorAll('#certificate-creation input, #certificate-creation select, #certificate-creation textarea');
    formInputs.forEach(input => {
      input.addEventListener('change', () => this.collectFormData());
    });
  },

  /**
   * Navigate to next step
   */
  nextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.showStep(this.currentStep + 1);
    }
  },

  /**
   * Navigate to previous step
   */
  prevStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  },

  /**
   * Show specific step
   */
  showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.step-content');
    steps.forEach(s => s.classList.remove('active'));

    // Show target step
    const targetStep = document.querySelector(`[data-step="${step}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    // Update progress
    this.updateProgress(step);

    // Update current step
    this.currentStep = step;

    console.log(`📊 Moved to step ${step}/${this.totalSteps}`);
  },

  /**
   * Update progress wizard
   */
  updateProgress(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((ps, index) => {
      if (index < step) {
        ps.classList.add('completed');
        ps.classList.remove('active');
      } else if (index === step - 1) {
        ps.classList.add('active');
        ps.classList.remove('completed');
      } else {
        ps.classList.remove('active', 'completed');
      }
    });
  },

  /**
   * Validate current step
   */
  validateCurrentStep() {
    const currentStepElement = document.querySelector(`.step-content[data-step="${this.currentStep}"]`);
    if (!currentStepElement) return true;

    const requiredInputs = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      const result = window.validators.validateElement(input);
      if (!result.valid) {
        isValid = false;
        this.showError(input, result.message);
      } else {
        this.clearError(input);
      }
    });

    return isValid;
  },

  /**
   * Show error message
   */
  showError(element, message) {
    element.classList.add('error');
    
    let errorDiv = element.parentElement.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      element.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  },

  /**
   * Clear error message
   */
  clearError(element) {
    element.classList.remove('error');
    const errorDiv = element.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  },

  /**
   * Collect form data
   */
  collectFormData() {
    const form = document.getElementById('certificate-creation');
    if (!form) return {};

    const formData = {};
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.name || input.id) {
        const key = input.name || input.id;
        formData[key] = input.type === 'checkbox' ? input.checked : input.value;
      }
    });

    this.formData = formData;
    return formData;
  },

  /**
   * Save draft
   */
  saveDraft() {
    const data = this.collectFormData();
    window.storage.set('certificate_draft', data);
    
    // Show notification
    this.showNotification('Draft saved successfully!', 'success');
    
    console.log('💾 Draft saved:', data);
  },

  /**
   * Load draft
   */
  loadDraft() {
    const draft = window.storage.get('certificate_draft');
    if (!draft) return;

    // Populate form with draft data
    Object.entries(draft).forEach(([key, value]) => {
      const input = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = value;
        } else {
          input.value = value;
        }
      }
    });

    this.formData = draft;
    console.log('📂 Draft loaded:', draft);
  },

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a toast system
    alert(message);
  },

  /**
   * Generate certificate number
   */
  generateCertificateNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `CAL-${year}${month}${day}-${random}`;
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = certificateForm;
}

// Export to window for global access
window.certificateForm = certificateForm;
