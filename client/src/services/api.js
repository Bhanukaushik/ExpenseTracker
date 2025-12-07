import axios from 'axios';

const API_BASE = 'https://expense-tracker-backend-eosin.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  me: () => api.get('/auth/me'),
};


export const expensesAPI = {
  // CRUD Operations
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  getById: (id) => api.get(`/expenses/${id}`),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  deleteById: (id) => api.delete(`/expenses/${id}`),
  deleteAll: () => api.delete('/expenses'),

  // Search & Filter
  search: (keyword) => api.get('/expenses/search', { params: { keyword } }),
  filter: (params) => api.get('/expenses/filter', { params }),
  sort: (by = 'date') => api.get('/expenses/sort', { params: { by } }),

  // Analytics
  summary: () => api.get('/expenses/summary'),
  statistics: () => api.get('/expenses/statistics'),

  // User-specific (alternative)
  getUserExpenses: (userId) => api.get(`/expenses/users/${userId}/expenses`),
};

export default api;
