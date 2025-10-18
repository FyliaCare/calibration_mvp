/**
 * API Client - Handles all HTTP requests
 * Provides authentication, error handling, and mock responses
 */

class APIClient {
  constructor() {
    this.baseURL = APP_CONFIG.API_BASE_URL;
    this.isDemoMode = APP_CONFIG.IS_DEMO_MODE;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get authentication token
   * @returns {string|null} Auth token
   */
  getAuthToken() {
    return localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
  }

  /**
   * Get request headers with authentication
   * @returns {Object} Headers object
   */
  getHeaders() {
    const headers = { ...this.defaultHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Make HTTP request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    // Demo mode - return mock data
    if (this.isDemoMode) {
      return this.getMockResponse(endpoint, options.method || 'GET');
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // Return JSON if possible
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error(`API request failed:`, error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Handle unauthorized access
   */
  handleUnauthorized() {
    localStorage.removeItem(APP_CONFIG.AUTH_TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_DATA_KEY);
    window.location.href = '/login.html';
  }

  /**
   * Get mock API response for demo mode
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @returns {Promise<any>} Mock response
   */
  async getMockResponse(endpoint, method) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock responses based on endpoint
    if (endpoint.includes('/worksheets')) {
      return {
        success: true,
        data: [
          { id: 1, type: 'Pressure', customer: 'Ghana Oil Company', status: 'In Progress', date: '2025-10-15' },
          { id: 2, type: 'Temperature', customer: 'Sinopec Ghana', status: 'Completed', date: '2025-10-14' },
          { id: 3, type: 'Dimensional', customer: 'Tullow Oil', status: 'Draft', date: '2025-10-13' }
        ],
        total: 3
      };
    }

    if (endpoint.includes('/certificates')) {
      return {
        success: true,
        data: [
          { id: 1, certNo: 'P-2025-001', customer: 'Ghana Oil Company', status: 'Issued', date: '2025-10-10' },
          { id: 2, certNo: 'T-2025-002', customer: 'Sinopec Ghana', status: 'Approved', date: '2025-10-08' }
        ],
        total: 2
      };
    }

    if (endpoint.includes('/dashboard/stats')) {
      return {
        success: true,
        data: {
          todayCount: 5,
          weeklyCount: 23,
          overdueCount: 2,
          completedToday: 3
        }
      };
    }

    // Default mock response
    return {
      success: true,
      message: 'Mock API response',
      data: null
    };
  }
}

// Export singleton
window.apiClient = new APIClient();
window.APIClient = APIClient;
