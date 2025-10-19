<template>
    <AdminLayout>

    <!-- Sidebar -->
    
    <!-- المحتوى الرئيسي -->
      <!-- Header -->
      
      <!-- المحتوى -->
      <main class="mt-16 p-6">
        <!-- العنوان -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p class="text-gray-600">نظرة عامة على النظام</p>
        </div>

        <!-- حالة التحميل -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>

        <!-- الإحصائيات -->
        <div v-else class="space-y-6">
          <!-- بطاقات الإحصائيات -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="إجمالي المستخدمين"
              :value="dashboardData.users_count"
              icon="👥"
              color="blue"
              :change="12"
            />
            <StatCard
              title="مزودي الخدمات"
              :value="dashboardData.providers_count"
              icon="🔧"
              color="green"
              :change="8"
            />
            <StatCard
              title="العملاء"
              :value="dashboardData.clients_count"
              icon="👤"
              color="purple"
              :change="15"
            />
            <StatCard
              title="الخدمات"
              :value="dashboardData.services_count"
              icon="🛠️"
              color="orange"
              :change="5"
            />
            <StatCard
              title="الطلبات"
              :value="dashboardData.orders_count"
              icon="📦"
              color="indigo"
              :change="-2"
            />
            <StatCard
              title="متوسط التقييم"
              :value="dashboardData.average_rating"
              icon="⭐"
              color="yellow"
              :change="0.4"
            />
          </div>

          <!-- الرسوم البيانية والإحصائيات -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- آخر المستخدمين -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">آخر المستخدمين</h3>
              <div class="space-y-3">
                <div v-for="user in recentUsers" :key="user.id" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-gray-600 font-medium text-sm">{{ getInitials(user.name) }}</span>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-sm text-gray-500">{{ user.role }}</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">{{ user.time }}</span>
                </div>
              </div>
            </div>

            <!-- الطلبات الحديثة -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">الطلبات الحديثة</h3>
              <div class="space-y-3">
                <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border">
                  <div class="text-right flex-1">
                    <p class="font-medium text-gray-900">{{ order.service }}</p>
                    <p class="text-sm text-gray-500">{{ order.client }}</p>
                  </div>
                  <div class="flex flex-col items-end space-y-1">
                    <span :class="`px-3 py-1 rounded-full text-xs font-medium ${order.statusClass}`">
                      {{ order.status }}
                    </span>
                    <span class="text-xs text-gray-500">{{ order.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- إحصائيات سريعة -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">نظرة سريعة على النظام</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 border rounded-lg bg-blue-50">
                <p class="text-2xl font-bold text-blue-600">{{ dashboardData.orders_count }}</p>
                <p class="text-sm text-gray-600 mt-1">طلب جديد</p>
              </div>
              <div class="text-center p-4 border rounded-lg bg-green-50">
                <p class="text-2xl font-bold text-green-600">{{ dashboardData.services_count }}</p>
                <p class="text-sm text-gray-600 mt-1">خدمة نشطة</p>
              </div>
              <div class="text-center p-4 border rounded-lg bg-purple-50">
                <p class="text-2xl font-bold text-purple-600">{{ dashboardData.users_count }}</p>
                <p class="text-sm text-gray-600 mt-1">مستخدم مسجل</p>
              </div>
              <div class="text-center p-4 border rounded-lg bg-yellow-50">
                <p class="text-2xl font-bold text-yellow-600">{{ dashboardData.average_rating }}/5</p>
                <p class="text-sm text-gray-600 mt-1">متوسط التقييم</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import StatCard from '@/components/admin/StatCard.vue'
import { adminService } from '@/services/adminService'
import AdminLayout from '@/layouts/AdminLayout.vue'

const loading = ref(true)
const dashboardData = ref({})
const sidebarOpen = ref(true)

// بيانات وهمية للعرض
const recentUsers = ref([
  { id: 1, name: 'أحمد محمد', role: 'مزود خدمة', time: 'منذ 5 دقائق' },
  { id: 2, name: 'فاطمة علي', role: 'عميل', time: 'منذ 15 دقيقة' },
  { id: 3, name: 'خالد حسن', role: 'مزود خدمة', time: 'منذ ساعة' }
])

const recentOrders = ref([
  { 
    id: 1, 
    service: 'تصميم شعار', 
    client: 'شركة التقنية', 
    status: 'مكتمل', 
    statusClass: 'bg-green-100 text-green-800',
    time: 'منذ يومين'
  },
  { 
    id: 2, 
    service: 'تطوير موقع', 
    client: 'محل الأزياء', 
    status: 'قيد التنفيذ', 
    statusClass: 'bg-blue-100 text-blue-800',
    time: 'منذ 3 ساعات'
  },
  { 
    id: 3, 
    service: 'تصوير منتجات', 
    client: 'متجر إلكتروني', 
    status: 'قيد الانتظار', 
    statusClass: 'bg-yellow-100 text-yellow-800',
    time: 'منذ ساعة'
  }
])

// دالة للحصول على الأحرف الأولى من الاسم
const getInitials = (name) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

onMounted(async () => {
  await loadDashboardData()
})

const loadDashboardData = async () => {
  try {
    const response = await adminService.getDashboard()
    dashboardData.value = response.data
  } catch (error) {
    console.error('فشل تحميل البيانات:', error)
    // استخدام بيانات وهمية للاختبار
    dashboardData.value = {
      users_count: 156,
      providers_count: 42,
      clients_count: 114,
      services_count: 89,
      orders_count: 234,
      average_rating: 4.7
    }
  } finally {
    loading.value = false
  }
}

const handleSidebarToggle = (isOpen) => {
  sidebarOpen.value = isOpen
}
</script>