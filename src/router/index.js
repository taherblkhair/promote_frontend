import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/pages/services/ServicesPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/services/:id',
    name: 'ServiceDetails',
    component: () => import('@/pages/services/ServiceDetailsPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/client/orders',
    name: 'ClientOrders',
    component: () => import('@/pages/orders/ClientOrdersPage.vue'),
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/provider/services',
    name: 'ProviderServices',
    component: () => import('@/pages/services/ProviderServicesPage.vue'),
    meta: { requiresAuth: true, role: 'provider' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// حماية المسارات
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next('/')
  } else {
    next()
  }
})

export default router