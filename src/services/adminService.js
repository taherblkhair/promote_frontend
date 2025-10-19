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