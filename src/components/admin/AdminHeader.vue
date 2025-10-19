<template>
  <header class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- الجزء الأيسر -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- زر فتح/إغلاق السايدبار للجوال -->
          <button 
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- العنوان -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
            <p class="text-gray-600 text-sm">{{ pageSubtitle }}</p>
          </div>
        </div>

        <!-- الجزء الأيمن -->
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- زر الإشعارات -->
          <div class="relative">
            <button 
              @click="toggleNotifications"
              class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="الإشعارات"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z"/>
              </svg>
              <span 
                v-if="unreadNotificationsCount > 0"
                class="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ unreadNotificationsCount }}
              </span>
            </button>
          </div>

          <!-- الملف الشخصي -->
          <div class="relative">
            <button 
              @click="toggleProfileMenu"
              class="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-200">
                <span class="text-white font-semibold text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <div class="hidden sm:block text-right">
                <p class="text-sm font-medium text-gray-900">{{ adminData.name }}</p>
                <p class="text-xs text-purple-600 font-medium">مدير النظام</p>
              </div>
              <svg 
                class="w-4 h-4 text-gray-500 transition-transform duration-200" 
                :class="{ 'rotate-180': showProfileMenu }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- قائمة الملف الشخصي -->
            <div 
              v-if="showProfileMenu"
              class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-1 z-50"
            >
              <div class="px-4 py-3 border-b">
                <p class="text-sm font-medium text-gray-900">{{ adminData.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ adminData.email }}</p>
              </div>

              <button 
                @click="goToProfile"
                class="flex items-center space-x-2 space-x-reverse w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>الملف الشخصي</span>
              </button>

              <button 
                @click="goToSystemSettings"
                class="flex items-center space-x-2 space-x-reverse w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>إعدادات النظام</span>
              </button>

              <div class="border-t my-1"></div>

              <button 
                @click="handleLogout"
                class="flex items-center space-x-2 space-x-reverse w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// الحالة
const showProfileMenu = ref(false)
const showNotifications = ref(false)

// بيانات المدير
const adminData = reactive({
  name: '',
  email: ''
})

// البيانات
const notifications = ref([
  { 
    id: 1, 
    title: 'مستخدم جديد', 
    message: 'تم تسجيل مستخدم جديد في النظام', 
    time: 'منذ 5 دقائق', 
    unread: true, 
    iconColor: 'bg-green-500',
    type: 'user',
    action: '/admin/users'
  }
])

const emit = defineEmits(['toggle-sidebar'])

// الحسابات
const userInitials = computed(() => {
  return adminData.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': 'لوحة التحكم',
    '/admin/users': 'إدارة المستخدمين',
    '/admin/services': 'إدارة الخدمات',
    '/admin/orders': 'إدارة الطلبات',
    '/admin/analytics': 'التقارير والإحصائيات',
    '/admin/profile': 'الملف الشخصي'
  }
  return titles[route.path] || 'لوحة التحكم'
})

const pageSubtitle = computed(() => {
  const subtitles = {
    '/admin/dashboard': 'نظرة عامة على النظام',
    '/admin/users': 'إدارة حسابات المستخدمين',
    '/admin/services': 'مراقبة وعرض الخدمات',
    '/admin/orders': 'تتبع حالة الطلبات',
    '/admin/analytics': 'تقارير وأداء النظام',
    '/admin/profile': 'إدارة معلومات المدير'
  }
  return subtitles[route.path] || 'إدارة النظام'
})

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(n => n.unread).length
})

// الدوال
onMounted(() => {
  loadAdminData()
})

const loadAdminData = () => {
  adminData.name = authStore.user?.name || 'مدير النظام'
  adminData.email = authStore.user?.email || 'admin@example.com'
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showProfileMenu.value = false
}

const goToProfile = () => {
  showProfileMenu.value = false
  router.push('/admin/profile')
}

const goToSystemSettings = () => {
  showProfileMenu.value = false
  router.push('/admin/settings')
}

const handleLogout = async () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
}

// إغلاق القوائم عند النقر خارجها
const closeMenus = (event) => {
  if (!event.target.closest('.relative')) {
    showProfileMenu.value = false
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>