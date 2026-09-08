/**
 * PriceLens Frontend API Service (Mock Stub)
 * 
 * IMPORTANT FOR BACKEND INTEGRATION:
 * When connecting a real backend server (FastAPI, Node, Express, Django, etc.),
 * update these stub methods to invoke real endpoints (e.g. using fetch or axios).
 * The UI forms and AuthContext consume this service directly.
 */

const MOCK_LATENCY = 800; // Simulated network delay in ms
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiService = {
  /**
   * Compare product prices across all enabled stores (Amazon, Flipkart, Croma, Reliance Digital)
   * @param {string} productId - e.g. 'iphone-16-128', 'macbook-air-m3'
   * @returns {Promise<Object>}
   */
  async compareProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/compare/${productId}`);
      if (!response.ok) {
        throw new Error(`Comparison API returned status ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.warn('[apiService] Backend comparison failed, using fallback:', err.message);
      throw err;
    }
  },

  /**
   * Search for products and compare offers in real-time across stores
   * @param {string} query - e.g. 'iphone', 'laptop', 'sony headphones'
   * @returns {Promise<Object>}
   */
  async compareQuery(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/compare?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Search API returned status ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.warn('[apiService] Backend search compare failed:', err.message);
      throw err;
    }
  },

  /**
   * List all enabled store adapters
   * @returns {Promise<Array>}
   */
  async getStores() {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/compare/stores`);
      if (!response.ok) throw new Error('Failed to load stores');
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.warn('[apiService] Backend getStores failed:', err.message);
      return [];
    }
  },

  /**
   * Retrieve historical price snapshots & analytics for a product
   * @param {string} productId
   * @param {string} timeline - '7D' | '30D' | '3M' | '6M'
   * @returns {Promise<Object>}
   */
  async getPriceHistory(productId, timeline = '30D') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/price-history/${encodeURIComponent(productId)}?timeline=${encodeURIComponent(timeline)}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Price History API returned status ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.warn('[apiService] getPriceHistory error, using fallback:', err.message);
      throw err;
    }
  },

  /**
   * Mock Login Request
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} user data and mock token
   */
  async login({ email, password, rememberMe }) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY));

    // Basic frontend verification logic
    if (!email || !password) {
      throw new Error('Email and Password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Mock successful authentication response
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase(),
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').toUpperCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      rememberMe: Boolean(rememberMe)
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    return {
      success: true,
      user: mockUser,
      token: mockToken,
      message: 'Login successful!'
    };
  },

  /**
   * Mock Sign Up Request
   * @param {Object} userData - { fullName, email, password }
   * @returns {Promise<Object>}
   */
  async signup({ fullName, email, password }) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY));

    if (!fullName || !email || !password) {
      throw new Error('All fields are required.');
    }

    return {
      success: true,
      user: {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email.toLowerCase(),
        name: fullName,
      },
      token: 'mock_jwt_token_' + Date.now(),
      message: 'Account created successfully!'
    };
  },

  /**
   * Mock Password Reset Request
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async resetPassword(email) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY));

    if (!email) {
      throw new Error('Please enter a valid email address.');
    }

    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}`
    };
  }
};

