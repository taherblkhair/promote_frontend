<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- أيقونة -->
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>

        <!-- النص -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">الصفحة غير موجودة</h2>
        <p class="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <!-- الأزرار -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="goBack" 
            class="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>العودة للخلف</span>
          </button>
          
          <router-link 
            to="/" 
            class="btn-primary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>الصفحة الرئيسية</span>
          </router-link>
        </div>

        <!-- معلومات إضافية للمستخدم المسجل -->
        <div v-if="authStore.isAuthenticated" class="mt-8 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-2">مسجل دخول كـ:</p>
          <div class="flex items-center justify-center space-x-2 space-x-reverse">
            <span class="font-medium text-gray-800">{{ authStore.user?.name }}</span>
            <span class="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              {{ getUserRoleText(authStore.userRole) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const getUserRoleText = (role) => {
  const roles = {
    admin: 'مدير',
    provider: 'مقدم خدمة',
    client: 'عميل'
  }
  return roles[role] || role
}
</script>