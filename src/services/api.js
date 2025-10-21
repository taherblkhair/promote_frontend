// src/api.js (أو أينما يوجد ملف API الخاص بك)
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  // استخدم المتغير البيئي هنا
  baseURL: import.meta.env.VITE_API_URL,
})

// إضافة التوكن تلقائياً للطلبات
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// معالجة الأخطاء تلقائياً
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إذا كان الخطأ 401 (غير مصرح)، تسجيل الخروج
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api