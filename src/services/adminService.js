import api from './api'

export const adminService = {
  // الإحصائيات الرئيسية
  getDashboard() {
    return api.get('/admin/dashboard')
  },

  // التحليلات والرسوم البيانية
  getAnalytics() {
    return api.get('/admin/analytics')
  },

  // إدارة المستخدمين
  getUsers() {
    return api.get('/admin/users')
  },
 
 
  createUser(userData) {
    return api.post('/admin/users', userData , {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

getServices() {
    return api.get('/admin/services')
  },

  updateServiceStatus(id, statusData) {
    return api.put(`/admin/services/${id}/status`, statusData)
  },

  getOrders() {
    return api.get('/admin/orders')
  },

  updateOrderStatus(id, statusData) {
    return api.put(`/admin/orders/${id}/status`, statusData)
  },

  deleteOrder(id) {
    return api.delete(`/admin/orders/${id}`)
  },

  // التقارير
  getOverview(params = {}) {
    return api.get('/admin/overview', { params })
  },

  getOrdersReport(params = {}) {
    return api.get('/admin/reports/orders', { params })
  },

  getUsersReport(params = {}) {
    return api.get('/admin/reports/users', { params })
  },

  getPerformanceReport(params = {}) {
    return api.get('/admin/reports/performance', { params })
  },

  getFinancialReport(params = {}) {
    return api.get('/admin/reports/financial', { params })
  },


  
  getUser(id) {
    return api.get(`/admin/users/${id}`)
  },

  updateUser(id, userData) {
    return api.put(`/admin/users/${id}`, userData)
  },

  deleteUser(id) {
    return api.delete(`/admin/users/${id}`)
  }
  
}