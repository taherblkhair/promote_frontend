<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto">
      <!-- العنوان والإحصائيات -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
            <p class="text-gray-600">إدارة جميع طلبات الخدمات في النظام</p>
          </div>
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              @click="exportOrders"
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
            <p class="text-2xl font-bold text-purple-600">{{ stats.totalOrders }}</p>
            <p class="text-sm text-gray-600">إجمالي الطلبات</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ stats.pendingOrders }}</p>
            <p class="text-sm text-gray-600">قيد الانتظار</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ stats.completedOrders }}</p>
            <p class="text-sm text-gray-600">مكتملة</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-red-600">{{ stats.canceledOrders }}</p>
            <p class="text-sm text-gray-600">ملغاة</p>
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
                placeholder="ابحث باسم العميل أو مقدم الخدمة أو الملاحظات..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                @input="debouncedSearch"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- فلترة بالحالة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حالة الطلب</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="loadOrders"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="completed">مكتملة</option>
              <option value="canceled">ملغاة</option>
            </select>
          </div>

          <!-- فلترة بالخدمة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نوع الخدمة</label>
            <select
              v-model="filters.service"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="loadOrders"
            >
              <option value="">جميع الخدمات</option>
              <option v-for="service in uniqueServices" :key="service" :value="service">
                {{ service }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- جدول الطلبات -->
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
                  الطلب
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مقدم الخدمة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخدمة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                      </div>
                    </div>
                    <div class="mr-4">
                      <div class="text-sm font-medium text-gray-900">طلب #{{ order.id }}</div>
                      <div class="text-sm text-gray-500 line-clamp-2" :title="order.notes">
                        {{ order.notes || 'لا توجد ملاحظات' }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- العميل -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-blue-700 font-medium text-xs">
                          {{ getInitials(order.client.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="mr-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.client.name }}</div>
                      <div v-if="order.client.phone" class="text-xs text-gray-500">{{ order.client.phone }}</div>
                    </div>
                  </div>
                </td>

                <!-- مقدم الخدمة -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="text-green-700 font-medium text-xs">
                          {{ getInitials(order.provider.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="mr-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.provider.name }}</div>
                      <div v-if="order.provider.phone" class="text-xs text-gray-500">{{ order.provider.phone }}</div>
                    </div>
                  </div>
                </td>

                <!-- الخدمة -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 mr-3">
                      <img 
                        v-if="order.service.image_url" 
                        :src="order.service.image_url" 
                        :alt="order.service.title"
                        class="h-10 w-10 rounded-lg object-cover"
                      >
                      <div v-else class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ order.service.title }}</div>
                      <div class="text-xs text-gray-500">{{ order.service.category || 'بدون تصنيف' }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatPrice(order.service.price) }} ر.س
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <!-- عرض التفاصيل -->
                    <button
                      @click="viewOrderDetails(order)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>

                    <!-- تغيير الحالة -->
                    <button
                      v-if="order.status !== 'completed' && order.status !== 'canceled'"
                      @click="updateOrderStatus(order)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="تغيير الحالة"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                    </button>

                    <!-- حذف الطلب -->
                    <button
                      v-if="order.status === 'pending' || order.status === 'canceled'"
                      @click="deleteOrder(order)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="حذف الطلب"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- لا توجد بيانات -->
          <div v-if="filteredOrders.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="text-gray-500 text-lg">لا توجد طلبات</p>
            <p class="text-gray-400 mt-2">لم يتم العثور على طلبات مطابقة لمعايير البحث</p>
          </div>
        </div>
      </div>

      <!-- التصفح -->
      <div v-if="!loading && filteredOrders.length > 0" class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div class="flex justify-between flex-1 sm:hidden">
          <button class="btn-secondary">السابق</button>
          <button class="btn-secondary">التالي</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              عرض
              <span class="font-medium">{{ filteredOrders.length }}</span>
              من
              <span class="font-medium">{{ stats.totalOrders }}</span>
              نتائج
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تفاصيل الطلب -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">تفاصيل الطلب #{{ selectedOrder?.id }}</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div v-if="selectedOrder" class="space-y-6">
            <!-- معلومات الطلب الأساسية -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900">معلومات الطلب</h4>
                <div class="flex justify-between">
                  <span class="text-gray-600">رقم الطلب:</span>
                  <span class="font-medium">#{{ selectedOrder.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الحالة:</span>
                  <span :class="getStatusBadgeClass(selectedOrder.status)">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">تاريخ الإنشاء:</span>
                  <span class="font-medium">{{ formatDate(selectedOrder.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">آخر تحديث:</span>
                  <span class="font-medium">{{ formatDate(selectedOrder.updated_at) }}</span>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900">الملاحظات</h4>
                <p class="text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {{ selectedOrder.notes || 'لا توجد ملاحظات' }}
                </p>
              </div>
            </div>

            <!-- معلومات الأطراف -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- معلومات العميل -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <h5 class="font-semibold text-blue-900 mb-3">معلومات العميل</h5>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-blue-700">الاسم:</span>
                    <span class="font-medium">{{ selectedOrder.client.name }}</span>
                  </div>
                  <div v-if="selectedOrder.client.phone" class="flex justify-between">
                    <span class="text-blue-700">الهاتف:</span>
                    <span class="font-medium">{{ selectedOrder.client.phone }}</span>
                  </div>
                  <div v-if="selectedOrder.client.address" class="flex justify-between">
                    <span class="text-blue-700">العنوان:</span>
                    <span class="font-medium">{{ selectedOrder.client.address }}</span>
                  </div>
                  <div v-if="selectedOrder.client.bio" class="flex justify-between">
                    <span class="text-blue-700">نبذة:</span>
                    <span class="font-medium">{{ selectedOrder.client.bio }}</span>
                  </div>
                </div>
              </div>

              <!-- معلومات مقدم الخدمة -->
              <div class="bg-green-50 p-4 rounded-lg">
                <h5 class="font-semibold text-green-900 mb-3">معلومات مقدم الخدمة</h5>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-green-700">الاسم:</span>
                    <span class="font-medium">{{ selectedOrder.provider.name }}</span>
                  </div>
                  <div v-if="selectedOrder.provider.phone" class="flex justify-between">
                    <span class="text-green-700">الهاتف:</span>
                    <span class="font-medium">{{ selectedOrder.provider.phone }}</span>
                  </div>
                  <div v-if="selectedOrder.provider.address" class="flex justify-between">
                    <span class="text-green-700">العنوان:</span>
                    <span class="font-medium">{{ selectedOrder.provider.address }}</span>
                  </div>
                  <div v-if="selectedOrder.provider.bio" class="flex justify-between">
                    <span class="text-green-700">نبذة:</span>
                    <span class="font-medium">{{ selectedOrder.provider.bio }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- معلومات الخدمة -->
            <div class="bg-purple-50 p-4 rounded-lg">
              <h5 class="font-semibold text-purple-900 mb-3">معلومات الخدمة</h5>
              <div class="flex items-start space-x-4 space-x-reverse">
                <img 
                  v-if="selectedOrder.service.image_url" 
                  :src="selectedOrder.service.image_url" 
                  :alt="selectedOrder.service.title"
                  class="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                >
                <div class="flex-1">
                  <h6 class="font-semibold text-lg">{{ selectedOrder.service.title }}</h6>
                  <p class="text-gray-600 mt-2 whitespace-pre-line">{{ selectedOrder.service.description }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-lg font-bold text-green-600">
                      {{ formatPrice(selectedOrder.service.price) }} ر.س
                    </span>
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <div class="flex items-center">
                        <svg v-for="star in 5" :key="star" 
                          class="w-4 h-4" 
                          :class="star <= selectedOrder.service.average_rating ? 'text-yellow-400' : 'text-gray-300'"
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                      <span class="text-sm text-gray-500">
                        ({{ selectedOrder.service.reviews_count }} تقييم)
                      </span>
                    </div>
                  </div>
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
const orders = ref([])
const selectedOrder = ref(null)

const stats = reactive({
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  canceledOrders: 0
})

const filters = reactive({
  search: '',
  status: '',
  service: ''
})

// الحسابات
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = !filters.search || 
      order.client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (order.notes && order.notes.toLowerCase().includes(filters.search.toLowerCase()))
    
    const matchesStatus = !filters.status || order.status === filters.status
    const matchesService = !filters.service || order.service.title.includes(filters.service)
    
    return matchesSearch && matchesStatus && matchesService
  })
})

const uniqueServices = computed(() => {
  const services = orders.value.map(order => order.service.title)
  return [...new Set(services)]
})

// الدوال
onMounted(() => {
  loadOrders()
})

const loadOrders = async () => {
  loading.value = true
  try {
    const response = await adminService.getOrders()
    orders.value = response.data
    calculateStats()
  } catch (error) {
    console.error('Error loading orders:', error)
    // استخدام بيانات وهمية للاختبار
    orders.value = [
      {
        "id": 1,
        "client_id": 2,
        "provider_id": 1,
        "service_id": 1,
        "status": "completed",
        "notes": "هل يمكن تنسيق على عمل",
        "created_at": "2025-10-19T17:25:24.000000Z",
        "updated_at": "2025-10-19T17:25:24.000000Z",
        "client": {
          "id": 2,
          "name": "client",
          "phone": null,
          "address": null,
          "bio": null
        },
        "provider": {
          "id": 1,
          "name": "provider",
          "phone": "09122222",
          "address": "tripoli",
          "bio": "مقدم خدمات تصميم بوسترات"
        },
        "service": {
          "id": 1,
          "title": "تصميم البوسترات سوشيال ميديا",
          "description": "🎨 تصميم بوسترات إحترافية\n• تصميمات مبتكرة وجذابة\n• ألوان متناسقة وعصرية\n• جودة عالية للطباعة\n• تسليم سريع في الوقت المحدد",
          "price": "250.00",
          "image": "services/GBv5b3dDek9ObVAJ8msbF3bVeGw9RerD3rOapd3l.png",
          "average_rating": 5,
          "reviews_count": 1,
          "is_active": 1,
          "created_at": "2025-10-19T17:07:49.000000Z",
          "image_url": "http://127.0.0.1:8000/storage/services/GBv5b3dDek9ObVAJ8msbF3bVeGw9RerD3rOapd3l.png"
        }
      }
    ]
    calculateStats()
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.totalOrders = orders.value.length
  stats.pendingOrders = orders.value.filter(o => o.status === 'pending').length
  stats.completedOrders = orders.value.filter(o => o.status === 'completed').length
  stats.canceledOrders = orders.value.filter(o => o.status === 'canceled').length
}

const debouncedSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => {
    // البحث يتم تلقائياً عبر computed property
  }, 300)
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'قيد الانتظار',
    'completed': 'مكتملة',
    'canceled': 'ملغاة'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const classMap = {
    'pending': 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    'completed': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    'canceled': 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
  }
  return classMap[status] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('ar-SA')
}

const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const updateOrderStatus = async (order) => {
  const newStatus = order.status === 'pending' ? 'completed' : 'pending'
  const confirmMessage = `هل أنت متأكد من تغيير حالة الطلب #${order.id} إلى "${getStatusText(newStatus)}"؟`
  
  if (!confirm(confirmMessage)) return

  updating.value = true
  try {
    await adminService.updateOrderStatus(order.id, { status: newStatus })
    
    // تحديث الحالة محلياً
    order.status = newStatus
    calculateStats() // إعادة حساب الإحصائيات
    
    alert(`تم تغيير حالة الطلب بنجاح إلى "${getStatusText(newStatus)}"!`)
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('فشل في تغيير حالة الطلب')
  } finally {
    updating.value = false
  }
}

const deleteOrder = async (order) => {
  const confirmMessage = `هل أنت متأكد من حذف الطلب #${order.id}؟ هذا الإجراء لا يمكن التراجع عنه.`
  
  if (!confirm(confirmMessage)) return

  updating.value = true
  try {
    await adminService.deleteOrder(order.id)
    
    // إزالة الطلب محلياً
    orders.value = orders.value.filter(o => o.id !== order.id)
    calculateStats() // إعادة حساب الإحصائيات
    
    alert('تم حذف الطلب بنجاح!')
  } catch (error) {
    console.error('Error deleting order:', error)
    alert('فشل في حذف الطلب')
  } finally {
    updating.value = false
  }
}

const exportOrders = () => {
  console.log('Exporting orders...')
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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