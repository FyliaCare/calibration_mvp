/**
 * Form Validators
 * Utility functions for validating form inputs
 */

const validators = {
  /**
   * Validate required field
   */
  required(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  },

  /**
   * Validate email format
   */
  email(value) {
    if (!value) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(value).toLowerCase());
  },

  /**
   * Validate phone number
   */
  phone(value) {
    if (!value) return false;
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(value));
  },

  /**
   * Validate number
   */
  number(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  /**
   * Validate number in range
   */
  range(value, min, max) {
    const num = parseFloat(value);
    return this.number(value) && num >= min && num <= max;
  },

  /**
   * Validate string length
   */
  length(value, min, max = Infinity) {
    const len = String(value).trim().length;
    return len >= min && len <= max;
  },

  /**
   * Validate URL format
   */
  url(value) {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate date format (YYYY-MM-DD)
   */
  date(value) {
    if (!value) return false;
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(value)) return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
  },

  /**
   * Validate certificate number format
   */
  certificateNumber(value) {
    if (!value) return false;
    // Flexible format: allows letters, numbers, hyphens
    const re = /^[A-Z0-9-]+$/i;
    return re.test(String(value).trim());
  },

  /**
   * Validate serial number format
   */
  serialNumber(value) {
    if (!value) return false;
    return String(value).trim().length >= 3;
  },

  /**
   * Validate positive number
   */
  positive(value) {
    return this.number(value) && parseFloat(value) > 0;
  },

  /**
   * Validate integer
   */
  integer(value) {
    return Number.isInteger(parseFloat(value));
  },

  /**
   * Custom validator
   */
  custom(value, validatorFn) {
    return validatorFn(value);
  },

  /**
   * Validate form element
   */
  validateElement(element) {
    if (!element) return { valid: false, message: 'Element not found' };

    const value = element.value;
    const required = element.hasAttribute('required');
    const type = element.type;
    const min = element.min;
    const max = element.max;

    // Check required
    if (required && !this.required(value)) {
      return { valid: false, message: 'This field is required' };
    }

    // Skip other validations if empty and not required
    if (!required && !value) {
      return { valid: true };
    }

    // Type-specific validation
    if (type === 'email' && !this.email(value)) {
      return { valid: false, message: 'Please enter a valid email' };
    }

    if (type === 'number') {
      if (!this.number(value)) {
        return { valid: false, message: 'Please enter a valid number' };
      }
      if (min && parseFloat(value) < parseFloat(min)) {
        return { valid: false, message: `Value must be at least ${min}` };
      }
      if (max && parseFloat(value) > parseFloat(max)) {
        return { valid: false, message: `Value must be at most ${max}` };
      }
    }

    if (type === 'tel' && !this.phone(value)) {
      return { valid: false, message: 'Please enter a valid phone number' };
    }

    if (type === 'url' && !this.url(value)) {
      return { valid: false, message: 'Please enter a valid URL' };
    }

    if (type === 'date' && !this.date(value)) {
      return { valid: false, message: 'Please enter a valid date' };
    }

    return { valid: true };
  },

  /**
   * Validate entire form
   */
  validateForm(formElement) {
    if (!formElement) return { valid: false, errors: [] };

    const errors = [];
    const inputs = formElement.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      const result = this.validateElement(input);
      if (!result.valid) {
        errors.push({
          element: input,
          name: input.name || input.id,
          message: result.message
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = validators;
}

// Export to window for global access
window.validators = validators;
