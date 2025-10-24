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
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- زر عرض سجل الطلب -->
         
          
          <router-link to="/provider/orders" class="btn-secondary flex items-center space-x-2 space-x-reverse">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>العودة للطلبات</span>
          </router-link>
        </div>
      </template>
    </AppHeader>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else class="space-y-6">
        <!-- شبكة المحتوى الرئيسي -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                <!-- زر مراسلة العميل الجديد -->
                <router-link
                  v-if="orderData.id"
                  :to="{ name: 'ProviderChatPage', params: { orderId: orderData.id } }"
                  class="w-full btn-primary flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"/>
                  </svg>
                  <span>مراسلة العميل</span>
                </router-link>

                <!-- اتصال بالعميل (الزر القديم للمكالمات) -->
                <button
                  class="w-full btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
                  :disabled="true"
                  title="وظيفة الاتصال غير مفعلة حالياً"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>الاتصال بالعميل</span>
                </button>
                <!-- الاتصال بالعميل (الزر القديم للمكالمات) -->
                
                   <button 
                  @click="toggleOrderActivities"
                  class="w-full btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>سجل الطلب</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- سجل الطلب (يظهر عند الضغط على الزر) -->
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
          
          <!-- حالة التحميل للأنشطة -->
          <div v-if="loadingActivities" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto"></div>
            <p class="mt-4 text-gray-600">جاري تحميل سجل الطلب...</p>
          </div>

          <!-- الخط الزمني للأنشطة -->
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
                    {{ formatDateTime(activity.created_at) }}
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

          <!-- حالة عدم وجود أنشطة -->
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const updating = ref(false)
const showOrderActivities = ref(false)
const orderActivities = ref([])
const loadingActivities = ref(false)

const orderData = reactive({
  client: {},
  service: {}
})

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

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
    const response = await providerService.getOrderActivities(orderId)
    orderActivities.value = response.data
    console.log('سجل الطلب للمزود:', orderActivities.value)
  } catch (error) {
    console.error('فشل جلب سجل الطلب:', error)
    alert('فشل تحميل سجل الطلب')
  } finally {
    loadingActivities.value = false
  }
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
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}
</style>