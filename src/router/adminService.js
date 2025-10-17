import api from './api'

export const adminService = {
  // إدارة المستخدمين
  getUsers() {
    return api.get('/admin/users')
  },

  getUser(id) {
    return api.get(`/admin/users/${id}`)
  },

  updateUser(id, userData) {
    return api.put(`/admin/users/${id}`, userData)
  },

  deleteUser(id) {
    return api.delete(`/admin/users/${id}`)
  },

  // ... الدوال الأخرى
}