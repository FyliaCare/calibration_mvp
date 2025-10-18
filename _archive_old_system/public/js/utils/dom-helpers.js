/**
 * DOM Helpers
 * Utility functions for DOM manipulation
 */

const domHelpers = {
  /**
   * Get element by ID
   */
  $(id) {
    return document.getElementById(id);
  },

  /**
   * Query selector
   */
  qs(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Query selector all
   */
  qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Create element with attributes
   */
  create(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  },

  /**
   * Show element
   */
  show(element, display = 'block') {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.style.display = display;
  },

  /**
   * Hide element
   */
  hide(element) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.style.display = 'none';
  },

  /**
   * Toggle element visibility
   */
  toggle(element, display = 'block') {
    if (typeof element === 'string') element = this.$(element);
    if (!element) return;
    
    if (element.style.display === 'none') {
      this.show(element, display);
    } else {
      this.hide(element);
    }
  },

  /**
   * Add class to element
   */
  addClass(element, ...classes) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.classList.add(...classes);
  },

  /**
   * Remove class from element
   */
  removeClass(element, ...classes) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.classList.remove(...classes);
  },

  /**
   * Toggle class on element
   */
  toggleClass(element, className) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.classList.toggle(className);
  },

  /**
   * Check if element has class
   */
  hasClass(element, className) {
    if (typeof element === 'string') element = this.$(element);
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Set element content
   */
  setContent(element, content) {
    if (typeof element === 'string') element = this.$(element);
    if (!element) return;

    if (typeof content === 'string') {
      element.textContent = content;
    } else if (content instanceof Node) {
      element.innerHTML = '';
      element.appendChild(content);
    }
  },

  /**
   * Set element HTML
   */
  setHTML(element, html) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.innerHTML = html;
  },

  /**
   * Get element value
   */
  getValue(element) {
    if (typeof element === 'string') element = this.$(element);
    if (!element) return '';
    
    if (element.type === 'checkbox') return element.checked;
    if (element.type === 'radio') return element.checked ? element.value : '';
    return element.value || '';
  },

  /**
   * Set element value
   */
  setValue(element, value) {
    if (typeof element === 'string') element = this.$(element);
    if (!element) return;

    if (element.type === 'checkbox') {
      element.checked = !!value;
    } else if (element.type === 'radio') {
      element.checked = (element.value === value);
    } else {
      element.value = value;
    }
  },

  /**
   * Remove element from DOM
   */
  remove(element) {
    if (typeof element === 'string') element = this.$(element);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  /**
   * Empty element (remove all children)
   */
  empty(element) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.innerHTML = '';
  },

  /**
   * Append child to element
   */
  append(parent, child) {
    if (typeof parent === 'string') parent = this.$(parent);
    if (!parent) return;

    if (typeof child === 'string') {
      parent.insertAdjacentHTML('beforeend', child);
    } else if (child instanceof Node) {
      parent.appendChild(child);
    }
  },

  /**
   * Prepend child to element
   */
  prepend(parent, child) {
    if (typeof parent === 'string') parent = this.$(parent);
    if (!parent) return;

    if (typeof child === 'string') {
      parent.insertAdjacentHTML('afterbegin', child);
    } else if (child instanceof Node) {
      parent.insertBefore(child, parent.firstChild);
    }
  },

  /**
   * Add event listener
   */
  on(element, event, handler) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.addEventListener(event, handler);
  },

  /**
   * Remove event listener
   */
  off(element, event, handler) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.removeEventListener(event, handler);
  },

  /**
   * Trigger custom event
   */
  trigger(element, eventName, detail = {}) {
    if (typeof element === 'string') element = this.$(element);
    if (element) {
      const event = new CustomEvent(eventName, { detail });
      element.dispatchEvent(event);
    }
  },

  /**
   * Get element data attribute
   */
  getData(element, key) {
    if (typeof element === 'string') element = this.$(element);
    return element ? element.dataset[key] : undefined;
  },

  /**
   * Set element data attribute
   */
  setData(element, key, value) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.dataset[key] = value;
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = domHelpers;
}

// Export to window for global access
window.domHelpers = domHelpers;
window.$ = domHelpers.$;
