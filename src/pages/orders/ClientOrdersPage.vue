<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Header -->
    <AppHeader 
      title="طلباتي" 
      subtitle="إدارة وتتبع جميع طلبات الخدمات"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-xl text-gray-600">جاري تحميل الطلبات...</p>
      </div>

      <!-- Orders Grid -->
      <div v-else-if="orders.length" class="space-y-6">
        <!-- Filter Tabs -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex space-x-4 space-x-reverse overflow-x-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap',
                activeTab === tab.key 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ tab.label }} ({{ getOrdersCount(tab.key) }})
            </button>
          </div>
        </div>

        <!-- Orders -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id" 
            class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
          >
            <!-- Order Header -->
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span class="font-bold text-sm">{{ getStatusText(order.status) }}</span>
                </div>
                <span class="text-sm bg-white/20 px-3 py-1 rounded-full">
                  #{{ order.id }}
                </span>
              </div>
            </div>

            <!-- Order Content -->
            <div class="p-6">
              <!-- Service Image and Title -->
              <div class="flex items-start space-x-4 space-x-reverse mb-4">
                <div class="flex-shrink-0">
                  <img 
                    v-if="order.service?.image_url" 
                    :src="order.service.image_url" 
                    :alt="order.service.title" 
                    class="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                    @error="handleImageError"
                  />
                  <div v-else class="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {{ order.service?.title || 'خدمة غير محددة' }}
                  </h3>
                  <div class="flex items-center text-primary-600 font-bold text-lg">
                    <span>{{ order.service?.price || '0.00' }}</span>
                    <span class="text-sm mr-1">د.ل</span>
                  </div>
                </div>
              </div>

              <!-- Order Details -->
              <div class="space-y-3 mb-6">
                <!-- Status Badge -->
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                  <span class="text-gray-700 font-medium">حالة الطلب:</span>
                  <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-sm font-bold">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>

                <!-- Notes -->
                <div v-if="order.notes" class="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div class="flex items-start space-x-2 space-x-reverse">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                    </svg>
                    <div>
                      <span class="text-blue-800 font-medium text-sm">ملاحظاتك:</span>
                      <p class="text-blue-700 text-sm mt-1">{{ order.notes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Order Date -->
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>تاريخ الطلب:</span>
                  <span class="font-medium">{{ formatDate(order.created_at) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex space-x-3 space-x-reverse">
                <button 
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  :disabled="cancellingOrderId === order.id"
                  class="flex-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="cancellingOrderId === order.id" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>{{ cancellingOrderId === order.id ? 'جاري الإلغاء...' : 'إلغاء الطلب' }}</span>
                </button>
                
                <!-- في ملف الطلبات الحالي - تحديث زر التفاصيل -->
              <button 
                @click="viewOrderDetails(order.id)"
                class="flex-1 bg-primary-600 text-white hover:bg-primary-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>تفاصيل</span>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">لا توجد طلبات</h3>
            <p class="text-gray-600 mb-6">لم تقم بأي طلبات حتى الآن. ابدأ باستكشاف الخدمات المتاحة.</p>
            <router-link to="/services" class="btn-primary inline-flex items-center space-x-2 space-x-reverse text-lg px-8 py-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span>استعرض الخدمات</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="errorMessage && !loading" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-red-800 mb-2">حدث خطأ</h3>
          <p class="text-red-700">{{ errorMessage }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const orders = ref([])
const loading = ref(true)
const errorMessage = ref('')
const cancellingOrderId = ref(null)
const activeTab = ref('all')
const auth = useAuthStore()
const router = useRouter()

const tabs = [
  { key: 'all', label: 'جميع الطلبات' },
  { key: 'pending', label: 'قيد الانتظار' },
  { key: 'completed', label: 'مكتملة' },
  { key: 'cancelled', label: 'ملغاة' }
]

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeTab.value)
})

const getOrdersCount = (status) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

const getStatusBadgeClass = (status) => {
  switch(status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status) => {
  switch(status) {
    case 'completed': return 'text-green-600'
    case 'pending': return 'text-yellow-600'
    case 'cancelled': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 'completed': return 'مكتمل'
    case 'pending': return 'قيد الانتظار'
    case 'cancelled': return 'ملغي'
    default: return status
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const viewOrderDetails = (orderId) => {
  router.push(`/orders/${orderId}`)
}

const handleImageError = (event) => {
  const target = event.target
  target.style.display = 'none'
  const nextSibling = target.nextElementSibling
  if (nextSibling) {
    nextSibling.style.display = 'flex'
  }
}

const cancelOrder = async (orderId) => {
  if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return
  
  cancellingOrderId.value = orderId
  try {
    await api.delete(`/client/orders/${orderId}`)
    
    // تحديث حالة الطلب محلياً
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
    }
    
    // إشعار بنجاح الإلغاء
    alert('تم إلغاء الطلب بنجاح')
  } catch (error) {
    console.error('فشل إلغاء الطلب:', error)
    alert('فشل إلغاء الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    cancellingOrderId.value = null
  }
}

onMounted(async () => {
  try {
    if (!auth.isAuthenticated) {
      errorMessage.value = 'يجب تسجيل الدخول لعرض الطلبات'
      router.push('/login')
      return
    }

    if (!auth.user?.id) {
      errorMessage.value = 'بيانات المستخدم غير متوفرة'
      return
    }

    const response = await api.get('/client/orders')
    orders.value = response.data
    console.log('الطلبات المحملة:', orders.value)
    
  } catch (error) {
    console.error('فشل جلب الطلبات:', error)
    if (error.response?.status === 401) {
      errorMessage.value = 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى'
      auth.logout()
      router.push('/login')
    } else if (error.response?.status === 403) {
      errorMessage.value = 'غير مسموح لك بالوصول إلى هذه الصفحة'
    } else {
      errorMessage.value = 'حدث خطأ أثناء تحميل الطلبات'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>