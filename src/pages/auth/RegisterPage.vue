<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          إنشاء حساب جديد
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="sr-only">الاسم</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="الاسم الكامل"
            >
          </div>
          <div>
            <label for="email" class="sr-only">البريد الإلكتروني</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="البريد الإلكتروني"
            >
          </div>
          <div>
            <label for="password" class="sr-only">كلمة المرور</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="كلمة المرور"
            >
          </div>
          <div>
            <label for="role" class="sr-only">الدور</label>
            <select
              id="role"
              v-model="form.role"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">اختر الدور</option>
              <option value="client">عميل</option>
              <option value="provider">مزود خدمة</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

const loading = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    const response = await authService.register(form.value)
    // إذا نجح التسجيل
    alert('تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.')
    router.push('/login')
  } catch (error) {
    // معالجة الأخطاء القادمة من السيرفر
    let message = 'فشل إنشاء الحساب. حاول مرة أخرى.'
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message
    } else if (error.response && error.response.data && typeof error.response.data === 'object') {
      // عرض أول خطأ من الأخطاء التفصيلية
      const errors = error.response.data.errors
      if (errors) {
        message = Object.values(errors)[0][0]
      }
    }
    alert(message)
  } finally {
    loading.value = false
  }
}
</script>