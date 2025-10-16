<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="لوحة التحكم" 
      subtitle="مرحباً بك في نظام Promote"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else class="space-y-8">
        <!-- بطاقة الترحيب -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                مرحباً، {{ dashboardData.user?.name }}! 🛠️
              </h1>
              <p class="text-gray-600 text-lg">
                {{ dashboardData.message }}
              </p>
            </div>
            <div class="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              مزود خدمة
            </div>
          </div>
        </div>

        <!-- الإحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">إجمالي الخدمات</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ dashboardData.dashboard_data?.stats?.total_services || 0 }}
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
                <p class="text-gray-600 text-sm">الطلبات النشطة</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ dashboardData.dashboard_data?.stats?.active_orders || 0 }}
                </p>
              </div>
              <div class="p-3 rounded-full bg-green-100">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">إجمالي الأرباح</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ (dashboardData.dashboard_data?.stats?.total_earnings || 0) }} د.ل
                </p>
              </div>
              <div class="p-3 rounded-full bg-purple-100">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v1m0-1v1m6-10a2 2 0 11-4 0 2 2 0 014 0zM6 16a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- البطاقات السريعة -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link 
            to="/provider/services"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
          >
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-primary-100 p-3 rounded-xl group-hover:bg-primary-200 transition-colors duration-200">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">إدارة الخدمات</h3>
                <p class="text-gray-600 text-sm mt-1">عرض وإدارة خدماتك</p>
              </div>
            </div>
          </router-link>

          <router-link 
            to="/provider/orders"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
          >
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-primary-100 p-3 rounded-xl group-hover:bg-primary-200 transition-colors duration-200">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">الطلبات</h3>
                <p class="text-gray-600 text-sm mt-1">متابعة طلبات العملاء</p>
              </div>
            </div>
          </router-link>

          <router-link 
            to="/provider/add-service"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
          >
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-primary-100 p-3 rounded-xl group-hover:bg-primary-200 transition-colors duration-200">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">إضافة خدمة</h3>
                <p class="text-gray-600 text-sm mt-1">إضافة خدمة جديدة</p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- النشاط الأخير -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">النشاط الأخير</h3>
          <div class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>لا يوجد نشاط حديث</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const dashboardData = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await providerService.getDashboard()
    dashboardData.value = response.data
  } catch (error) {
    console.error('فشل جلب بيانات لوحة التحكم:', error)
  } finally {
    loading.value = false
  }
})
</script>