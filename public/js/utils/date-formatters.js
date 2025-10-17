/**
 * Date/Time Formatters
 * Utility functions for formatting dates and times
 */

const dateFormatters = {
  /**
   * Format date to ISO string (YYYY-MM-DD)
   */
  toISO(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  },

  /**
   * Format date to localized string
   */
  toLocaleString(date, options = {}) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('en-US', options);
  },

  /**
   * Format date to readable format (e.g., "Monday, April 6, 2020")
   */
  toReadable(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Format date to short format (e.g., "Oct 14, 2025")
   */
  toShort(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format time to HH:MM:SS
   */
  toTime(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', { hour12: false });
  },

  /**
   * Get current date in ISO format
   */
  now() {
    return this.toISO(new Date());
  },

  /**
   * Check if date is valid
   */
  isValid(date) {
    const d = date instanceof Date ? date : new Date(date);
    return !isNaN(d.getTime());
  },

  /**
   * Parse date string to Date object
   */
  parse(dateString) {
    return new Date(dateString);
  },

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  relative(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return this.toShort(d);
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = dateFormatters;
}

// Export to window for global access
window.dateFormatters = dateFormatters;
