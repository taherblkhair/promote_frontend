<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Header -->
    <AppHeader 
      :title="`طلب #${order?.id}`" 
      subtitle="تفاصيل الطلب والتواصل مع المزود"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </template>
      
      <template #actions>
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- زر عرض سجل الطلب -->
         
          
          <button 
            @click="router.back()"
            class="btn-secondary flex items-center space-x-2 space-x-reverse"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>رجوع</span>
          </button>
        </div>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-xl text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-red-800 mb-2">حدث خطأ</h3>
          <p class="text-red-700 mb-4">{{ errorMessage }}</p>
          <button @click="router.back()" class="btn-primary">
            العودة للطلبات
          </button>
        </div>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="space-y-6">
        <!-- Order Status Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div :class="getStatusDotClass(order.status)" class="w-4 h-4 rounded-full"></div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">حالة الطلب: {{ getStatusText(order.status) }}</h2>
                <p class="text-gray-600 mt-1">تم إنشاء الطلب في {{ formatDate(order.order_date) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 space-x-reverse">
              <span :class="getStatusBadgeClass(order.status)" class="px-4 py-2 rounded-full text-lg font-bold">
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Service Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Service Card -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="p-6">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">معلومات الخدمة</h3>
                
                <div class="flex flex-col md:flex-row gap-6">
                  <!-- Service Image -->
                  <div class="flex-shrink-0">
                    <img 
                      v-if="order.service?.image" 
                      :src="order.service.image" 
                      :alt="order.service.title" 
                      class="w-32 h-32 object-cover rounded-2xl border-2 border-gray-200"
                      @error="handleImageError"
                    />
                    <div v-else class="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Service Info -->
                  <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-900 mb-2">{{ order.service?.title }}</h4>
                    <p class="text-gray-600 mb-4 whitespace-pre-line">{{ order.service?.description }}</p>
                    
                    <div class="flex items-center justify-between">
                      <div class="text-2xl font-bold text-primary-600">
                        {{ order.service?.price }} <span class="text-lg mr-1">د.ل</span>
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ order.service?.reviews_count || 0 }} تقييم
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Notes -->
            <div v-if="order.notes" class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">ملاحظاتك على الطلب</h3>
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p class="text-blue-800 text-lg leading-relaxed">{{ order.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Provider & Actions Sidebar -->
          <div class="space-y-6">
            <!-- Provider Card -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">معلومات المزود</h3>
              
              <div class="space-y-4">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-bold text-lg">
                      {{ getInitials(order.provider?.name) }}
                    </span>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">{{ order.provider?.name }}</h4>
                    <p class="text-gray-600 text-sm">{{ order.provider?.email }}</p>
                  </div>
                </div>

                <div class="space-y-2 text-sm">
                  <div v-if="order.provider?.phone" class="flex items-center justify-between">
                    <span class="text-gray-600">رقم الهاتف:</span>
                    <span class="font-medium text-gray-900">{{ order.provider.phone }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600">التقييم العام:</span>
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <span class="font-medium text-gray-900">
                        {{ order.service?.average_rating || 0 }}/5
                      </span>
                      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Contact Provider Button -->
                <button 
                  @click="contactProvider"
                  class="w-full bg-green-600 text-white hover:bg-green-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse mt-4"                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <span>مراسلة المزود</span>
                </button>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">إجراءات الطلب</h3>
              
              <div class="space-y-3">
                <button 
                  v-if="order.status === 'pending'"
                  @click="cancelOrder"
                  :disabled="cancelling"
                  class="w-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="cancelling" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>{{ cancelling ? 'جاري الإلغاء...' : 'إلغاء الطلب' }}</span>
                </button>
                 <button 
            @click="toggleOrderActivities"
            class="btn-secondary flex items-center space-x-2 space-x-reverse"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>سجل الطلب</span>
          </button>

                <button 
                  @click="downloadInvoice"
                  class="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>تحميل الفاتورة</span>
                </button>

                <button 
                  @click="requestModification"
                  v-if="order.status === 'pending'"
                  class="w-full bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span>طلب تعديل</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Activities Timeline -->
        <div v-if="showOrderActivities" class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">سجل الطلب</h3>
            <button 
              @click="toggleOrderActivities"
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Loading State for Activities -->
          <div v-if="loadingActivities" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto"></div>
            <p class="mt-4 text-gray-600">جاري تحميل سجل الطلب...</p>
          </div>

          <!-- Activities Timeline -->
          <div v-else-if="orderActivities.length > 0" class="relative">
            <!-- الخط الرئيسي -->
            <div class="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <!-- الأنشطة -->
            <div v-for="(activity, index) in orderActivities" :key="activity.id" 
                 class="relative flex items-start space-x-4 space-x-reverse mb-8 last:mb-0">
              
              <!-- النقطة -->
              <div :class="[
                'w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 flex-shrink-0',
                getActivityDotClass(activity.user?.role)
              ]">
                <span class="text-xs font-bold text-white">
                  {{ getInitials(activity.user?.name) }}
                </span>
              </div>

              <!-- محتوى النشاط -->
              <div class="flex-1 pb-2 bg-gray-50 rounded-xl p-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4 class="text-lg font-bold text-gray-900">
                    {{ activity.action }}
                  </h4>
                  <span class="text-sm text-gray-500">
                    {{ formatTrackingDate(activity.created_at) }}
                  </span>
                </div>
                
                <p class="text-gray-600 mb-3" v-if="activity.note">
                  {{ activity.note }}
                </p>
                
                <!-- معلومات المستخدم -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <span class="text-gray-600">بواسطة:</span>
                    <span :class="getUserRoleClass(activity.user?.role)" class="font-medium px-2 py-1 rounded-full text-xs">
                      {{ activity.user?.name }}
                    </span>
                  </div>
                  <span :class="getRoleBadgeClass(activity.user?.role)" class="px-2 py-1 rounded-full text-xs">
                    {{ getUserRoleText(activity.user?.role) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">لا توجد أنشطة مسجلة</h4>
            <p class="text-gray-600">لم يتم تسجيل أي أنشطة لهذا الطلب بعد.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const order = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const cancelling = ref(false)
const showOrderActivities = ref(false)
const orderActivities = ref([])
const loadingActivities = ref(false)

const getStatusBadgeClass = (status) => {
  switch(status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'delivered': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusDotClass = (status) => {
  switch(status) {
    case 'completed': return 'bg-green-500'
    case 'pending': return 'bg-yellow-500'
    case 'cancelled': return 'bg-red-500'
    case 'in_progress': return 'bg-blue-500'
    case 'delivered': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 'completed': return 'مكتمل'
    case 'pending': return 'قيد الانتظار'
    case 'cancelled': return 'ملغي'
    case 'in_progress': return 'جاري التنفيذ'
    case 'delivered': return 'تم التسليم'
    default: return status
  }
}

const getActivityDotClass = (role) => {
  switch(role) {
    case 'client': return 'bg-blue-500 border-blue-500'
    case 'provider': return 'bg-green-500 border-green-500'
    case 'admin': return 'bg-purple-500 border-purple-500'
    default: return 'bg-gray-500 border-gray-500'
  }
}

const getUserRoleClass = (role) => {
  switch(role) {
    case 'client': return 'text-blue-700'
    case 'provider': return 'text-green-700'
    case 'admin': return 'text-purple-700'
    default: return 'text-gray-700'
  }
}

const getRoleBadgeClass = (role) => {
  switch(role) {
    case 'client': return 'bg-blue-100 text-blue-800'
    case 'provider': return 'bg-green-100 text-green-800'
    case 'admin': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getUserRoleText = (role) => {
  switch(role) {
    case 'client': return 'عميل'
    case 'provider': return 'مزود خدمة'
    case 'admin': return 'مدير'
    default: return role
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTrackingDate = (dateString) => {
  if (!dateString) return 'لم يتم بعد'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (name) => {
  if (!name) return '--'
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const handleImageError = (event) => {
  const target = event.target
  target.style.display = 'none'
  const nextSibling = target.nextElementSibling
  if (nextSibling) {
    nextSibling.style.display = 'flex'
  }
}

const toggleOrderActivities = async () => {
  showOrderActivities.value = !showOrderActivities.value
  
  if (showOrderActivities.value && orderActivities.value.length === 0) {
    await fetchOrderActivities()
  }
}

const fetchOrderActivities = async () => {
  loadingActivities.value = true
  try {
    const orderId = route.params.id
    const response = await api.get(`/client/orders/${orderId}/activities`)
    orderActivities.value = response.data
    console.log('سجل الطلب:', orderActivities.value)
  } catch (error) {
    console.error('فشل جلب سجل الطلب:', error)
    alert('فشل تحميل سجل الطلب')
  } finally {
    loadingActivities.value = false
  }
}

const contactProvider = () => {
  router.push(`/orders/${order.value.id}/chat`)
}

const cancelOrder = async () => {
  if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return
  
  cancelling.value = true
  try {
    await api.delete(`/client/orders/${route.params.id}`)
    
    // تحديث حالة الطلب
    order.value.status = 'cancelled'
    
    alert('تم إلغاء الطلب بنجاح')
  } catch (error) {
    console.error('فشل إلغاء الطلب:', error)
    alert('فشل إلغاء الطلب. يرجى المحاولة مرة أخرى.')
  } finally {
    cancelling.value = false
  }
}

const downloadInvoice = () => {
  // هنا يمكنك إضافة منطق تحميل الفاتورة
  alert('سيتم تحميل الفاتورة قريباً')
}

const requestModification = () => {
  // هنا يمكنك إضافة منطق طلب التعديل
  alert('سيتم إرسال طلب التعديل للمزود')
}

onMounted(async () => {
  try {
    if (!auth.isAuthenticated) {
      errorMessage.value = 'يجب تسجيل الدخول لعرض تفاصيل الطلب'
      router.push('/login')
      return
    }

    const orderId = route.params.id
    const response = await api.get(`/client/orders/${orderId}`)
    order.value = response.data
    console.log('تفاصيل الطلب:', order.value)
    
  } catch (error) {
    console.error('فشل جلب تفاصيل الطلب:', error)
    if (error.response?.status === 401) {
      errorMessage.value = 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى'
      auth.logout()
      router.push('/login')
    } else if (error.response?.status === 403) {
      errorMessage.value = 'غير مسموح لك بالوصول إلى هذه الصفحة'
    } else if (error.response?.status === 404) {
      errorMessage.value = 'الطلب غير موجود'
    } else {
      errorMessage.value = 'حدث خطأ أثناء تحميل تفاصيل الطلب'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200;
}
</style>