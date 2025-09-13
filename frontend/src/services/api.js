import axios from 'axios'
import useAuthStore from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendOTP: (email) => api.post('/auth/resend-otp', email),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  refreshToken: () => api.post('/auth/refresh'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
}

// Properties API
export const propertiesAPI = {
  getProperties: (params) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (propertyData) => api.post('/properties', propertyData),
  updateProperty: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  searchProperties: (searchParams) => api.get('/properties/search', { params: searchParams }),
  getFeaturedProperties: () => api.get('/properties/featured'),
  generateDescription: (propertyData) => api.post('/properties/generate-description', propertyData),
}

// Applications API
export const applicationsAPI = {
  submitApplication: (applicationData) => api.post('/applications', applicationData),
  getApplications: (params) => api.get('/applications', { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getAIScreening: (id) => api.get(`/applications/${id}/ai-screening`),
}

// Payments API
export const paymentsAPI = {
  createPayment: (paymentData) => api.post('/payments', paymentData),
  getPayments: (params) => api.get('/payments', { params }),
  getPayment: (id) => api.get(`/payments/${id}`),
  generateReceipt: (paymentId) => api.get(`/payments/${paymentId}/receipt`),
  processRefund: (paymentId, amount) => api.post(`/payments/${paymentId}/refund`, { amount }),
}

// Maintenance API
export const maintenanceAPI = {
  createRequest: (requestData) => api.post('/maintenance', requestData),
  getRequests: (params) => api.get('/maintenance', { params }),
  getRequest: (id) => api.get(`/maintenance/${id}`),
  updateRequest: (id, updateData) => api.put(`/maintenance/${id}`, updateData),
  assignServiceProvider: (id, providerId) => api.post(`/maintenance/${id}/assign`, { providerId }),
}

// Leases API
export const leasesAPI = {
  createLease: (leaseData) => api.post('/leases', leaseData),
  getLeases: (params) => api.get('/leases', { params }),
  getLease: (id) => api.get(`/leases/${id}`),
  generateLease: (applicationId) => api.post(`/leases/generate/${applicationId}`),
  signLease: (id, signature) => api.post(`/leases/${id}/sign`, { signature }),
  terminateLease: (id, reason) => api.post(`/leases/${id}/terminate`, { reason }),
}

// AI Services API
export const aiAPI = {
  generatePropertyDescription: (propertyData) => api.post('/ai/generate-description', propertyData),
  screenTenant: (applicationData) => api.post('/ai/screen-tenant', applicationData),
  generateLease: (leaseData) => api.post('/ai/generate-lease', leaseData),
  explainClause: (clause) => api.post('/ai/explain-clause', { clause }),
  suggestRent: (propertyData) => api.post('/ai/suggest-rent', propertyData),
}

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadDocument: (file) => {
    const formData = new FormData()
    formData.append('document', file)
    return api.post('/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export default api