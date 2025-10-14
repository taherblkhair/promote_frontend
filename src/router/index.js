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
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  // مسارات العميل
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
  // مسارات مقدم الخدمة
  {
    path: '/provider/dashboard',
    name: 'ProviderDashboard',
    component: () => import('@/pages/provider/ProviderDashboard.vue'),
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
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/pages/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] }
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
  
  // إذا كانت الصفحة تتطلب مصادقة
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // إذا لم يكن مسجلاً دخول، توجيه لصفحة تسجيل الدخول
      next('/login')
    } else if (to.meta.allowedRoles) {
      // التحقق من الصلاحيات إذا كانت محددة
      const userRole = authStore.userRole
      if (to.meta.allowedRoles.includes(userRole)) {
        next()
      } else {
        // إذا لم يكن لديه الصلاحية، توجيه للصفحة الرئيسية المناسبة لدوره
        const dashboardRoute = getDashboardRoute(userRole)
        next(dashboardRoute)
      }
    } else {
      next()
    }
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    // إذا كان مسجلاً دخول وحاول الدخول لصفحة للزوار فقط
    const dashboardRoute = getDashboardRoute(authStore.userRole)
    next(dashboardRoute)
  } else {
    next()
  }
})

// دالة مساعدة للتوجيه
function getDashboardRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'provider':
      return '/provider/dashboard'
    case 'client':
    default:
      return '/'
  }
}

export default router