<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">تفاصيل الخدمة</h1>
          <router-link to="/services" class="btn-secondary">العودة للخدمات</router-link>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="service" class="bg-white rounded-lg shadow p-6">
        <img v-if="service.image" :src="service.image" alt="صورة الخدمة" class="w-full h-56 object-cover rounded-md mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ service.title }}</h2>
        <p class="text-gray-700 mb-4" style="white-space: pre-line">{{ service.description }}</p>
        <div class="flex items-center mb-4">
          <span class="text-primary-600 font-bold text-lg">{{ service.price }} ر.س</span>
          <span class="ml-4 text-gray-500">المزود: {{ service.provider }}</span>
        </div>
        <div class="mb-4">
          <span class="text-yellow-500">★</span>
          <span class="font-bold">{{ service.average_rating }}</span>
          <span class="text-gray-500">({{ service.reviews_count }} تقييم)</span>
        </div>
        <button class="btn-primary w-full py-2">طلب الخدمة</button>
      </div>
      <div v-else class="text-center py-12 text-gray-500">جاري تحميل تفاصيل الخدمة...</div>

      <div v-if="service && service.reviews && service.reviews.length" class="mt-8">
        <h3 class="text-xl font-bold mb-4">آراء العملاء</h3>
        <div v-for="(review, idx) in service.reviews" :key="idx" class="bg-gray-100 rounded p-4 mb-3">
          <div class="flex items-center mb-2">
            <span class="text-yellow-500">★</span>
            <span class="font-bold ml-2">{{ review.rating }}</span>
            <span class="ml-4 text-gray-700">{{ review.client_name }}</span>
            <span class="ml-auto text-gray-400 text-sm">{{ review.created_at }}</span>
          </div>
          <p class="text-gray-700">{{ review.comment }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { servicesService } from '@/services/servicesService'

const route = useRoute()
const service = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    // جلب تفاصيل الخدمة من endpoint الصحيح للعميل
    if (typeof servicesService.getClientService === 'function') {
      const response = await servicesService.getClientService(id)
      service.value = response.data
    } else {
      // fallback: جلب من endpoint العام
      const response = await servicesService.getService(id)
      service.value = response.data
    }
  } catch (error) {
    console.error('فشل جلب تفاصيل الخدمة:', error)
  }
})
</script>
