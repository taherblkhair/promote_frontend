<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      :title="providerInfo?.name || 'مزود الخدمة'" 
      subtitle="معرض الأعمال والخدمات"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>
      </template>

      <template #actions>
        <button 
          @click="$router.back()"
          class="btn-secondary flex items-center space-x-2 space-x-reverse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>رجوع</span>
        </button>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل معلومات المزود...</p>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">حدث خطأ</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="loadProviderPortfolio" class="btn-primary mr-2">إعادة المحاولة</button>
        <button @click="$router.back()" class="btn-secondary">العودة للخلف</button>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else-if="providerInfo" class="space-y-8">
        <!-- بطاقة معلومات المزود -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
                <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-2xl">
                    {{ getInitials(providerInfo.name) }}
                  </span>
                </div>
                <div class="text-white">
                  <h1 class="text-2xl font-bold">{{ providerInfo.name }}</h1>
                  <p class="text-primary-100 mt-1">{{ providerInfo.bio || 'مزود خدمات محترف' }}</p>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-3">
                <div class="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white text-center">
                  <div class="text-2xl font-bold">{{ portfolioData?.total || 0 }}</div>
                  <div class="text-sm opacity-90">عدد الأعمال</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white text-center">
                  <div class="text-2xl font-bold">{{ featuredCount }}</div>
                  <div class="text-sm opacity-90">أعمال مميزة</div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">البريد الإلكتروني</p>
                  <p class="font-medium text-gray-900">{{ providerInfo.email }}</p>
                </div>
              </div>

              <div v-if="providerInfo.phone" class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">رقم الهاتف</p>
                  <p class="font-medium text-gray-900">{{ providerInfo.phone }}</p>
                </div>
              </div>

              <div v-if="providerInfo.address" class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">العنوان</p>
                  <p class="font-medium text-gray-900">{{ providerInfo.address }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">الحالة</p>
                  <p class="font-medium text-green-600">نشط</p>
                </div>
              </div>
            </div>

            <!-- أزرار التواصل -->
            <div class="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                v-if="providerInfo.phone"
                @click="contactProvider"
                class="btn-primary flex items-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>اتصل بالمزود</span>
              </button>

              <a 
                v-if="providerInfo.email"
                :href="`mailto:${providerInfo.email}`"
                class="btn-secondary flex items-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>إرسال بريد</span>
              </a>

              <router-link 
                to="/services"
                class="btn-secondary flex items-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span>جميع الخدمات</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- قسم معرض الأعمال -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">معرض الأعمال</h2>
              <p class="text-gray-600 mt-1">استعرض أحدث أعمال {{ providerInfo.name }}</p>
            </div>
            
            <!-- فلاتر التصنيفات -->
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="category in categories" 
                :key="category"
                @click="toggleCategory(category)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  selectedCategory === category 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <!-- حالة عدم وجود أعمال -->
          <div v-if="filteredPortfolios.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">لا توجد أعمال</h3>
            <p class="text-gray-600">لم يقم {{ providerInfo.name }} بإضافة أي أعمال بعد.</p>
          </div>

          <!-- شبكة الأعمال -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              v-for="item in filteredPortfolios" 
              :key="item.id"
              class="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-200"
              @click="$router.push(`/portfolio/${item.id}`)"
            >
              <div class="relative overflow-hidden">
                <img 
                  :src="getImageUrl(item.cover_image)" 
                  :alt="item.title"
                  class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-if="item.is_featured" class="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  مميز
                </div>
                <div class="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {{ item.media_files.length }} صورة
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.category }}
                  </span>
                  <span class="text-xs text-gray-500">{{ formatDate(item.project_date) }}</span>
                </div>
                
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-1">{{ item.title }}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
                
                <!-- الوسوم -->
                <div class="flex flex-wrap gap-1 mb-3">
                  <span 
                    v-for="tag in item.tags.slice(0, 2)" 
                    :key="tag"
                    class="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="item.tags.length > 2" class="text-gray-500 text-xs">
                    +{{ item.tags.length - 2 }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span class="text-primary-600 text-sm font-medium group-hover:text-primary-700 transition-colors duration-200">
                    عرض التفاصيل
                  </span>
                  <svg class="w-4 h-4 text-primary-600 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- التصفح -->
          <div v-if="portfolioData && portfolioData.total > portfolioData.per_page" class="flex justify-center mt-8">
            <div class="bg-gray-100 rounded-lg p-2">
              <button 
                v-for="page in portfolioData.last_page" 
                :key="page"
                @click="loadPage(page)"
                :class="[
                  'mx-1 px-3 py-1 rounded transition-all duration-200',
                  portfolioData.current_page === page 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const providerInfo = ref(null)
const portfolioData = ref(null)
const loading = ref(true)
const error = ref('')
const selectedCategory = ref('all')

const categories = computed(() => {
  if (!portfolioData.value?.data) return []
  const allCategories = portfolioData.value.data.map(item => item.category)
  return ['all', ...new Set(allCategories)]
})

const featuredCount = computed(() => {
  if (!portfolioData.value?.data) return 0
  return portfolioData.value.data.filter(item => item.is_featured).length
})

const filteredPortfolios = computed(() => {
  if (!portfolioData.value?.data) return []

  let filtered = portfolioData.value.data

  // الفلترة حسب التصنيف
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }

  return filtered
})

const getImageUrl = (path) => {
  if (!path) return '/api/placeholder/400/300'
  return `http://127.0.0.1:8000/storage/${path}`
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const toggleCategory = (category) => {
  selectedCategory.value = category
}

const contactProvider = () => {
  if (providerInfo.value?.phone) {
    window.open(`tel:${providerInfo.value.phone}`, '_self')
  }
}

const loadProviderPortfolio = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
    const providerId = route.params.providerId || route.query.provider
    
    if (!providerId) {
      error.value = 'معرف المزود غير موجود'
      return
    }

    const response = await api.get(`/client/provider/${providerId}/portfolio?page=${page}`)
    
    if (response.data.success) {
      portfolioData.value = response.data.data
      // استخراج معلومات المزود من أول عنصر في القائمة
      if (portfolioData.value.data.length > 0) {
        providerInfo.value = portfolioData.value.data[0].provider
      } else {
        // إذا لم يكن هناك أعمال، نحتاج لجلب معلومات المزود من API آخر
        error.value = 'لا توجد أعمال لهذا المزود'
      }
    } else {
      error.value = 'فشل في تحميل بيانات المزود'
    }
  } catch (err) {
    console.error('فشل تحميل معرض المزود:', err)
    if (err.response?.status === 404) {
      error.value = 'المزود غير موجود'
    } else {
      error.value = 'حدث خطأ أثناء تحميل بيانات المزود'
    }
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  loadProviderPortfolio(page)
}

onMounted(() => {
  loadProviderPortfolio()
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>