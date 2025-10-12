import api from './api'

export const authService = {
  // تسجيل الدخول
  login(credentials) {
    return api.post('/login', credentials)
  },

  // تسجيل الخروج
  logout() {
    return api.get('/logout')
  },

  // الحصول على الملف الشخصي
  getProfile() {
    return api.get('/profile')
  },

  // التسجيل (إذا كان متاحًا في الـ API)
  register(userData) {
    return api.post('/register', userData)
  }
}