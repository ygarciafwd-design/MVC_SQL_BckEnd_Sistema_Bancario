const BASE_URL = '/api';

export const api = {
  /**
   * Generic fetch wrapper.
   * All requests include credentials to send/receive httpOnly cookies.
   */
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',  // Send cookies with every request
      });
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

  // ---- Auth ----
  auth: {
    login: (credentials) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    logout: () => api.request('/auth/logout', { method: 'POST' }),
    getProfile: () => api.request('/auth/profile'),
  },

  // ---- Admin: User Management ----
  admin: {
    getUsers: () => api.request('/admin/users'),
    getUserById: (id) => api.request(`/admin/users/${id}`),
    createUser: (data) => api.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateUserRole: (id, role_id) => api.request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role_id }),
    }),
    updateUserStatus: (id, status) => api.request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
    deleteUser: (id) => api.request(`/admin/users/${id}`, { method: 'DELETE' }),

    // ---- Admin: Role Management ----
    getRoles: () => api.request('/admin/roles'),
    createRole: (data) => api.request('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateRole: (id, data) => api.request(`/admin/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deleteRole: (id) => api.request(`/admin/roles/${id}`, { method: 'DELETE' }),
  },

  // ---- Accounts ----
  accounts: {
    getAll: () => api.request('/accounts'),
    getById: (id) => api.request(`/accounts/${id}`),
  },
};
