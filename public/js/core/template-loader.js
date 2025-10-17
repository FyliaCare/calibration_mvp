/**
 * Template Loader - Dynamically loads HTML templates
 * Enables modular HTML architecture
 */

class TemplateLoader {
  constructor() {
    this.cache = new Map();
    this.basePath = 'views/';
  }

  /**
   * Load a template from a file
   * @param {string} path - Path to template file (relative to views/)
   * @param {boolean} useCache - Whether to use cached version
   * @returns {Promise<string>} Template HTML
   */
  async load(path, useCache = true) {
    // Check cache first
    if (useCache && this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const response = await fetch(`${this.basePath}${path}`);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${path} (${response.status})`);
      }

      const html = await response.text();
      
      // Cache the template
      this.cache.set(path, html);
      
      return html;
    } catch (error) {
      console.error(`Template loading error:`, error);
      return `<div class="error">Failed to load template: ${path}</div>`;
    }
  }

  /**
   * Load multiple templates in parallel
   * @param {string[]} paths - Array of template paths
   * @returns {Promise<Object>} Object with template names as keys
   */
  async loadMultiple(paths) {
    const promises = paths.map(path => this.load(path));
    const results = await Promise.all(promises);
    
    const templates = {};
    paths.forEach((path, index) => {
      const name = path.replace(/\//g, '_').replace('.html', '');
      templates[name] = results[index];
    });
    
    return templates;
  }

  /**
   * Load template and inject into element
   * @param {string} elementId - Target element ID
   * @param {string} templatePath - Template file path
   */
  async loadInto(elementId, templatePath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element not found: ${elementId}`);
      return;
    }

    const html = await this.load(templatePath);
    element.innerHTML = html;
    
    // Dispatch event for initialization
    element.dispatchEvent(new CustomEvent('template-loaded', {
      detail: { path: templatePath }
    }));
  }

  /**
   * Load template and append to element
   * @param {string} elementId - Target element ID
   * @param {string} templatePath - Template file path
   */
  async appendTo(elementId, templatePath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element not found: ${elementId}`);
      return;
    }

    const html = await this.load(templatePath);
    element.insertAdjacentHTML('beforeend', html);
  }

  /**
   * Clear template cache
   * @param {string} path - Specific path to clear, or all if undefined
   */
  clearCache(path = null) {
    if (path) {
      this.cache.delete(path);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Preload templates for faster access
   * @param {string[]} paths - Array of template paths to preload
   */
  async preload(paths) {
    const promises = paths.map(path => this.load(path));
    await Promise.all(promises);
    console.log(`✅ Preloaded ${paths.length} templates`);
  }
}

// Export singleton instance
window.templateLoader = new TemplateLoader();

// Export class for advanced usage
window.TemplateLoader = TemplateLoader;
