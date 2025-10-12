<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">الخدمات المتاحة</h1>
          <router-link to="/" class="btn-secondary">العودة للرئيسية</router-link>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service.id" class="card">
          <h3 class="text-lg font-semibold text-gray-900">{{ service.title }}</h3>
          <p class="text-gray-600 mt-2">{{ service.description }}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-primary-600 font-bold">{{ service.price }} ر.س</span>
            <button class="btn-primary text-sm">طلب الخدمة</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const services = ref([
  {
    id: 1,
    title: 'تصوير منتجات احترافي',
    description: 'جلسة تصوير احترافية للمنتجات بجودة عالية',
    price: 250
  },
  {
    id: 2,
    title: 'تصميم جرافيك',
    description: 'تصميم شعارات وبوستات لوسائل التواصل الاجتماعي',
    price: 150
  }
])

onMounted(() => {
  // TODO: جلب الخدمات من الـ API
})
</script>