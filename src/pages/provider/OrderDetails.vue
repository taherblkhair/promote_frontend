<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      :title="`طلب #${orderData.id}`" 
      subtitle="تفاصيل الطلب ومعلومات العميل"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </template>

      <template #actions>
        <router-link to="/provider/orders" class="btn-secondary flex items-center space-x-2 space-x-reverse">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>العودة للطلبات</span>
        </router-link>
      </template>
    </AppHeader>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- العمود الأيسر: معلومات الطلب -->
        <div class="lg:col-span-2 space-y-6">
          <!-- بطاقة الخدمة -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h3 class="text-xl font-bold text-white">معلومات الخدمة</h3>
            </div>
            <div class="p-6">
              <div class="flex flex-col md:flex-row gap-6">
                <!-- صورة الخدمة -->
                <div class="flex-shrink-0">
                  <img
                    v-if="orderData.service?.image"
                    :src="orderData.service.image"
                    :alt="orderData.service.title"
                    class="w-32 h-32 object-cover rounded-lg"
                  />
                  <div
                    v-else
                    class="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center"
                  >
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>

                <!-- تفاصيل الخدمة -->
                <div class="flex-1">
                  <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ orderData.service.title }}</h4>
                  <p class="text-gray-600 mb-4">{{ orderData.service.description }}</p>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">التصنيف:</span>
                      <span class="font-medium text-gray-900 mr-2">{{ orderData.service.category }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">السعر:</span>
                      <span class="text-2xl font-bold text-primary-600 mr-2">{{ orderData.service.price }} ر.س</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- معلومات الطلب -->
          <div class="bg-white rounded-2xl shadow-lg">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 class="text-xl font-bold text-white">تفاصيل الطلب</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-bold text-gray-900 mb-3">معلومات الطلب</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">رقم الطلب:</span>
                      <span class="font-medium">#{{ orderData.id }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">تاريخ الطلب:</span>
                      <span class="font-medium">{{ formatDateTime(orderData.created_at) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">آخر تحديث:</span>
                      <span class="font-medium">{{ formatDateTime(orderData.updated_at) }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="font-bold text-gray-900 mb-3">حالة الطلب</h4>
                  <div class="flex items-center justify-between mb-4">
                    <span :class="getStatusBadgeClass(orderData.status)" class="px-4 py-2 rounded-full text-lg font-bold">
                      {{ getStatusText(orderData.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- ملاحظات العميل -->
              <div v-if="orderData.notes" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 class="font-bold text-blue-900 mb-2">ملاحظات العميل:</h5>
                <p class="text-blue-800">{{ orderData.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن: المعلومات الجانبية -->
        <div class="space-y-6">
          <!-- معلومات العميل -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">معلومات العميل</h3>
            <div class="flex items-center space-x-3 space-x-reverse mb-4">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-bold text-lg">
                  {{ getInitials(orderData.client?.name) }}
                </span>
              </div>
              <div>
                <p class="font-bold text-gray-900 text-lg">{{ orderData.client?.name }}</p>
                <p class="text-gray-600">{{ orderData.client?.email }}</p>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">رقم العضوية:</span>
                <span class="font-medium">#{{ orderData.client?.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الحالة:</span>
                <span class="font-medium text-green-600">نشط</span>
              </div>
            </div>
          </div>

          <!-- الإجراءات -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">إدارة الطلب</h3>
            <div class="space-y-3">
              <!-- حالة قيد الانتظار -->
              <!-- حالة قيد الانتظار -->
<div v-if="orderData.status === 'pending'" class="space-y-2">
  <button
    @click="acceptOrder"
    :disabled="updating"
    class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse"
  >
    <svg v-if="updating" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <span>قبول الطلب</span>
  </button>
  <button
    @click="rejectOrder"
    :disabled="updating"
    class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse"
  >
    <svg v-if="updating" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
    <span>رفض الطلب</span>
  </button>
</div>

<!-- حالة مقبولة -->
<div v-if="orderData.status === 'accepted'" class="space-y-2">
  <button
    @click="completeOrder"
    :disabled="updating"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse"
  >
    <svg v-if="updating" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <span>تم الإنجاز</span>
  </button>
  <button
    @click="cancelOrder"
    :disabled="updating"
    class="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse"
  >
    <svg v-if="updating" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
    <span>إلغاء الطلب</span>
  </button>
</div>

              <!-- حالة مقبولة -->
              <div v-if="orderData.status === 'accepted'" class="space-y-2">
                <button
                  @click="updateOrderStatus('completed')"
                  :disabled="updating"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>تم الإنجاز</span>
                </button>
                <button
                  @click="updateOrderStatus('cancelled')"
                  :disabled="updating"
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>إلغاء الطلب</span>
                </button>
              </div>

              <!-- اتصال بالعميل -->
              <button
                class="w-full btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>الاتصال بالعميل</span>
              </button>
            </div>
          </div>

          <!-- الخط الزمني -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">سجل الطلب</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3 space-x-reverse">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p class="font-medium text-gray-900">تم إنشاء الطلب</p>
                  <p class="text-sm text-gray-500">{{ formatDateTime(orderData.created_at) }}</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 space-x-reverse">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p class="font-medium text-gray-900">الحالة الحالية: {{ getStatusText(orderData.status) }}</p>
                  <p class="text-sm text-gray-500">{{ formatDateTime(orderData.updated_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const updating = ref(false)

const orderData = reactive({})

onMounted(async () => {
  await loadOrder()
})

const loadOrder = async () => {
  try {
    const response = await providerService.getOrder(route.params.id)
    Object.assign(orderData, response.data)
    console.log('بيانات الطلب المحملة:', response.data)
  } catch (error) {
    console.error('فشل تحميل بيانات الطلب:', error)
    alert('فشل تحميل بيانات الطلب')
  } finally {
    loading.value = false
  }
}

// دوال المساعدة
const getInitials = (name) => {
  return name
    ?.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2) || '??'
}

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

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// تحديث حالة الطلب
const acceptOrder = async () => {
  if (!confirm('هل أنت متأكد من قبول هذا الطلب؟')) return

  updating.value = true
  
  try {
    await providerService.acceptOrder(route.params.id)
    
    // تحديث الحالة محلياً
    orderData.status = 'accepted'
    orderData.updated_at = new Date().toISOString()
    
    console.log('تم قبول الطلب بنجاح')
    
    // إعادة تحميل البيانات للحصول على أحدث المعلومات
    await loadOrder()
    
  } catch (error) {
    console.error('فشل قبول الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل قبول الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updating.value = false
  }
}

const rejectOrder = async () => {
  if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return

  updating.value = true
  
  try {
    await providerService.rejectOrder(route.params.id)
    
    // تحديث الحالة محلياً
    orderData.status = 'rejected'
    orderData.updated_at = new Date().toISOString()
    
    console.log('تم رفض الطلب بنجاح')
    
    // إعادة تحميل البيانات للحصول على أحدث المعلومات
    await loadOrder()
    
  } catch (error) {
    console.error('فشل رفض الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل رفض الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updating.value = false
  }
}

const completeOrder = async () => {
  if (!confirm('هل أنت متأكد من إكمال هذا الطلب؟')) return

  updating.value = true
  
  try {
    await providerService.completeOrder(route.params.id)
    
    // تحديث الحالة محلياً
    orderData.status = 'completed'
    orderData.updated_at = new Date().toISOString()
    
    console.log('تم إكمال الطلب بنجاح')
    
    // إعادة تحميل البيانات للحصول على أحدث المعلومات
    await loadOrder()
    
  } catch (error) {
    console.error('فشل إكمال الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل إكمال الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updating.value = false
  }
}

const cancelOrder = async () => {
  if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return

  updating.value = true
  
  try {
    await providerService.cancelOrder(route.params.id)
    
    // تحديث الحالة محلياً
    orderData.status = 'cancelled'
    orderData.updated_at = new Date().toISOString()
    
    console.log('تم إلغاء الطلب بنجاح')
    
    // إعادة تحميل البيانات للحصول على أحدث المعلومات
    await loadOrder()
    
  } catch (error) {
    console.error('فشل إلغاء الطلب:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل إلغاء الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    updating.value = false
  }
}
</script>

<style scoped>
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>