<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto">
      <!-- العنوان والإحصائيات -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">إدارة الخدمات</h1>
            <p class="text-gray-600">إدارة الخدمات المقدمة في النظام</p>
          </div>
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              @click="exportServices"
              class="btn-secondary flex items-center space-x-2 space-x-reverse"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              <span>تصدير</span>
            </button>
          </div>
        </div>

        <!-- إحصائيات سريعة -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-purple-600">{{ stats.totalServices }}</p>
            <p class="text-sm text-gray-600">إجمالي الخدمات</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ stats.activeServices }}</p>
            <p class="text-sm text-gray-600">نشطة</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ stats.categories }}</p>
            <p class="text-sm text-gray-600">تصنيف</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-orange-600">{{ stats.averageRating }}/5</p>
            <p class="text-sm text-gray-600">متوسط التقييم</p>
          </div>
        </div>
      </div>

      <!-- فلترة وبحث -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- البحث -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">بحث</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="ابحث باسم الخدمة أو الوصف..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                @input="debouncedSearch"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- فلترة بالتصنيف -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
            <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="loadServices"
            >
              <option value="">جميع التصنيفات</option>
              <option value="تصميم">تصميم</option>
              <option value="برمجة">برمجة</option>
              <option value="كتابة">كتابة</option>
              <option value="تسويق">تسويق</option>
              <option value="فيديو">فيديو</option>
              <option value="تصوير">تصوير</option>
            </select>
          </div>

          <!-- فلترة بالحالة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="loadServices"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشطة</option>
              <option value="inactive">غير نشطة</option>
            </select>
          </div>
        </div>
      </div>

      <!-- جدول الخدمات -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <!-- حالة التحميل -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>

        <!-- الجدول -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخدمة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مقدم الخدمة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيف
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقييم
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="service in filteredServices" 
                :key="service.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img 
                        v-if="service.image" 
                        :src="getImageUrl(service.image)" 
                        :alt="service.title"
                        class="h-12 w-12 rounded-lg object-cover"
                      >
                      <div v-else class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="mr-4">
                      <div class="text-sm font-medium text-gray-900">{{ service.title }}</div>
                      <div class="text-sm text-gray-500 line-clamp-2">{{ service.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-blue-700 font-medium text-xs">
                          {{ getProviderInitials(service.provider.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="mr-3">
                      <div class="text-sm font-medium text-gray-900">{{ service.provider.name }}</div>
                      <div class="text-xs text-gray-500">{{ service.provider.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {{ service.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatPrice(service.price) }} ر.س
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <svg v-for="star in 5" :key="star" 
                        class="w-4 h-4" 
                        :class="star <= service.average_rating ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor" viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <span class="text-xs text-gray-500 mr-2">
                      ({{ service.reviews_count }})
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(service.is_active)">
                    {{ getStatusText(service.is_active) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <button
                      @click="viewServiceDetails(service)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    <button
                      @click="toggleServiceStatus(service)"
                      :class="service.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                      class="transition-colors"
                      :title="service.is_active ? 'تعطيل' : 'تفعيل'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="service.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- لا توجد بيانات -->
          <div v-if="filteredServices.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <p class="text-gray-500 text-lg">لا توجد خدمات</p>
            <p class="text-gray-400 mt-2">لم يتم العثور على خدمات مطابقة لمعايير البحث</p>
          </div>
        </div>
      </div>

      <!-- التصفح -->
      <div v-if="!loading && filteredServices.length > 0" class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div class="flex justify-between flex-1 sm:hidden">
          <button class="btn-secondary">السابق</button>
          <button class="btn-secondary">التالي</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              عرض
              <span class="font-medium">{{ filteredServices.length }}</span>
              من
              <span class="font-medium">{{ stats.totalServices }}</span>
              نتائج
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تفاصيل الخدمة -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">تفاصيل الخدمة</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div v-if="selectedService" class="space-y-6">
            <!-- صورة الخدمة -->
            <div class="flex justify-center">
              <img 
                v-if="selectedService.image" 
                :src="getImageUrl(selectedService.image)" 
                :alt="selectedService.title"
                class="h-48 w-48 rounded-lg object-cover"
              >
              <div v-else class="h-48 w-48 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg class="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- معلومات الخدمة -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedService.title }}</h4>
                <p class="text-gray-600 whitespace-pre-line">{{ selectedService.description }}</p>
              </div>
              
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">مقدم الخدمة:</span>
                  <span class="font-medium">{{ selectedService.provider.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">البريد الإلكتروني:</span>
                  <span class="font-medium">{{ selectedService.provider.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">التصنيف:</span>
                  <span class="font-medium">{{ selectedService.category }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">السعر:</span>
                  <span class="font-medium text-green-600">{{ formatPrice(selectedService.price) }} ر.س</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">التقييم:</span>
                  <div class="flex items-center">
                    <span class="font-medium mr-2">{{ selectedService.average_rating }}/5</span>
                    <span class="text-gray-500">({{ selectedService.reviews_count }} تقييم)</span>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الحالة:</span>
                  <span :class="getStatusBadgeClass(selectedService.is_active)">
                    {{ getStatusText(selectedService.is_active) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">تاريخ الإنشاء:</span>
                  <span class="font-medium">{{ formatDate(selectedService.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/adminService'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()

// الحالة
const loading = ref(true)
const updating = ref(false)
const showDetailsModal = ref(false)

// البيانات
const services = ref([])
const selectedService = ref(null)

const stats = reactive({
  totalServices: 0,
  activeServices: 0,
  categories: 0,
  averageRating: 0
})

const filters = reactive({
  search: '',
  category: '',
  status: ''
})

// الحسابات
const filteredServices = computed(() => {
  return services.value.filter(service => {
    const matchesSearch = !filters.search || 
      service.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || service.category === filters.category
    const matchesStatus = !filters.status || 
      (filters.status === 'active' ? service.is_active : !service.is_active)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

// الدوال
onMounted(() => {
  loadServices()
})

const loadServices = async () => {
  loading.value = true
  try {
    const response = await adminService.getServices()
    services.value = response.data
    calculateStats()
  } catch (error) {
    console.error('Error loading services:', error)
    // استخدام بيانات وهمية للاختبار
    services.value = [
      {
        "id": 1,
        "provider_id": 1,
        "title": "تصميم البوسترات سوشيال ميديا",
        "description": "🎨 تصميم بوسترات إحترافية\n• تصميمات مبتكرة وجذابة\n• ألوان متناسقة وعصرية\n• جودة عالية للطباعة\n• تسليم سريع في الوقت المحدد",
        "category": "تصميم",
        "price": "250.00",
        "image": "services/GBv5b3dDek9ObVAJ8msbF3bVeGw9RerD3rOapd3l.png",
        "is_active": 1,
        "created_at": "2025-10-19T17:07:49.000000Z",
        "updated_at": "2025-10-19T17:07:49.000000Z",
        "average_rating": 4.5,
        "reviews_count": 12,
        "provider": {
          "id": 1,
          "name": "provider",
          "email": "provider@example.com"
        }
      },
      {
        "id": 2,
        "provider_id": 1,
        "title": "تطوير مواقع ويب متجاوبة",
        "description": "💻 تطوير مواقع ويب احترافية\n• تصميم متجاوب لجميع الشاشات\n• تحسين محركات البحث SEO\n• أداء عالي وسرعة في التحميل\n• دعم فني متكامل",
        "category": "برمجة",
        "price": "1500.00",
        "image": null,
        "is_active": 0,
        "created_at": "2025-10-18T10:30:00.000000Z",
        "updated_at": "2025-10-19T14:20:00.000000Z",
        "average_rating": 4.8,
        "reviews_count": 8,
        "provider": {
          "id": 1,
          "name": "provider",
          "email": "provider@example.com"
        }
      }
    ]
    calculateStats()
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.totalServices = services.value.length
  stats.activeServices = services.value.filter(s => s.is_active).length
  
  // حساب عدد التصنيفات الفريدة
  const uniqueCategories = [...new Set(services.value.map(s => s.category))]
  stats.categories = uniqueCategories.length
  
  // حساب متوسط التقييم
  const totalRating = services.value.reduce((sum, service) => sum + service.average_rating, 0)
  stats.averageRating = services.value.length > 0 ? (totalRating / services.value.length).toFixed(1) : 0
}

const debouncedSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => {
    // البحث يتم تلقائياً عبر computed property
  }, 300)
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // افترض أن الصور مخزنة في مجلد public أو يتم استرجاعها من الخادم
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

const getProviderInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getStatusText = (isActive) => {
  return isActive ? 'نشطة' : 'غير نشطة'
}

const getStatusBadgeClass = (isActive) => {
  return isActive 
    ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
    : 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
}

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('ar-SA')
}

const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const viewServiceDetails = (service) => {
  selectedService.value = service
  showDetailsModal.value = true
}

const toggleServiceStatus = async (service) => {
  const newStatus = !service.is_active
  const confirmMessage = `هل أنت متأكد من ${newStatus ? 'تفعيل' : 'تعطيل'} الخدمة "${service.title}"؟`
  
  if (!confirm(confirmMessage)) return

  updating.value = true
  try {
    await adminService.updateServiceStatus(service.id, { is_active: newStatus })
    
    // تحديث الحالة محلياً
    service.is_active = newStatus
    calculateStats() // إعادة حساب الإحصائيات
    
    alert(`تم ${newStatus ? 'تفعيل' : 'تعطيل'} الخدمة بنجاح!`)
  } catch (error) {
    console.error('Error toggling service status:', error)
    alert('فشل في تغيير حالة الخدمة')
  } finally {
    updating.value = false
  }
}

const exportServices = () => {
  console.log('Exporting services...')
  alert('سيتم تصدير البيانات قريباً')
}
</script>

<style scoped>
.btn-primary {
  @apply bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.max-h-90vh {
  max-height: 90vh;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.whitespace-pre-line {
  white-space: pre-line;
}
</style>