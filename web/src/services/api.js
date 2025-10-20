import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Optionally redirect to login or refresh token
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
