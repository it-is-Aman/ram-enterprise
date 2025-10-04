import api from './api';

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: (period = 'month') => api.get(`/dashboard/analytics?period=${period}`),
};

// Products APIs
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: (limit = 8) => api.get(`/products/featured?limit=${limit}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories APIs
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Orders APIs
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status, trackingNumber) => 
    api.patch(`/orders/${id}/status`, { status, trackingNumber }),
  cancel: (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }),
};

// Users APIs
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  updateStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }),
  delete: (id) => api.delete(`/users/${id}`),
};

// Inquiries APIs (Product Inquiries in schema)
export const inquiriesAPI = {
  getAll: (params = {}) => api.get('/inquiries', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  getStats: () => api.get('/inquiries/stats'),
  create: (data) => api.post('/inquiries', data),
  updateStatus: (id, status) => api.patch(`/inquiries/${id}/status`, { status }),
  sendResponse: (id, response) => api.patch(`/inquiries/${id}/response`, { response }),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

// Reviews APIs
export const reviewsAPI = {
  getAll: (params = {}) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  getProductReviews: (productId, params = {}) => 
    api.get(`/reviews/product/${productId}`, { params }),
  getStats: (productId) => api.get(`/reviews/product/${productId}/stats`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  updateVerification: (id, isVerified) => api.patch(`/reviews/${id}/verification`, { isVerified }),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Cart APIs
export const cartAPI = {
  get: (userId) => api.get(`/cart/${userId}`),
  addItem: (userId, productId, quantity) => 
    api.post(`/cart/${userId}/items`, { productId, quantity }),
  updateItem: (userId, itemId, quantity) => 
    api.put(`/cart/${userId}/items/${itemId}`, { quantity }),
  removeItem: (userId, itemId) => api.delete(`/cart/${userId}/items/${itemId}`),
  clear: (userId) => api.delete(`/cart/${userId}`),
};

// Wishlist APIs
export const wishlistAPI = {
  get: (userId) => api.get(`/wishlist/${userId}`),
  addItem: (userId, productId) => 
    api.post(`/wishlist/${userId}/items`, { productId }),
  removeItem: (userId, productId) => 
    api.delete(`/wishlist/${userId}/items/${productId}`),
  clear: (userId) => api.delete(`/wishlist/${userId}`),
  checkItem: (userId, productId) => 
    api.get(`/wishlist/${userId}/check/${productId}`),
};

// Upload APIs
export const uploadAPI = {
  uploadProductImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return api.post('/upload/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProductImage: (filename) => api.delete(`/upload/products/${filename}`),
};
