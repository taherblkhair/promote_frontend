<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="خدماتي" 
      subtitle="إدارة الخدمات التي تقدمها"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </template>

      <!-- <template #actions>
        <router-link to="/provider/add-service" class="btn-primary flex items-center space-x-2 space-x-reverse">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>إضافة خدمة</span>
        </router-link>
      </template> -->
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل الخدمات...</p>
      </div>

      <!-- الشبكة الرئيسية -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="service in services"
          :key="service.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <!-- صورة الخدمة -->
          <div class="relative">
            <img
              v-if="service.image_url"
              :src="service.image_url"
              :alt="service.title"
              class="w-full h-48 object-cover"
            />
            <div
              v-else
              class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
            >
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>

            <!-- حالة الخدمة -->
            <div class="absolute top-3 left-3">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-bold',
                service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ service.is_active ? 'نشط' : 'غير نشط' }}
              </span>
            </div>
          </div>

          <!-- محتوى الخدمة -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ service.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ service.description }}</p>

            <!-- التقييم -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-1 space-x-reverse">
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4" :class="star <= (service.average_rating || 0) ? 'fill-current' : 'fill-gray-300'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-500">({{ service.reviews_count || 0 }})</span>
              </div>
              <span class="text-2xl font-bold text-primary-600">{{ service.price }} د.ل</span>
            </div>

            <!-- الأزرار -->
            <div class="flex space-x-2 space-x-reverse">
              <router-link
                :to="`/provider/services/${service.id}`"
                class="flex-1 btn-secondary text-center text-sm py-2"
              >
                تفاصيل
              </router-link>
              <button
                @click="editService(service.id)"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200"
              >
                تعديل
              </button>
              <button
                @click="deleteService(service.id)"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود خدمات -->
      <div v-if="!loading && services.length === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">لا توجد خدمات</h3>
          <p class="text-gray-600 mb-6">لم تقم بإضافة أي خدمات حتى الآن.</p>
          <router-link to="/provider/add-service" class="btn-primary">
            إضافة أول خدمة
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const services = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadServices()
})

const loadServices = async () => {
  try {
    const response = await providerService.getServices()
    services.value = response.data
  } catch (error) {
    console.error('فشل جلب الخدمات:', error)
  } finally {
    loading.value = false
  }
}

const editService = (id) => {
  router.push(`/provider/edit-service/${id}`)
}

const deleteService = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
    try {
      await providerService.deleteService(id)
      await loadServices() // إعادة تحميل الخدمات
    } catch (error) {
      console.error('فشل حذف الخدمة:', error)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>