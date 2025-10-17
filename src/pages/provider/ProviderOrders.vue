<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="طلبات العملاء" 
      subtitle="إدارة ومتابعة طلبات العملاء"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </template>

      <template #actions>
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- إحصائيات سريعة -->
          <div class="hidden md:flex items-center space-x-4 space-x-reverse text-sm">
            <div class="flex items-center space-x-1 space-x-reverse">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-gray-600">قيد الانتظار ({{ pendingCount }})</span>
            </div>
            <div class="flex items-center space-x-1 space-x-reverse">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-gray-600">مقبولة ({{ acceptedCount }})</span>
            </div>
            <div class="flex items-center space-x-1 space-x-reverse">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-gray-600">مكتملة ({{ completedCount }})</span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- فلاتر الطلبات -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- أزرار التصفية -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ tab.label }} ({{ getOrdersCount(tab.key) }})
            </button>
          </div>

          <!-- البحث والترتيب -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="ابحث في الطلبات..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
              >
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
      </div>

      <!-- قائمة الطلبات -->
      <div v-else class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <!-- معلومات الطلب -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">
                      {{ order.service.title }}
                    </h3>
                    <p class="text-gray-600 text-sm">
                      من <span class="font-medium">{{ order.client.name }}</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-primary-600">{{ order.service.price }} ر.س</p>
                    <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
                  </div>
                </div>

                <!-- معلومات إضافية -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>العميل: {{ order.client.name }}</span>
                  </div>
                  <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span>التصنيف: {{ order.service.category }}</span>
                  </div>
                </div>

                <!-- ملاحظات العميل -->
                <div v-if="order.notes" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div class="flex items-start space-x-2 space-x-reverse">
                    <svg class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                    </svg>
                    <div>
                      <span class="text-blue-800 font-medium text-sm">ملاحظات العميل:</span>
                      <p class="text-blue-700 text-sm mt-1">{{ order.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- الحالة والإجراءات -->
              <div class="lg:w-48 flex flex-col space-y-3">
                <!-- حالة الطلب -->
                <div class="flex justify-between items-center">
                  <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-sm font-bold">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>

                <!-- الإجراءات -->
                <div class="flex flex-col space-y-2">
                  <router-link
                    :to="`/provider/orders/${order.id}`"
                    class="btn-secondary text-center text-sm py-2"
                  >
                    عرض التفاصيل
                  </router-link>
                  
                  <!-- حالة قيد الانتظار -->
                  <div v-if="order.status === 'pending'" class="flex space-x-2 space-x-reverse">
                    <button
                      @click="acceptOrder(order.id)"
                      :disabled="updatingOrder === order.id"
                      class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-1 space-x-reverse"
                    >
                      <svg v-if="updatingOrder === order.id" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>قبول</span>
                    </button>
                    <button
                      @click="rejectOrder(order.id)"
                      :disabled="updatingOrder === order.id"
                      class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-1 space-x-reverse"
                    >
                      <svg v-if="updatingOrder === order.id" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span>رفض</span>
                    </button>
                  </div>

                  <!-- حالة مقبولة -->
                  <div v-if="order.status === 'accepted'" class="flex space-x-2 space-x-reverse">
                    <button
                      @click="completeOrder(order.id)"
                      :disabled="updatingOrder === order.id"
                      class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-1 space-x-reverse"
                    >
                      <svg v-if="updatingOrder === order.id" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>إكمال</span>
                    </button>
                    <button
                      @click="cancelOrder(order.id)"
                      :disabled="updatingOrder === order.id"
                      class="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-1 space-x-reverse"
                    >
                      <svg v-if="updatingOrder === order.id" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span>إلغاء</span>
                    </button>
                  </div>

                  <!-- حالة مكتملة أو مرفوضة -->
                  <div v-if="['completed', 'rejected', 'cancelled'].includes(order.status)" class="text-center">
                    <span class="text-sm text-gray-500">لا توجد إجراءات متاحة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود طلبات -->
      <div v-if="!loading && filteredOrders.length === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">لا توجد طلبات</h3>
          <p class="text-gray-600 mb-6" v-if="activeTab === 'all'">
            لم تتلق أي طلبات حتى الآن.
          </p>
          <p class="text-gray-600 mb-6" v-else>
            لا توجد طلبات تطابق معايير البحث.
          </p>
          <button
            @click="resetFilters"
            class="btn-primary"
          >
            عرض جميع الطلبات
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const orders = ref([])
const loading = ref(true)
const updatingOrder = ref(null)

const tabs = [
  { key: 'all', label: 'جميع الطلبات' },
  { key: 'pending', label: 'قيد الانتظار' },
  { key: 'accepted', label: 'مقبولة' },
  { key: 'completed', label: 'مكتملة' },
  { key: 'cancelled', label: 'ملغاة' },
  { key: 'rejected', label: 'مرفوضة' }
]

const filters = reactive({
  search: '',
  status: 'all'
})

const activeTab = ref('all')

// جلب الطلبات
onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  try {
    const response = await providerService.getOrders()
    orders.value = response.data
    console.log('الطلبات المحملة:', orders.value)
  } catch (error) {
    console.error('فشل جلب الطلبات:', error)
    alert('فشل تحميل الطلبات. يرجى المحاولة مرة أخرى.')
  } finally {
    loading.value = false
  }
}

// الطلبات المصفاة
const filteredOrders = computed(() => {
  let filtered = orders.value

  // التصفية حسب الحالة
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeTab.value)
  }

  // البحث
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.service?.title?.toLowerCase().includes(searchTerm) ||
      order.client?.name?.toLowerCase().includes(searchTerm) ||
      order.notes?.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
})

