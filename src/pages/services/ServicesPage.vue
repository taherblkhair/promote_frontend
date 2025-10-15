<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      title="الخدمات" 
      subtitle="اكتشف الخدمات المتاحة والمناسبة لك"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- شريط البحث والتصفية -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- البحث بالاسم -->
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="ابحث عن خدمة..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- التصنيف -->
          <select
            v-model="filters.category"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="">جميع التصنيفات</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <!-- نطاق السعر -->
          <select
            v-model="filters.priceRange"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="">جميع الأسعار</option>
            <option value="0-100">حتى 100 ر.س</option>
            <option value="100-500">100 - 500 ر.س</option>
            <option value="500-1000">500 - 1000 ر.س</option>
            <option value="1000-999999">أكثر من 1000 ر.س</option>
          </select>

          <!-- الترتيب -->
          <select
            v-model="filters.sortBy"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="newest">الأحدث أولاً</option>
            <option value="price_low">السعر: من الأقل للأعلى</option>
            <option value="price_high">السعر: من الأعلى للأقل</option>
            <option value="popular">الأكثر طلباً</option>
            <option value="name">الاسم: أ-ي</option>
          </select>
        </div>

        <!-- أزرار التصفية الإضافية -->
        <div class="flex flex-wrap gap-3 mt-4">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedTags.includes(tag)
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ tag }}
          </button>
        </div>

        <!-- إحصائيات النتائج -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <p class="text-gray-600">
            عرض <span class="font-bold text-primary-600">{{ filteredServices.length }}</span> خدمة
          </p>
          <button
            @click="resetFilters"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1 space-x-reverse"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>إعادة التعيين</span>
          </button>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل الخدمات...</p>
      </div>

      <!-- الشبكة الرئيسية للخدمات -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="service in paginatedServices"
          :key="service.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
        >
          <!-- صورة الخدمة -->
          <div class="relative overflow-hidden">
            <router-link :to="`/services/${service.id}`">
              <img
                v-if="service.image"
                :src="service.image"
                :alt="service.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
              >
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </router-link>

            <!-- شارة التصنيف -->
            <div class="absolute top-3 left-3">
              <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {{ service.category }}
              </span>
            </div>

            <!-- شارة الطلبات -->
            <div class="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
              <div class="flex items-center space-x-1 space-x-reverse text-xs text-gray-700">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2z"/>
                </svg>
                <span class="font-bold">{{ service.orders_count || 0 }}</span>
                <span>طلبات</span>
              </div>
            </div>
          </div>

          <!-- محتوى الخدمة -->
          <div class="p-5">
            <!-- العنوان والوصف -->
            <router-link :to="`/services/${service.id}`" class="block mb-3">
              <h3 class="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                {{ service.title }}
              </h3>
            </router-link>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ service.description }}
            </p>

            <!-- التقييم -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-1 space-x-reverse">
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4" :class="star <= (service.rating || 0) ? 'fill-current' : 'fill-gray-300'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-500">({{ service.reviews_count || 0 }})</span>
              </div>
              
              <!-- الوقت المقدر -->
              <div class="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ service.delivery_time || '3-5' }} أيام</span>
              </div>
            </div>

            <!-- السعر والزر -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span class="text-2xl font-bold text-primary-600">{{ service.price }}</span>
                <span class="text-gray-500 text-sm mr-1">ر.س</span>
              </div>
              
              <router-link
                :to="`/services/${service.id}`"
                class="btn-primary flex items-center space-x-2 space-x-reverse text-sm px-4 py-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span>تفاصيل</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود نتائج -->
      <div v-if="!loading && filteredServices.length === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">لا توجد خدمات</h3>
          <p class="text-gray-600 mb-6">لم نعثر على خدمات تطابق معايير البحث الخاصة بك.</p>
          <button
            @click="resetFilters"
            class="btn-primary"
          >
            عرض جميع الخدمات
          </button>
        </div>
      </div>

      <!-- الترقيم -->
      <div v-if="filteredServices.length > itemsPerPage" class="flex justify-center mt-12">
        <div class="flex items-center space-x-2 space-x-reverse bg-white rounded-2xl shadow-lg p-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <div class="flex items-center space-x-1 space-x-reverse">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-10 h-10 rounded-lg font-medium transition-all duration-200',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { servicesService } from '@/services/servicesService'
import AppHeader from '@/components/AppHeader.vue'

const services = ref([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 12

// الفلاتر
const filters = reactive({
  search: '',
  category: '',
  priceRange: '',
  sortBy: 'newest'
})

const selectedTags = ref([])

// البيانات الافتراضية
const categories = ref([
  'تسويق إلكتروني',
  'تصميم جرافيك',
  'برمجة وتطوير',
  'كتابة المحتوى',
  'تصوير وفيديو',
  'استشارات أعمال'
])

// const popularTags = ref([
//   'مميز',
//   'سريع',
//   'جديد',
//   'الأكثر طلباً',
//   'عروض خاصة'
// ])

// جلب الخدمات
onMounted(async () => {
  try {
    const response = await servicesService.getClientServices()
    services.value = response.data
  } catch (error) {
    console.error('فشل جلب الخدمات:', error)
  } finally {
    loading.value = false
  }
})

// الخدمات المصفاة
const filteredServices = computed(() => {
  let filtered = services.value

  // البحث بالاسم
  if (filters.search) {
    filtered = filtered.filter(service =>
      service.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  // التصنيف
  if (filters.category) {
    filtered = filtered.filter(service => service.category === filters.category)
  }

  // نطاق السعر
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number)
    filtered = filtered.filter(service => {
      const price = parseFloat(service.price) || 0
      return price >= min && price <= max
    })
  }

  // الترتيب
  switch (filters.sortBy) {
    case 'price_low':
      filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0))
      break
    case 'price_high':
      filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0))
      break
    case 'popular':
      filtered.sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0))
      break
    case 'name':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
  }

  return filtered
})

// الترقيم
const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage))

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredServices.value.slice(start, end)
})

// الدوال المساعدة
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.priceRange = ''
  filters.sortBy = 'newest'
  selectedTags.value = []
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// إعادة تعيين الترقيم عند تغيير الفلاتر
watch(filters, () => {
  currentPage.value = 1
})

watch(selectedTags, () => {
  currentPage.value = 1
})
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
</style>