import api from './api'

// في ملف providerService.js


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
  // سجل الطلبات
getOrderActivities(orderId) {
    return api.get(`/provider/orders/${orderId}/activities`)
},


 openChat: (orderId) => {
    return api.post(`/chats/open/${orderId}`);
  },
  getChatMessages: (chatId) => {
    return api.get(`/chats/${chatId}/messages`);
  },
  sendMessage: (chatId, messagePayload) => {
    return api.post(`/chats/${chatId}/messages`, messagePayload);
  },
  markChatAsRead: (chatId) => {
    return api.post(`/chats/${chatId}/read`);
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
  },


  // معرض الأعمال
  getPortfolio(page = 1) {
    return api.get('/provider/my-portfolio', {
      params: { page }
    })
  },
  addPortfolioItem(data) {
    return api.post('/provider/items', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  

  

  
  deletePortfolioItem(id) {
    return api.delete(`/provider/portfolio/${id}`)
  }
}