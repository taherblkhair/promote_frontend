<template>
  <!-- Overlay للجوال -->
  <div 
    v-if="isMobile && isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="$emit('toggle')"
  ></div>

  <!-- Sidebar -->
  <aside 
    :class="[
      'bg-gray-800 min-h-screen fixed top-0 overflow-y-auto transition-all duration-300 z-50',
      isOpen ? 'w-64' : 'w-20',
      'right-0'
    ]"
  >
    <!-- الشعار وزر القفل -->
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <div v-if="isOpen" class="flex items-center space-x-3 space-x-reverse">
          <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 class="text-white font-bold text-lg">الإدارة</h1>
            <p class="text-gray-400 text-xs">لوحة التحكم</p>
          </div>
        </div>
        
        <div v-else class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
          <span class="text-white font-bold text-lg">A</span>
        </div>

        <!-- زر إغلاق/فتح السايدبار -->
        <button 
          @click="$emit('toggle')"
          class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- القائمة -->
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.path"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group"
            :class="{ 'bg-purple-600 text-white': $route.path === item.path }"
          >
            <div class="relative">
              <component :is="item.icon" class="w-5 h-5" />
              <span v-if="item.badge" class="absolute -top-2 -left-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {{ item.badge }}
              </span>
            </div>
            <span :class="['transition-all duration-300', isOpen ? 'opacity-100' : 'opacity-0 w-0']">
              {{ item.name }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- معلومات النظام -->
    <div v-if="isOpen" class="absolute bottom-4 right-4 left-4">
      <div class="bg-gray-700 rounded-lg p-3 text-center">
        <p class="text-white text-sm font-medium">النظام</p>
        <p class="text-gray-400 text-xs">مستقر • 100%</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// الأيقونات
const HomeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  `
}

const UsersIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
    </svg>
  `
}

const ServicesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  `
}

const OrdersIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
    </svg>
  `
}

const AnalyticsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  `
}

const route = useRoute()
const isMobile = ref(false)

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

const menuItems = computed(() => [
  { 
    name: 'لوحة التحكم', 
    path: '/admin', 
    icon: HomeIcon,
    badge: null
  },
  { 
    name: 'المستخدمين', 
    path: '/admin/users', 
    icon: UsersIcon,
    badge: null
  },
  { 
    name: 'الخدمات', 
    path: '/admin/services', 
    icon: ServicesIcon,
    badge: null
  },
  { 
    name: 'الطلبات', 
    path: '/admin/orders', 
    icon: OrdersIcon,
    badge: null
  },
  { 
    name: 'التقارير', 
    path: '/admin/analytics', 
    icon: AnalyticsIcon,
    badge: null
  }
])

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.router-link-active {
  @apply bg-purple-600 text-white;
}
</style>