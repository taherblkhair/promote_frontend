<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader 
      title="بروموت"
      subtitle="الخدمات المتاحة والمتوفرة للعملاء"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service.id" class="card bg-white rounded-lg shadow p-5 flex flex-col justify-between">
          <router-link :to="`/services/${service.id}`">
            <img v-if="service.image" :src="service.image" alt="صورة الخدمة" class="w-full h-40 object-cover rounded-md mb-3" />
          </router-link>
          <div class="flex-1 flex flex-col">
            <router-link :to="`/services/${service.id}`">
              <h3 class="text-lg font-semibold text-gray-900 hover:underline cursor-pointer mb-2">{{ service.title }}</h3>
            </router-link>
            <p class="text-gray-600 mb-3">{{ service.description }}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-primary-600 font-bold">{{ service.orders_count }}</span>
              <span class="text-gray-500 text-sm">طلبات</span>
            </div>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <span class="text-primary-600 font-bold">{{ service.price }} ر.س</span>
            <router-link :to="`/services/${service.id}`" class="btn-primary text-sm">تفاصيل الخدمة</router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { servicesService } from '@/services/servicesService'
import AppHeader from '@/components/AppHeader.vue'

const services = ref([])

onMounted(async () => {
  try {
    const response = await servicesService.getClientServices()
    services.value = response.data
  } catch (error) {
    console.error('فشل جلب الخدمات:', error)
  }
})
</script>