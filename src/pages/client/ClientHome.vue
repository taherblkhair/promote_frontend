<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
     <AppHeader 
      title="الصفحة الرئيسية" 
      subtitle="مرحباً بك في نظام Promote"
      :hide-home-button="true"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- بطاقة الترحيب -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              مرحباً، {{ authStore.user?.name }}! 👋
            </h1>
            <p class="text-gray-600 text-lg">
              يمكنك من هنا استعراض الخدمات ودفع الطلبات ومتابعة طلباتك.
            </p>
          </div>
          <div class="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
            عميل
          </div>
        </div>
      </div>

      <!-- البطاقات السريعة -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <router-link 
          to="/services"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
        >
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">استعرض الخدمات</h3>
              <p class="text-gray-600 text-sm mt-1">اكتشف الخدمات المتاحة</p>
            </div>
          </div>
        </router-link>

        <router-link 
          to="/client/orders"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
        >
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">طلباتي</h3>
              <p class="text-gray-600 text-sm mt-1">عرض ومتابعة طلباتك</p>
            </div>
          </div>
        </router-link>

        <router-link 
          to="/portfolio/client"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
        >
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">معرض الأعمال</h3>
              <p class="text-gray-600 text-sm mt-1">استعرض أعمال مزودي الخدمات</p>
            </div>
          </div>
        </router-link>

        <router-link 
          to="/profile"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
        >
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">الملف الشخصي</h3>
              <p class="text-gray-600 text-sm mt-1">إدارة معلومات حسابك</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- قسم معرض الأعمال المميزة -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">الأعمال المميزة</h2>
            <p class="text-gray-600 mt-2">استعرض أحدث أعمال مزودي الخدمات المتميزين</p>
          </div>
          <router-link 
            to="/portfolio"
            class="btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <span>عرض الكل</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </router-link>
        </div>

        <!-- الأعمال المميزة -->
        <div v-if="featuredPortfolios.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in featuredPortfolios.slice(0, 3)" 
            :key="item.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
            @click="$router.push(`/portfolio/${item.id}`)"
          >
            <div class="relative overflow-hidden">
              <img 
                :src="getImageUrl(item.cover_image)" 
                :alt="item.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-if="item.is_featured" class="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                مميز
              </div>
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <span class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {{ item.category }}
                </span>
                <span class="text-sm text-gray-500">{{ formatDate(item.project_date) }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{{ item.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ item.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-700 font-bold text-xs">
                      {{ getInitials(item.provider?.name) }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-700">{{ item.provider?.name }}</span>
                </div>
                <span class="text-primary-600 font-medium text-sm">عرض العمل</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">لا توجد أعمال مميزة حالياً</h3>
          <p class="text-gray-600">سيتم عرض الأعمال المميزة قريباً</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()
const router = useRouter()
const featuredPortfolios = ref([])
const loading = ref(true)

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

const loadFeaturedPortfolios = async () => {
  try {
    const response = await api.get('/client/portfolio')
    const allItems = response.data.data
    featuredPortfolios.value = allItems.filter(item => item.is_featured)
  } catch (error) {
    console.error('فشل تحميل الأعمال المميزة:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFeaturedPortfolios()
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200;
}
</style>