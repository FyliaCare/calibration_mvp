/**
 * Simple SPA Router
 * Handles hash-based routing for single-page application
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.beforeHooks = [];
    this.afterHooks = [];
    
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., 'dashboard', 'worksheets')
   * @param {Function} handler - Route handler function
   */
  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  /**
   * Register multiple routes at once
   * @param {Object} routes - Object with path: handler pairs
   */
  registerMultiple(routes) {
    Object.entries(routes).forEach(([path, handler]) => {
      this.register(path, handler);
    });
    return this;
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {boolean} replace - Whether to replace history instead of push
   */
  navigate(path, replace = false) {
    const hash = `#${path}`;
    if (replace) {
      window.location.replace(hash);
    } else {
      window.location.hash = hash;
    }
  }

  /**
   * Get current route path
   * @returns {string} Current route path
   */
  getCurrentPath() {
    return window.location.hash.slice(1) || 'dashboard';
  }

  /**
   * Handle route change
   */
  async handleRoute() {
    const path = this.getCurrentPath();
    
    // Run before hooks
    for (const hook of this.beforeHooks) {
      const result = await hook(path, this.currentRoute);
      if (result === false) {
        // Hook prevented navigation
        return;
      }
    }

    // Find and execute route handler
    const handler = this.routes.get(path) || this.routes.get('*');
    
    if (handler) {
      try {
        await handler(path);
        this.currentRoute = path;
        
        // Run after hooks
        for (const hook of this.afterHooks) {
          await hook(path);
        }
      } catch (error) {
        console.error(`Route error for ${path}:`, error);
        this.handleError(error, path);
      }
    } else {
      console.warn(`No route handler for: ${path}`);
      this.navigate('dashboard');
    }
  }

  /**
   * Add before navigation hook
   * @param {Function} hook - Hook function (path, from) => boolean
   */
  beforeEach(hook) {
    this.beforeHooks.push(hook);
    return this;
  }

  /**
   * Add after navigation hook
   * @param {Function} hook - Hook function (path) => void
   */
  afterEach(hook) {
    this.afterHooks.push(hook);
    return this;
  }

  /**
   * Handle routing errors
   * @param {Error} error - The error that occurred
   * @param {string} path - The route that caused the error
   */
  handleError(error, path) {
    console.error(`Routing error:`, error);
    // Could show error page or notification
    if (window.showNotification) {
      window.showNotification(`Failed to load page: ${path}`, 'error');
    }
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  forward() {
    window.history.forward();
  }
}

// Export singleton
window.router = new Router();
window.Router = Router;
