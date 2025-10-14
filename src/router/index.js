import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (typeof authStore.logout === 'function') {
        authStore.logout()
      }
      
    },
    component: () => import('@/pages/LandingPage.vue')
  },

  {
    path: '/',
    name: 'Landing',
    component: () => import('@/pages/LandingPage.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  // مسارات العميل
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/client/ClientHome.vue'),
    meta: { requiresAuth: true, allowedRoles: ['client'] }
  },
  {
  path: '/profile',
  name: 'Profile',
  component: () => import('@/pages/client/ClientProfile.vue'),
  meta: { requiresAuth: true, allowedRoles: ['client'] }
  },
  {
    path: '/client/orders',
    name: 'ClientOrders',
    component: () => import('@/pages/orders/ClientOrdersPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['client'] }
  },
  {
    path: '/services',
    name: 'ClientServices',
    component: () => import('@/pages/services/ServicesPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['client'] }
  },
    {
      path: '/services/:id',
      name: 'ClientServiceDetailsAlt',
      component: () => import('@/pages/services/ServiceDetailsPage.vue'),
      meta: { requiresAuth: true, allowedRoles: ['client'] }
    },
  // مسارات مقدم الخدمة
  {
    path: '/provider',
    name: 'ProviderHome',
    component: () => import('@/pages/provider/ProviderHome.vue'),
    meta: { requiresAuth: true, allowedRoles: ['provider'] }
  },
  {
    path: '/provider/services',
    name: 'ProviderServices',
    component: () => import('@/pages/services/ProviderServicesPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['provider'] }
  },

  // مسارات المديرf
  {
    path: '/admin',
    name: 'AdminHome',
    component: () => import('@/pages/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'], guestOnly: true }
  },
  
  // مسار للصفحات غير الموجودة
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// حماية المسارات
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login')
    } else if (to.meta.allowedRoles) {
      const userRole = authStore.userRole
      if (to.meta.allowedRoles.includes(userRole)) {
        next()
      } else {
        // توجيه كل مستخدم لصفحة Home الخاصة بدوره
        const homeRoute = getHomeRoute(userRole)
        next(homeRoute)
      }
    } else {
      next()
    }
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    // إذا كان مسجلاً دخول، توجهه للصفحة الرئيسية المناسبة
    const homeRoute = getHomeRoute(authStore.userRole)
    next(homeRoute)
  } else {
    next()
  }
})  
 

// دالة مساعدة للتوجيه
function getHomeRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'provider':
      return '/provider'
    case 'client':
    default:
      return '/home'
  }
}

export default router