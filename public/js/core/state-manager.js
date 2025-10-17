/**
 * Simple State Manager
 * Manages application state with reactivity
 */

class StateManager {
  constructor() {
    this.state = {};
    this.listeners = new Map();
  }

  /**
   * Set state value
   * @param {string} key - State key
   * @param {any} value - State value
   * @param {boolean} notify - Whether to notify listeners
   */
  set(key, value, notify = true) {
    const oldValue = this.state[key];
    this.state[key] = value;
    
    if (notify && oldValue !== value) {
      this.notify(key, value, oldValue);
    }
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} State value
   */
  get(key, defaultValue = null) {
    return this.state[key] !== undefined ? this.state[key] : defaultValue;
  }

  /**
   * Update state (merge objects)
   * @param {string} key - State key
   * @param {Object} updates - Updates to merge
   */
  update(key, updates) {
    const current = this.get(key, {});
    this.set(key, { ...current, ...updates });
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Callback function (newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify listeners of state change
   * @param {string} key - State key
   * @param {any} newValue - New value
   * @param {any} oldValue - Old value
   */
  notify(key, newValue, oldValue) {
    const callbacks = this.listeners.get(key) || [];
    callbacks.forEach(callback => {
      try {
        callback(newValue, oldValue);
      } catch (error) {
        console.error(`State listener error for "${key}":`, error);
      }
    });
  }

  /**
   * Remove state value
   * @param {string} key - State key
   */
  remove(key) {
    delete this.state[key];
    this.notify(key, undefined, this.state[key]);
  }

  /**
   * Clear all state
   */
  clear() {
    Object.keys(this.state).forEach(key => this.remove(key));
  }

  /**
   * Get all state
   * @returns {Object} Complete state object
   */
  getAll() {
    return { ...this.state };
  }
}

// Export singleton
window.appState = new StateManager();
window.StateManager = StateManager;
