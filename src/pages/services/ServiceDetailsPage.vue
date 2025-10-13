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
        <div class="mt-6">
          <button class="btn-primary w-full py-2" :disabled="loading" @click="showOrderModal = true">
            طلب الخدمة
          </button>
        </div>
        <!-- نافذة منبثقة لكتابة الملاحظة -->
        <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-bold mb-4 text-center">كتابة ملاحظة للطلب</h3>
            <textarea v-model="notes" placeholder="اكتب ملاحظتك هنا..." class="w-full border rounded-lg p-2 mb-3" rows="3"></textarea>
            <div class="flex gap-2 mt-4">
              <button class="btn-primary flex-1" :disabled="loading" @click="handleOrder">
                {{ loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب' }}
              </button>
              <button class="btn-secondary flex-1" @click="showOrderModal = false">إلغاء</button>
            </div>
          </div>
        </div>
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
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { servicesService } from '@/services/servicesService'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const service = ref(null)
const showOrderModal = ref(false)
const notes = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const id = route.params.id
    if (typeof servicesService.getClientService === 'function') {
      const response = await servicesService.getClientService(id)
      service.value = response.data
    } else {
      const response = await servicesService.getService(id)
      service.value = response.data
    }
  } catch (error) {
    console.error('فشل جلب تفاصيل الخدمة:', error)
  }
})

async function handleOrder() {
  if (!service.value) return
  loading.value = true
  try {
    await api.post('/client/orders', {
      service_id: service.value.id,
      notes: notes.value
    })
  showOrderModal.value = false
  alert('تم إرسال الطلب بنجاح!')
  await nextTick()
  router.push('/client/orders')
  } catch (error) {
    alert('فشل إرسال الطلب. حاول مرة أخرى.')
    console.error('Order error:', error)
  } finally {
    loading.value = false
  }
}
</script>
