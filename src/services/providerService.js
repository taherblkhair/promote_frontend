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

updateService(id, serviceData) {
    return api.post(`/provider/services/${id}`, serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },


  deleteService(id) {
    return api.delete(`/provider/services/${id}`)
  },

  // orders can be added here   
  // ... الدوال السابقة

// الطلبات
getOrders() {
    return api.get('/provider/orders')
  },

  getOrder(id) {
    return api.get(`/provider/orders/${id}`)
  },

  // استخدام PUT مباشرة مع body {status}
  updateOrderStatus(id, status) {
    return api.put(`/provider/orders/${id}`, { status })
  },

  // دوال مساعدة لكل حالة
  acceptOrder(id) {
    return api.put(`/provider/orders/${id}`, { status: 'accepted' })
  },

  rejectOrder(id) {
    return api.put(`/provider/orders/${id}`, { status: 'rejected' })
  },

  completeOrder(id) {
    return api.put(`/provider/orders/${id}`, { status: 'completed' })
  },

  cancelOrder(id) {
    return api.put(`/provider/orders/${id}`, { status: 'cancelled' })
  }
}