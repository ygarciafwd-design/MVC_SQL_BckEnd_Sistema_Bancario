const BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add token if exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  },

  // Auth methods
  auth: {
    login: (credentials) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  },

  // User methods
  users: {
    getProfile: () => api.request('/users/profile'),
  },

  // Accounts methods
  accounts: {
    getAll: () => api.request('/accounts'),
    getById: (id) => api.request(`/accounts/${id}`),
  },
};
