import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryService = {
  getAll: (params) => api.get('/categories', { params }),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const basketService = {
  getAll: (params) => api.get('/baskets', { params }),
  getOne: (id) => api.get(`/baskets/${id}`),
  create: (data) => api.post('/baskets', data),
  update: (id, data) => api.put(`/baskets/${id}`, data),
  delete: (id) => api.delete(`/baskets/${id}`),
};

export const orderService = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getOne: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const trialService = {
  submit:          (data)        => api.post('/trial-requests', data),
  checkByMobile:   (mobile)      => api.get('/trial-requests/check', { params: { mobile } }),
  getAll:          (params)      => api.get('/trial-requests', { params }),
  getOne:          (id)          => api.get(`/trial-requests/${id}`),
  updateStatus:    (id, data)    => api.put(`/trial-requests/${id}/status`, data),
  delete:          (id)          => api.delete(`/trial-requests/${id}`),
};

export const growthService = {
  checkServiceability: (params)  => api.get('/growth/serviceability', { params }),
  joinWaitlist:        (data)    => api.post('/growth/waitlist', data),
  getAnalytics:        ()        => api.get('/growth/analytics'),
  getServiceAreas:     ()        => api.get('/growth/service-areas'),
  addServiceArea:      (data)    => api.post('/growth/service-areas', data),
  updateServiceArea:   (id, data)=> api.put(`/growth/service-areas/${id}`, data),
  deleteServiceArea:   (id)      => api.delete(`/growth/service-areas/${id}`),
  getWaitlist:         (params)  => api.get('/growth/waitlist', { params }),
  notifyWaitlistArea:  (area)    => api.post(`/growth/waitlist/notify/${encodeURIComponent(area)}`),
};

export const subscriptionService = {
  getPlans: () => api.get('/subscriptions/plans'),
  getAllPlans: () => api.get('/subscriptions/plans/all'),
  subscribe: (data) => api.post('/subscriptions', data),
  getMySubscriptions: () => api.get('/subscriptions/my'),
  pause: (id) => api.put(`/subscriptions/${id}/pause`),
  resume: (id) => api.put(`/subscriptions/${id}/resume`),
  cancel: (id) => api.put(`/subscriptions/${id}/cancel`),
  getAll: (params) => api.get('/subscriptions', { params }),
  createPlan: (data) => api.post('/subscriptions/plans', data),
  updatePlan: (id, data) => api.put(`/subscriptions/plans/${id}`, data),
};

export const deliveryService = {
  getAll: (params) => api.get('/deliveries', { params }),
  update: (id, data) => api.put(`/deliveries/${id}`, data),
};

export const reviewService = {
  getApproved: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
  getAll: () => api.get('/reviews/all'),
  approve: (id, data) => api.put(`/reviews/${id}/approve`, data),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getCustomers: (params) => api.get('/admin/customers', { params }),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};
