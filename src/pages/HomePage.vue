<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      :title="welcomeTitle" 
      :subtitle="welcomeSubtitle"
    >
      <template #icon>
        <div class="bg-primary-100 p-3 rounded-2xl">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
      </template>

      <template #actions>
        <button 
          @click="authStore.logout()" 
          class="btn-secondary flex items-center space-x-2 space-x-reverse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>تسجيل الخروج</span>
        </button>
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
              {{ welcomeMessage }}
            </p>
          </div>
          <div class="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
            {{ userRoleText }}
          </div>
        </div>
      </div>

      <!-- البطاقات السريعة بناءً على الدور -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="card in quickActions" 
          :key="card.title"
          :to="card.route"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
        >
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
              <component :is="card.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ card.title }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ card.description }}</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- الإحصائيات (للمدير ومقدم الخدمة) -->
      <div v-if="showStats" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="stat in statistics" 
          :key="stat.label"
          class="bg-white rounded-xl shadow-lg p-6 border-l-4"
          :class="stat.borderColor"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            </div>
            <div class="p-3 rounded-full bg-opacity-10" :class="stat.bgColor">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

// الأيقونات
const ChartBarIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`
}

const ShoppingCartIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>`
}

const UsersIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>`
}

const CurrencyDollarIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v1m0-1v1m6-10a2 2 0 11-4 0 2 2 0 014 0zM6 16a2 2 0 11-4 0 2 2 0 014 0z"/>`
}

const authStore = useAuthStore()

// البيانات الحسابية
const welcomeTitle = computed(() => {
  switch(authStore.userRole) {
    case 'admin': return 'لوحة التحكم'
    case 'provider': return 'لوحة مقدم الخدمة'
    case 'client': return 'الصفحة الرئيسية'
    default: return 'مرحباً'
  }
})

const welcomeSubtitle = computed(() => {
  switch(authStore.userRole) {
    case 'admin': return 'إدارة النظام بالكامل'
    case 'provider': return 'إدارة خدماتك وطلبات العملاء'
    case 'client': return 'استعرض الخدمات وادفع طلباتك'
    default: return ''
  }
})

const welcomeMessage = computed(() => {
  switch(authStore.userRole) {
    case 'admin': return 'يمكنك من هنا إدارة المستخدمين والخدمات ومقدمي الخدمة.'
    case 'provider': return 'يمكنك من هنا إدارة خدماتك ومتابعة طلبات العملاء.'
    case 'client': return 'يمكنك من هنا استعراض الخدمات ودفع الطلبات ومتابعة طلباتك.'
    default: return 'مرحباً بك في نظامنا.'
  }
})

const userRoleText = computed(() => {
  const roles = {
    admin: 'مدير النظام',
    provider: 'مقدم خدمة',
    client: 'عميل'
  }
  return roles[authStore.userRole] || authStore.userRole
})

// الإجراءات السريعة بناءً على الدور
const quickActions = computed(() => {
  const baseActions = {
    admin: [
      {
        title: 'إدارة المستخدمين',
        description: 'عرض وإدارة جميع المستخدمين',
        route: '/admin/users',
        icon: UsersIcon
      },
      {
        title: 'الخدمات',
        description: 'إدارة جميع الخدمات في النظام',
        route: '/admin/services',
        icon: ShoppingCartIcon
      },
      {
        title: 'التقارير',
        description: 'عرض التقارير والإحصائيات',
        route: '/admin/reports',
        icon: ChartBarIcon
      }
    ],
    provider: [
      {
        title: 'خدماتي',
        description: 'إدارة الخدمات التي تقدمها',
        route: '/provider/services',
        icon: ShoppingCartIcon
      },
      {
        title: 'طلبات العملاء',
        description: 'عرض ومتابعة طلبات العملاء',
        route: '/provider/orders',
        icon: UsersIcon
      },
      {
        title: 'الإحصائيات',
        description: 'عرض إحصائيات أدائك',
        route: '/provider/stats',
        icon: ChartBarIcon
      }
    ],
    client: [
      {
        title: 'استعرض الخدمات',
        description: 'اكتشف الخدمات المتاحة',
        route: '/services',
        icon: ShoppingCartIcon
      },
      {
        title: 'طلباتي',
        description: 'عرض ومتابعة طلباتك',
        route: '/client/orders',
        icon: UsersIcon
      },
      {
        title: 'الملف الشخصي',
        description: 'إدارة معلومات حسابك',
        route: '/profile',
        icon: UsersIcon
      }
    ]
  }

  return baseActions[authStore.userRole] || []
})

// الإحصائيات (للمدير ومقدم الخدمة فقط)
const showStats = computed(() => ['admin', 'provider'].includes(authStore.userRole))

const statistics = computed(() => {
  const baseStats = {
    admin: [
      {
        label: 'إجمالي المستخدمين',
        value: '1,234',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: UsersIcon
      },
      {
        label: 'الخدمات النشطة',
        value: '567',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: ShoppingCartIcon
      },
      {
        label: 'إجمالي الإيرادات',
        value: '٥٠٬٠٠٠ د.ل',
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        icon: CurrencyDollarIcon
      },
      {
        label: 'الطلبات الجديدة',
        value: '89',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
        icon: ChartBarIcon
      }
    ],
    provider: [
      {
        label: 'خدماتي النشطة',
        value: '12',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: ShoppingCartIcon
      },
      {
        label: 'الطلبات الجديدة',
        value: '5',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: UsersIcon
      },
      {
        label: 'إجمالي الأرباح',
        value: '٨٬٥٠٠ د.ل',
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        icon: CurrencyDollarIcon
      },
      {
        label: 'تقييم العملاء',
        value: '4.8/5',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
        icon: ChartBarIcon
      }
    ]
  }

  return baseStats[authStore.userRole] || []
})
</script>