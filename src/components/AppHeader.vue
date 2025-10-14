<template>
  <header class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- الجزء الأيسر: العنوان والأيقونة -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="bg-primary-100 p-3 rounded-2xl">
            <slot name="icon">
              <!-- أيقونة افتراضية -->
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </slot>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              <slot name="title">{{ title }}</slot>
            </h1>
            <p v-if="subtitle" class="text-gray-600 mt-1 text-sm">{{ subtitle }}</p>
          </div>
        </div>

        <!-- الجزء الأيمن: الإجراءات -->
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- زر العودة للرئيسية الذكي -->
          <button 
            v-if="showHomeButton && authStore.isAuthenticated"
            @click="goToHome"
            class="btn-secondary flex items-center space-x-2 space-x-reverse transition-all duration-200 hover:bg-gray-300"
            :title="`العودة إلى ${userHomeTitle}`"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>{{ userHomeTitle }}</span>
          </button>

          <!-- معلومات المستخدم (للمستخدمين المسجلين) -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3 space-x-reverse mr-2">
            <!-- صورة المستخدم أو الأحرف الأولى -->
            <div class="flex items-center space-x-2 space-x-reverse">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-bold text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <div class="hidden sm:block text-right">
                <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500">{{ userRoleText }}</p>
              </div>
            </div>

            <!-- زر تسجيل الخروج -->
            <button
              @click="handleLogout"
              class="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
              title="تسجيل الخروج"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="hidden md:inline text-sm font-medium">تسجيل الخروج</span>
            </button>
          </div>

          <!-- الإجراءات الإضافية من الـ slot -->
          <slot name="actions">
            <!-- إجراءات افتراضية للمستخدمين غير المسجلين -->
            <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-3 space-x-reverse">
              <router-link to="/login" class="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                تسجيل الدخول
              </router-link>
              <router-link to="/register" class="btn-primary">
                إنشاء حساب
              </router-link>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const props = defineProps({
  title: {
    type: String,
    default: 'العنوان'
  },
  subtitle: {
    type: String,
    default: ''
  },
  // إمكانية إخفاء زر العودة للرئيسية
  hideHomeButton: {
    type: Boolean,
    default: false
  }
})

// الأحرف الأولى من اسم المستخدم
const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// نص دور المستخدم
const userRoleText = computed(() => {
  const roles = {
    admin: 'مدير النظام',
    provider: 'مقدم خدمة',
    client: 'عميل'
  }
  return roles[authStore.userRole] || authStore.userRole
})

// عنوان الصفحة الرئيسية للمستخدم
const userHomeTitle = computed(() => {
  switch(authStore.userRole) {
    case 'admin': return 'لوحة المدير'
    case 'provider': return 'لوحة مقدم الخدمة'
    case 'client': return 'الصفحة الرئيسية'
    default: return 'الرئيسية'
  }
})

// مسار الصفحة الرئيسية للمستخدم
const userHomeRoute = computed(() => {
  switch(authStore.userRole) {
    case 'admin': return '/admin'
    case 'provider': return '/provider'
    case 'client': return '/home'
    default: return '/'
  }
})

// هل نعرض زر العودة للرئيسية؟
const showHomeButton = computed(() => {
  if (props.hideHomeButton) return false
  if (!authStore.isAuthenticated) return false
  
  // لا نعرض الزر إذا كنا بالفعل في الصفحة الرئيسية
  const currentRoute = route.path
  const homeRoute = userHomeRoute.value
  
  return currentRoute !== homeRoute
})

// التوجيه للصفحة الرئيسية
const goToHome = () => {
  router.push(userHomeRoute.value)
}

// تسجيل الخروج
const handleLogout = async () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    try {
      await authStore.logout()
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
}
</script>

<style scoped>
/* تحسينات بسيطة للتصميم */
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
</style>