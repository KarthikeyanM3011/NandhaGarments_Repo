import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { api };

// API endpoints
export const authAPI = {
  businessLogin: (credentials) => api.post('/auth/business/login', credentials),
  individualLogin: (credentials) => api.post('/auth/individual/login', credentials),
  superAdminLogin: (credentials) => api.post('/auth/superadmin/login', credentials),
  businessSignup: (userData) => api.post('/auth/business/signup', userData),
  individualSignup: (userData) => api.post('/auth/individual/signup', userData),
};

export const businessAPI = {
  getDashboard: () => api.get('/business/dashboard'),
  getMeasurements: () => api.get('/business/measurements'),
  addMeasurement: (data) => api.post('/business/measurements', data),
  updateMeasurement: (id, data) => api.put(`/business/measurements/${id}`, data),
  deleteMeasurement: (id) => api.delete(`/business/measurements/${id}`),
  getOrders: () => api.get('/business/orders'),
  createOrder: (data) => api.post('/business/orders', data),
};

export const individualAPI = {
  getDashboard: () => api.get('/individual/dashboard'),
  getMeasurements: () => api.get('/individual/measurements'),
  addMeasurement: (data) => api.post('/individual/measurements', data),
  updateMeasurement: (id, data) => api.put(`/individual/measurements/${id}`, data),
  deleteMeasurement: (id) => api.delete(`/individual/measurements/${id}`),
  getOrders: () => api.get('/individual/orders'),
  createOrder: (data) => api.post('/individual/orders', data),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Cart management
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
  
};

export const superAdminAPI = {
  getDashboard: () => api.get('/superadmin/dashboard'),
  getUsers: (type) => api.get(`/superadmin/users/${type}`),
  approveUser: (id) => api.put(`/superadmin/users/${id}/approve`),
  blockUser: (id) => api.put(`/superadmin/users/${id}/block`),
  unblockUser: (id) => api.put(`/superadmin/users/${id}/unblock`),
  getProducts: () => api.get('/superadmin/products'),
  addProduct: (data) => api.post('/superadmin/products', data),
  updateProduct: (id, data) => api.put(`/superadmin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/superadmin/products/${id}`),
  getOrders: () => api.get('/superadmin/orders'),
  updateOrderStatus: (id, status) => api.put(`/superadmin/orders/${id}/status`, { status }),
};