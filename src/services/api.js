import axios from 'axios'

// تكوين Axins الأساسي
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor لمعالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api