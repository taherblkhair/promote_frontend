import api from './api'

export const providerService = {
  // لوحة التحكم
  getDashboard() {
    return api.get('/provider/dashboard')
  },

  // الخدمات
  getServices() {
    return api.get('/provider/services')
  },

  getService(id) {
    return api.get(`/provider/services/${id}`)
  },

 createService(serviceData) {
  return api.post('/provider/services', serviceData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
},

  // تحديث خدمة - استخدام PUT مباشرة
  updateService(id, data) {
    return api.put(`/provider/services/${id}`, data, {  
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })      
    },


  deleteService(id) {
    return api.delete(`/provider/services/${id}`)
  }
}