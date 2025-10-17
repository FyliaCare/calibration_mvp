/**
 * Number Formatters
 * Utility functions for formatting numbers, currencies, and percentages
 */

const numberFormatters = {
  /**
   * Format number with specified decimal places
   */
  toFixed(number, decimals = 2) {
    if (number === null || number === undefined || isNaN(number)) return '0.00';
    return parseFloat(number).toFixed(decimals);
  },

  /**
   * Format number with thousands separator
   */
  withCommas(number) {
    if (number === null || number === undefined || isNaN(number)) return '0';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Format as currency (USD by default)
   */
  toCurrency(number, currency = 'USD', locale = 'en-US') {
    if (number === null || number === undefined || isNaN(number)) return '$0.00';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(number);
  },

  /**
   * Format as percentage
   */
  toPercent(number, decimals = 1) {
    if (number === null || number === undefined || isNaN(number)) return '0%';
    return `${(number * 100).toFixed(decimals)}%`;
  },

  /**
   * Format with unit suffix (K, M, B)
   */
  withSuffix(number) {
    if (number === null || number === undefined || isNaN(number)) return '0';
    const num = Math.abs(number);
    if (num >= 1e9) return (number / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (number / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (number / 1e3).toFixed(1) + 'K';
    return number.toString();
  },

  /**
   * Parse string to number
   */
  parse(value) {
    if (typeof value === 'number') return value;
    const cleaned = String(value).replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  },

  /**
   * Round to nearest value
   */
  roundTo(number, nearest = 1) {
    return Math.round(number / nearest) * nearest;
  },

  /**
   * Clamp number between min and max
   */
  clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
  },

  /**
   * Calculate percentage of total
   */
  percentOf(part, total) {
    if (!total || total === 0) return 0;
    return (part / total) * 100;
  },

  /**
   * Format file size
   */
  fileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Format scientific notation
   */
  toScientific(number, decimals = 2) {
    if (number === null || number === undefined || isNaN(number)) return '0';
    return number.toExponential(decimals);
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = numberFormatters;
}

// Export to window for global access
window.numberFormatters = numberFormatters;
