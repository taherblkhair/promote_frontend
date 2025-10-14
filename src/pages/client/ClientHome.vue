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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()
</script>