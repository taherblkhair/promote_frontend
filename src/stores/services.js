import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicesService } from '@/services/servicesService'

export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  const currentService = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchServices(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await servicesService.getServices(params)
      services.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch services'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchService(id) {
    loading.value = true
    error.value = null
    try {
      const response = await servicesService.getService(id)
      currentService.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch service'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createService(serviceData) {
    try {
      const response = await servicesService.createService(serviceData)
      services.value.push(response.data)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create service'
      throw err
    }
  }

  return {
    services,
    currentService,
    loading,
    error,
    fetchServices,
    fetchService,
    createService
  }
})