<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="لوحة مقدم الخدمة" 
      subtitle="إدارة خدماتك وطلبات العملاء"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- محتوى مخصص لمقدم الخدمة -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          مرحباً، {{ authStore.user?.name }}! 🛠️
        </h1>
        <p class="text-gray-600 text-lg">
          يمكنك من هنا إدارة خدماتك ومتابعة طلبات العملاء وتحقيق الأرباح.
        </p>
      </div>

      <!-- بطاقات مقدم الخدمة -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- ... بطاقات مخصصة لمقدم الخدمة -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()
</script>