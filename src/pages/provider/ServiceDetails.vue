<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      :title="serviceData.title || 'تفاصيل الخدمة'" 
      subtitle="عرض تفاصيل الخدمة وإحصائياتها"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </template>

      <template #actions>
        <router-link to="/provider/services" class="btn-secondary flex items-center space-x-2 space-x-reverse">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>العودة للخدمات</span>
        </router-link>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل بيانات الخدمة...</p>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- العمود الأيسر: معلومات الخدمة -->
        <div class="lg:col-span-2 space-y-6">
          <!-- بطاقة الخدمة -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              v-if="serviceData.image"
              :src="serviceData.image"
              :alt="serviceData.title"
              class="w-full h-64 object-cover"
            />
            <div
              v-else
              class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
            >
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-bold text-gray-900">{{ serviceData.title }}</h1>
                <span class="text-3xl font-bold text-primary-600">{{ serviceData.price }} د.ل</span>
              </div>

              <div class="flex items-center space-x-4 space-x-reverse mb-4">
                <span class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {{ serviceData.category }}
                </span>
                <div class="flex items-center space-x-1 space-x-reverse text-gray-600">
                  <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="font-medium">{{ serviceData.average_rating || 0 }}</span>
                  <span class="text-gray-500">({{ serviceData.reviews_count || 0 }} تقييم)</span>
                </div>
              </div>

              <div class="prose max-w-none">
                <h3 class="text-lg font-bold text-gray-900 mb-3">وصف الخدمة</h3>
                <p class="text-gray-700 whitespace-pre-line">{{ serviceData.description }}</p>
              </div>
            </div>
          </div>

          <!-- إحصائيات الطلبات -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-6">إحصائيات الطلبات</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ serviceData.orders_statistics?.total_orders || 0 }}</p>
                <p class="text-sm text-gray-600">إجمالي الطلبات</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ serviceData.orders_statistics?.completed_orders || 0 }}</p>
                <p class="text-sm text-gray-600">مكتملة</p>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <p class="text-2xl font-bold text-yellow-600">{{ serviceData.orders_statistics?.pending_orders || 0 }}</p>
                <p class="text-sm text-gray-600">قيد الانتظار</p>
              </div>
              <div class="text-center p-4 bg-red-50 rounded-lg">
                <p class="text-2xl font-bold text-red-600">{{ serviceData.orders_statistics?.cancelled_orders || 0 }}</p>
                <p class="text-sm text-gray-600">ملغاة</p>
              </div>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن: المعلومات الجانبية -->
        <div class="space-y-6">
          <!-- معلومات المزود -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">معلومات المزود</h3>
            <div class="flex items-center space-x-3 space-x-reverse mb-4">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-bold text-sm">
                  {{ providerInitials }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ serviceData.provider }}</p>
                <p class="text-sm text-gray-600">مزود خدمة</p>
              </div>
            </div>
          </div>

          <!-- العملاء الفريدون -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">العملاء الفريدون</h3>
            <div v-if="serviceData.unique_clients && serviceData.unique_clients.length > 0" class="space-y-3">
              <div
                v-for="client in serviceData.unique_clients.slice(0, 5)"
                :key="client.id"
                class="flex items-center space-x-3 space-x-reverse"
              >
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 text-xs font-medium">
                    {{ getInitials(client.name) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ client.name }}</p>
                  <p class="text-xs text-gray-500">{{ client.orders_count }} طلب</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              <p>لا يوجد عملاء حتى الآن</p>
            </div>
          </div>

          <!-- الإجراءات -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">الإجراءات</h3>
            <div class="space-y-3">
              <router-link
                :to="`/provider/edit-service/${$route.params.id}`"
                class="w-full btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                <span>تعديل الخدمة</span>
              </router-link>
              <button
                @click="deleteService"
                class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>حذف الخدمة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)

const serviceData = reactive({})

onMounted(async () => {
  await loadService()
})

const loadService = async () => {
  try {
    const response = await providerService.getService(route.params.id)
    Object.assign(serviceData, response.data)
  } catch (error) {
    console.error('فشل تحميل بيانات الخدمة:', error)
  } finally {
    loading.value = false
  }
}

const providerInitials = computed(() => {
  const name = serviceData.provider || ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const deleteService = async () => {
  if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
    try {
      await providerService.deleteService(route.params.id)
      router.push('/provider/services')
    } catch (error) {
      console.error('فشل حذف الخدمة:', error)
    }
  }
}
</script>