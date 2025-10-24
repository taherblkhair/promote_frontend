<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="معرض أعمالي" 
      subtitle="عرض وإدارة مشاريعك السابقة"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </template>
      
      <template #actions>
        <router-link 
          to="/provider/portfolio/add"
          class="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 font-medium flex items-center space-x-2 space-x-reverse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>إضافة مشروع جديد</span>
        </router-link>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل المشاريع...</p>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else class="space-y-8">
        <!-- إحصائيات سريعة -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">إجمالي المشاريع</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ portfolioData.total || 0 }}
                </p>
              </div>
              <div class="p-3 rounded-full bg-blue-100">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">المشاريع المميزة</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ featuredCount }}
                </p>
              </div>
              <div class="p-3 rounded-full bg-green-100">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">المشاريع العامة</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ publicCount }}
                </p>
              </div>
              <div class="p-3 rounded-full bg-purple-100">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">الصور والفيديوهات</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ mediaCount }}
                </p>
              </div>
              <div class="p-3 rounded-full bg-orange-100">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- فلترة وبحث -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex flex-wrap gap-4">
              <button 
                v-for="filter in filters"
                :key="filter.id"
                @click="setActiveFilter(filter.id)"
                :class="[
                  'px-4 py-2 rounded-xl font-medium transition-all duration-300',
                  activeFilter === filter.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div class="relative w-full md:w-64">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="ابحث في المشاريع..."
                class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
              <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- شبكة المشاريع -->
        <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="project in filteredProjects"
            :key="project.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
          >
            <!-- صورة الغلاف -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="getImageUrl(project.cover_image)" 
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              >
              <div class="absolute top-4 left-4 flex gap-2">
                <span 
                  v-if="project.is_featured"
                  class="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                >
                  مميز
                </span>
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    project.is_public ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  ]"
                >
                  {{ project.is_public ? 'عام' : 'خاص' }}
                </span>
              </div>
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>

            <!-- محتوى البطاقة -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="font-bold text-gray-900 text-lg line-clamp-1">{{ project.title }}</h3>
                <div class="flex space-x-2 space-x-reverse">
                  <button 
                    @click="editProject(project)"
                    class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button 
                    @click="deleteProject(project)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.description }}</p>

              <!-- التصنيف والتاريخ -->
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span class="bg-gray-100 px-3 py-1 rounded-full">{{ project.category }}</span>
                <span>{{ formatDate(project.project_date) }}</span>
              </div>

              <!-- الوسوم -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tag in project.tags.slice(0, 3)"
                  :key="tag"
                  class="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
                <span 
                  v-if="project.tags.length > 3"
                  class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  +{{ project.tags.length - 3 }}
                </span>
              </div>

              <!-- معاينة الوسائط -->
              <div class="flex gap-2">
                <div 
                  v-for="(media, index) in project.media_files.slice(0, 3)"
                  :key="media.id"
                  class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200"
                >
                  <img 
                    :src="getImageUrl(media.file_path)" 
                    :alt="`صورة ${index + 1}`"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  >
                  <div 
                    v-if="index === 2 && project.media_files.length > 3"
                    class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                  >
                    <span class="text-white text-xs font-medium">+{{ project.media_files.length - 3 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- لا توجد مشاريع -->
        <div v-else-if="!loading" class="text-center py-12">
          <div class="bg-white rounded-2xl shadow-lg p-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="text-xl font-bold text-gray-900 mb-2">لا توجد مشاريع</h3>
            <p class="text-gray-600 mb-6">ابدأ بإضافة مشروعك الأول لعرضه في معرض الأعمال</p>
            <router-link 
              to="/provider/portfolio/add"
              class="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 font-medium inline-flex items-center space-x-2 space-x-reverse"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>إضافة مشروع جديد</span>
            </router-link>
          </div>
        </div>

        <!-- الترقيم -->
        <div v-if="portfolioData.last_page > 1" class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <button 
              @click="loadPage(portfolioData.current_page - 1)"
              :disabled="portfolioData.current_page === 1"
              :class="[
                'px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 space-x-reverse',
                portfolioData.current_page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span>السابق</span>
            </button>

            <div class="flex gap-2">
              <button 
                v-for="page in visiblePages"
                :key="page"
                @click="loadPage(page)"
                :class="[
                  'w-10 h-10 rounded-xl font-medium transition-all duration-300',
                  page === portfolioData.current_page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button 
              @click="loadPage(portfolioData.current_page + 1)"
              :disabled="portfolioData.current_page === portfolioData.last_page"
              :class="[
                'px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2',
                portfolioData.current_page === portfolioData.last_page
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              ]"
            >
              <span>التالي</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const portfolioData = ref({})
const loading = ref(true)
const activeFilter = ref('all')
const searchQuery = ref('')

const filters = [
  { id: 'all', label: 'جميع المشاريع' },
  { id: 'featured', label: 'المميزة' },
  { id: 'public', label: 'العامة' },
  { id: 'private', label: 'الخاصة' }
]

// الحسابات المحسوبة
const featuredCount = computed(() => {
  return portfolioData.value.data?.filter(project => project.is_featured).length || 0
})

const publicCount = computed(() => {
  return portfolioData.value.data?.filter(project => project.is_public).length || 0
})

const mediaCount = computed(() => {
  return portfolioData.value.data?.reduce((total, project) => total + project.media_files.length, 0) || 0
})

const filteredProjects = computed(() => {
  let projects = portfolioData.value.data || []
  
  // التصفية حسب النوع
  if (activeFilter.value === 'featured') {
    projects = projects.filter(project => project.is_featured)
  } else if (activeFilter.value === 'public') {
    projects = projects.filter(project => project.is_public)
  } else if (activeFilter.value === 'private') {
    projects = projects.filter(project => !project.is_public)
  }
  
  // البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    projects = projects.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return projects
})

const visiblePages = computed(() => {
  const current = portfolioData.value.current_page || 1
  const last = portfolioData.value.last_page || 1
  const pages = []
  
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

// الدوال المساعدة
const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'
  
  const baseUrl = 'http://127.0.0.1:8000'
  
  // إذا كان المسار يبدأ بـ /storage/ بالفعل
  if (path.startsWith('/storage/')) {
    return `${baseUrl}${path}`
  }
  
  // إذا كان المسار نسبي فقط (مثل: thumbnails/... أو portfolio/...)
  if (path.startsWith('thumbnails/') || path.startsWith('portfolio/')) {
    return `${baseUrl}/storage/${path}`
  }
  
  // إذا كان المسار كامل بالفعل
  if (path.startsWith('http')) {
    return path
  }
  
  // الحالة الافتراضية - أي مسار آخر نضيف /storage/ أمامه
  return `${baseUrl}/storage/${path}`
}

const handleImageError = (event) => {
  console.log('خطأ في تحميل الصورة:', event.target.src)
  event.target.src = '/images/placeholder.jpg'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-EG')
}

const setActiveFilter = (filter) => {
  activeFilter.value = filter
}

const loadPage = async (page) => {
  if (page < 1 || page > (portfolioData.value.last_page || 1)) return
  
  try {
    loading.value = true
    const response = await providerService.getPortfolio(page)
    console.log('استجابة API:', response.data)
    
    // التصحيح: الـ API يرجع البيانات في response.data.data
    portfolioData.value = response.data.data || {}
    
    // للتdebug - عرض مسارات الصور في الكونسول
    if (portfolioData.value.data) {
      portfolioData.value.data.forEach((project, index) => {
        console.log(`المشروع ${index + 1}:`, {
          title: project.title,
          cover_image: project.cover_image,
          cover_image_url: getImageUrl(project.cover_image),
          media_files: project.media_files.map(media => ({
            file_path: media.file_path,
            file_path_url: getImageUrl(media.file_path)
          }))
        })
      })
    }
  } catch (error) {
    console.error('فشل جلب بيانات المعرض:', error)
    alert('فشل تحميل البيانات. يرجى المحاولة مرة أخرى.')
  } finally {
    loading.value = false
  }
}

const editProject = (project) => {
  console.log('تعديل المشروع:', project)
}

const deleteProject = async (project) => {
  if (confirm(`هل أنت متأكد من حذف المشروع "${project.title}"؟`)) {
    try {
      await providerService.deletePortfolioItem(project.id)
      await loadPage(portfolioData.value.current_page)
    } catch (error) {
      console.error('فشل حذف المشروع:', error)
      alert('فشل حذف المشروع. يرجى المحاولة مرة أخرى.')
    }
  }
}

onMounted(async () => {
  await loadPage(1)
})
</script>

<style scoped>
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