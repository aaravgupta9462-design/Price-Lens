/**
 * PriceLens Frontend API Service (Mock Stub)
 * 
 * IMPORTANT FOR BACKEND INTEGRATION:
 * When connecting a real backend server (FastAPI, Node, Express, Django, etc.),
 * update these stub methods to invoke real endpoints (e.g. using fetch or axios).
 * The UI forms and AuthContext consume this service directly.
 */

const MOCK_LATENCY = 800; // Simulated network delay in ms

export const apiService = {
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
