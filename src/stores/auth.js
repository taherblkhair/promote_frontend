import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role)

  async function login(credentials) {
    try {
      const response = await authService.login(credentials)
      const { token: authToken, user: userData } = response.data
      
      token.value = authToken
      user.value = userData
      
      localStorage.setItem('auth_token', authToken)
      
      return response
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
    }
  }

  async function fetchProfile() {
    try {
      const response = await authService.getProfile()
      user.value = response.data
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    fetchProfile
  }
})