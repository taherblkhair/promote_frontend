<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      :title="portfolioItem?.title" 
      :subtitle="portfolioItem?.category"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
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

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل تفاصيل العمل...</p>
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
        <button @click="loadPortfolioItem" class="btn-primary mr-2">إعادة المحاولة</button>
        <button @click="$router.back()" class="btn-secondary">العودة للخلف</button>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else-if="portfolioItem" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- العمود الأيسر: المعرض -->
        <div class="lg:col-span-2 space-y-6">
          <!-- الصورة الرئيسية -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
              :src="getImageUrl(portfolioItem.cover_image)" 
              :alt="portfolioItem.title"
              class="w-full h-96 object-cover"
            />
          </div>

          <!-- معرض الصور -->
          <div v-if="portfolioItem.media_files && portfolioItem.media_files.length > 1" class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">معرض الصور ({{ portfolioItem.media_files.length }})</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="(media, index) in portfolioItem.media_files" 
                :key="media.id"
                class="relative group cursor-pointer"
                @click="selectedImageIndex = index"
              >
                <img 
                  :src="getImageUrl(media.file_path)" 
                  :alt="`${portfolioItem.title} - صورة ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg group-hover:opacity-75 transition-opacity duration-200"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          <!-- وصف العمل -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">عن العمل</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ portfolioItem.description }}</p>
          </div>

          <!-- الوسوم -->
          <div v-if="portfolioItem.tags && portfolioItem.tags.length > 0" class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">الوسوم</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in portfolioItem.tags" 
                :key="tag"
                class="bg-primary-100 text-primary-800 px-3 py-2 rounded-full text-sm font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن: المعلومات الجانبية -->
        <div class="space-y-6">
          <!-- معلومات العمل -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">معلومات العمل</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">التصنيف:</span>
                <span class="font-medium text-gray-900">{{ portfolioItem.category }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">تاريخ المشروع:</span>
                <span class="font-medium text-gray-900">{{ formatDate(portfolioItem.project_date) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">عدد الصور:</span>
                <span class="font-medium text-gray-900">{{ portfolioItem.media_files?.length || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">تاريخ الإضافة:</span>
                <span class="font-medium text-gray-900">{{ formatDate(portfolioItem.created_at) }}</span>
              </div>
              <div v-if="portfolioItem.is_featured" class="flex justify-between items-center">
                <span class="text-gray-600">الحالة:</span>
                <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">مميز</span>
              </div>
            </div>
          </div>

          <!-- معلومات المزود -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">معلومات المزود</h3>
            <div class="flex items-center space-x-3 space-x-reverse mb-4">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-bold text-lg">
                  {{ getInitials(portfolioItem.provider?.name) }}
                </span>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">{{ portfolioItem.provider?.name }}</h4>
                <p class="text-gray-600 text-sm">{{ portfolioItem.provider?.email }}</p>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div v-if="portfolioItem.provider?.phone" class="flex justify-between">
                <span class="text-gray-600">رقم الهاتف:</span>
                <span class="font-medium text-gray-900">{{ portfolioItem.provider.phone }}</span>
              </div>
              <div v-if="portfolioItem.provider?.bio" class="border-t pt-3">
                <p class="text-gray-700 text-sm">{{ portfolioItem.provider.bio }}</p>
              </div>
              <div v-if="portfolioItem.provider?.address" class="flex justify-between">
                <span class="text-gray-600">العنوان:</span>
                <span class="font-medium text-gray-900">{{ portfolioItem.provider.address }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الحالة:</span>
                <span :class="getProviderStatusClass(portfolioItem.provider?.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getProviderStatusText(portfolioItem.provider?.status) }}
                </span>
              </div>
            </div>
<router-link :to="`/client/provider/${portfolioItem.provider_id}`"></router-link>
            <!-- أزرار التواصل -->
            <div class="mt-6 space-y-3">
            <router-link  :to="`/client/provider/${portfolioItem.provider_id}`"
            class="w-full btn-primary flex items-center justify-center space-x-2 space-x-reverse"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>معرض أعمال المزود</span>
            </router-link>

              <button 
                v-if="portfolioItem.provider?.phone"
                @click="contactProvider"
                class="w-full btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>اتصل بالمزود</span>
              </button>
            </div>
          </div>

          <!-- مشاركة العمل -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">مشاركة العمل</h3>
            <div class="flex space-x-3 space-x-reverse">
              <button 
                @click="shareOnSocial('facebook')"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>فيسبوك</span>
              </button>
              <button 
                @click="shareOnSocial('twitter')"
                class="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>تويتر</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود العمل -->
      <div v-else-if="!loading" class="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">العمل غير موجود</h3>
        <p class="text-gray-600 mb-4">العمل الذي تبحث عنه غير موجود أو تم حذفه.</p>
        <button @click="$router.back()" class="btn-primary">العودة للخلف</button>
      </div>
    </main>

    <!-- معرض الصور المكبر -->
    <div v-if="selectedImageIndex !== null && portfolioItem?.media_files" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div class="relative max-w-4xl max-h-full">
        <button 
          @click="selectedImageIndex = null"
          class="absolute -top-12 left-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <img 
          :src="getImageUrl(portfolioItem.media_files[selectedImageIndex].file_path)" 
          :alt="`${portfolioItem.title} - صورة ${selectedImageIndex + 1}`"
          class="max-w-full max-h-full object-contain"
        />

        <div class="absolute inset-x-0 bottom-4 flex justify-center space-x-4">
          <button 
            @click="navigateImage(-1)"
            class="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
            :disabled="selectedImageIndex === 0"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <span class="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {{ selectedImageIndex + 1 }} / {{ portfolioItem.media_files.length }}
          </span>
          
          <button 
            @click="navigateImage(1)"
            class="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
            :disabled="selectedImageIndex === portfolioItem.media_files.length - 1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const portfolioItem = ref(null)
const loading = ref(true)
const error = ref('')
const selectedImageIndex = ref(null)

const getImageUrl = (path) => {
  if (!path) return '/api/placeholder/800/600'
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
    month: 'long',
    day: 'numeric'
  })
}

const getProviderStatusClass = (status) => {
  switch(status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-red-100 text-red-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getProviderStatusText = (status) => {
  switch(status) {
    case 'active': return 'نشط'
    case 'inactive': return 'غير نشط'
    case 'pending': return 'قيد المراجعة'
    default: return status
  }
}

const navigateImage = (direction) => {
  if (!portfolioItem.value?.media_files) return
  
  const newIndex = selectedImageIndex.value + direction
  if (newIndex >= 0 && newIndex < portfolioItem.value.media_files.length) {
    selectedImageIndex.value = newIndex
  }
}

const contactProvider = () => {
  if (portfolioItem.value?.provider?.phone) {
    window.open(`tel:${portfolioItem.value.provider.phone}`, '_self')
  }
}

const shareOnSocial = (platform) => {
  const url = window.location.href
  const title = portfolioItem.value?.title || 'معرض الأعمال'
  
  let shareUrl = ''
  switch(platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
      break
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

const loadPortfolioItem = async () => {
  try {
    loading.value = true
    error.value = ''
    const itemId = route.params.id
    
    const response = await api.get(`/client/item/${itemId}`)
    
    if (response.data.success) {
      portfolioItem.value = response.data.data
    } else {
      error.value = 'فشل في تحميل بيانات العمل'
    }
  } catch (err) {
    console.error('فشل تحميل تفاصيل العمل:', err)
    if (err.response?.status === 404) {
      error.value = 'العمل غير موجود'
    } else {
      error.value = 'حدث خطأ أثناء تحميل بيانات العمل'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPortfolioItem()
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