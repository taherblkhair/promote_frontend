<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      title="معرض الأعمال" 
      subtitle="استعرض أحدث أعمال مزودي الخدمات المتميزين"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- الفلاتر والبحث -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="toggleCategory(category)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                selectedCategories.includes(category) 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>
          
          <div class="flex gap-3 w-full lg:w-auto">
            <div class="relative flex-1 lg:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ابحث في الأعمال..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <select 
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="featured">المميزة أولاً</option>
            </select>
          </div>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل الأعمال...</p>
      </div>

      <!-- الشبكة الرئيسية -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in filteredPortfolios" 
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
            <div class="absolute top-4 right-4 flex space-x-1 space-x-reverse">
              <span class="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {{ item.media_files.length }} صورة
              </span>
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                {{ item.category }}
              </span>
              <span class="text-xs text-gray-500">{{ formatDate(item.project_date) }}</span>
            </div>
            
            <h3 class="font-bold text-gray-900 mb-2 line-clamp-1">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ item.description }}</p>
            
            <!-- الوسوم -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span 
                v-for="tag in item.tags.slice(0, 3)" 
                :key="tag"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {{ tag }}
              </span>
              <span v-if="item.tags.length > 3" class="text-gray-500 text-xs">
                +{{ item.tags.length - 3 }}
              </span>
            </div>
            
            <!-- معلومات المزود -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center space-x-2 space-x-reverse">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-700 font-bold text-xs">
                    {{ getInitials(item.provider?.name) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ item.provider?.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.provider?.bio || 'مزود خدمة' }}</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-primary-600 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود نتائج -->
      <div v-if="!loading && filteredPortfolios.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">لا توجد أعمال</h3>
        <p class="text-gray-600">لم نعثر على أي أعمال تطابق معايير البحث.</p>
      </div>

      <!-- التصفح -->
      <div v-if="portfolioData && portfolioData.total > portfolioData.per_page" class="flex justify-center mt-8">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <button 
            v-for="page in portfolioData.last_page" 
            :key="page"
            @click="loadPage(page)"
            :class="[
              'mx-1 px-3 py-1 rounded transition-all duration-200',
              portfolioData.current_page === page 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const portfolioData = ref(null)
const loading = ref(true)
const searchQuery = ref('')
const selectedCategories = ref([])
const sortBy = ref('newest')

const categories = computed(() => {
  if (!portfolioData.value?.data) return []
  const allCategories = portfolioData.value.data.map(item => item.category)
  return [...new Set(allCategories)]
})

const filteredPortfolios = computed(() => {
  if (!portfolioData.value?.data) return []

  let filtered = portfolioData.value.data

  // البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.provider?.name.toLowerCase().includes(query)
    )
  }

  // الفلترة حسب التصنيف
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(item => selectedCategories.value.includes(item.category))
  }

  // الترتيب
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'featured':
      filtered.sort((a, b) => b.is_featured - a.is_featured)
      break
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
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
}

const loadPortfolio = async (page = 1) => {
  try {
    loading.value = true
    const response = await api.get(`/client/portfolio?page=${page}`)
    portfolioData.value = response.data.data
  } catch (error) {
    console.error('فشل تحميل معرض الأعمال:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  loadPortfolio(page)
}

onMounted(() => {
  loadPortfolio()
})
</script>