import api from './api'

export const servicesService = {
  // الحصول على جميع الخدمات
  getServices(params = {}) {
    return api.get('/services', { params })
  },

  // الحصول على خدمة محددة
  getService(id) {
    return api.get(`/services/${id}`)
  },

  // إنشاء خدمة جديدة (للمزود)
  createService(serviceData) {
    return api.post('/services', serviceData)
  },

  // تحديث خدمة
  updateService(id, serviceData) {
    return api.put(`/services/${id}`, serviceData)
  },

  // حذف خدمة
  deleteService(id) {
    return api.delete(`/services/${id}`)
  },

  // الحصول على خدمات المزود
  getProviderServices() {
    return api.get('/services/provider')
  }
}