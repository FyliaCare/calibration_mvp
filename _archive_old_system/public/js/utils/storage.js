/**
 * Storage Helpers
 * Utility functions for localStorage and sessionStorage
 */

const storage = {
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting localStorage:', error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get all keys from localStorage
   */
  keys() {
    return Object.keys(localStorage);
  },

  /**
   * Get item from sessionStorage
   */
  session: {
    get(key, defaultValue = null) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error getting from sessionStorage:', error);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error setting sessionStorage:', error);
        return false;
      }
    },

    remove(key) {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
        return false;
      }
    },

    clear() {
      try {
        sessionStorage.clear();
        return true;
      } catch (error) {
        console.error('Error clearing sessionStorage:', error);
        return false;
      }
    },

    has(key) {
      return sessionStorage.getItem(key) !== null;
    }
  },

  /**
   * Store with expiration
   */
  setWithExpiry(key, value, ttlMs) {
    const item = {
      value: value,
      expiry: Date.now() + ttlMs
    };
    return this.set(key, item);
  },

  /**
   * Get with expiration check
   */
  getWithExpiry(key, defaultValue = null) {
    const item = this.get(key);
    if (!item) return defaultValue;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.remove(key);
      return defaultValue;
    }
    
    return item.value !== undefined ? item.value : defaultValue;
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storage;
}

// Export to window for global access
window.storage = storage;