// الإحصائيات
const pendingCount = computed(() => orders.value.filter(order => order.status === 'pending').length)
const acceptedCount = computed(() => orders.value.filter(order => order.status === 'accepted').length)
const completedCount = computed(() => orders.value.filter(order => order.status === 'completed').length)

const getOrdersCount = (status) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

// دوال المساعدة
const getStatusBadgeClass = (status) => {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'accepted': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'rejected': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'قيد الانتظار'
    case 'accepted': return 'مقبولة'
    case 'completed': return 'مكتملة'
    case 'cancelled': return 'ملغاة'
    case 'rejected': return 'مرفوضة'
    default: return status
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// دوال تحديث حالة الطلب
const acceptOrder = async (orderId) => {
  if (!confirm('هل أنت متأكد من قبول هذا الطلب؟')) return

  updatingOrder.value = orderId
  
  try {
    await providerService.acceptOrder(orderId)
    
    // تحديث الحالة محلياً
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'accepted'
      orders.value[orderIndex].updated_at = new Date().toISOString()
    }
    
    console.log('تم قبول الطلب بنجاح')
    
  } catch (error) {
    console.error('فشل قبول الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل قبول الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updatingOrder.value = null
  }
}

const rejectOrder = async (orderId) => {
  if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return

  updatingOrder.value = orderId
  
  try {
    await providerService.rejectOrder(orderId)
    
    // تحديث الحالة محلياً
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'rejected'
      orders.value[orderIndex].updated_at = new Date().toISOString()
    }
    
    console.log('تم رفض الطلب بنجاح')
    
  } catch (error) {
    console.error('فشل رفض الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل رفض الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updatingOrder.value = null
  }
}

const completeOrder = async (orderId) => {
  if (!confirm('هل أنت متأكد من إكمال هذا الطلب؟')) return

  updatingOrder.value = orderId
  
  try {
    await providerService.completeOrder(orderId)
    
    // تحديث الحالة محلياً
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'completed'
      orders.value[orderIndex].updated_at = new Date().toISOString()
    }
    
    console.log('تم إكمال الطلب بنجاح')
    
  } catch (error) {
    console.error('فشل إكمال الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل إكمال الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updatingOrder.value = null
  }
}

const cancelOrder = async (orderId) => {
  if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return

  updatingOrder.value = orderId
  
  try {
    await providerService.cancelOrder(orderId)
    
    // تحديث الحالة محلياً
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
      orders.value[orderIndex].updated_at = new Date().toISOString()
    }
    
    console.log('تم إلغاء الطلب بنجاح')
    
  } catch (error) {
    console.error('فشل إلغاء الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل إلغاء الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updatingOrder.value = null
  }
}

const resetFilters = () => {
  activeTab.value = 'all'
  filters.search = ''
}
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>