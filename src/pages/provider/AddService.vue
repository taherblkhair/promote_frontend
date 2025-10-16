<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="إضافة خدمة جديدة" 
      subtitle="أضف خدمة جديدة لعرضها للعملاء"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </template>

      <template #actions>
        <router-link to="/provider/services" class="btn-secondary flex items-center space-x-2 space-x-reverse">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>العودة للخدمات</span>
        </router-link>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- رأس النموذج -->
        <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
          <h3 class="text-xl font-bold text-white">معلومات الخدمة</h3>
          <p class="text-primary-100 text-sm">املأ بيانات الخدمة الجديدة</p>
        </div>

        <!-- النموذج -->
        <form @submit.prevent="createService" class="p-6 space-y-6">
          <!-- العنوان -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              عنوان الخدمة <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="أدخل عنوان الخدمة"
            >
          </div>

          <!-- الوصف -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              وصف الخدمة <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="أدخل وصفاً مفصلاً للخدمة"
            ></textarea>
          </div>

          <!-- التصنيف والسعر -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- التصنيف -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                التصنيف <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.category"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="">اختر التصنيف</option>
                <option value="تسويق إلكتروني">تسويق إلكتروني</option>
                <option value="تصميم جرافيك">تصميم جرافيك</option>
                <option value="برمجة وتطوير">برمجة وتطوير</option>
                <option value="كتابة المحتوى">كتابة المحتوى</option>
                <option value="تصوير وفيديو">تصوير وفيديو</option>
                <option value="استشارات أعمال">استشارات أعمال</option>
              </select>
            </div>

            <!-- السعر -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                السعر (د.ل) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.price"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="0.00"
              >
            </div>
          </div>

          <!-- صورة الخدمة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              صورة الخدمة
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
              <div v-if="!imagePreview">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-gray-600 mb-2">اسحب وأفلت الصورة هنا أو</p>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="hidden"
                >
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="btn-secondary"
                >
                  اختر صورة
                </button>
              </div>
              <div v-else>
                <img :src="imagePreview" alt="معاينة الصورة" class="w-32 h-32 object-cover rounded-lg mx-auto mb-4">
                <button
                  type="button"
                  @click="removeImage"
                  class="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  إزالة الصورة
                </button>
              </div>
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <router-link
              to="/provider/services"
              class="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>إلغاء</span>
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ loading ? 'جاري الإضافة...' : 'إضافة الخدمة' }}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const loading = ref(false)
const imagePreview = ref('')
const fileInput = ref(null)

const formData = reactive({
  title: '',
  description: '',
  category: '',
  price: '',
  image: null
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  formData.image = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const createService = async () => {
  loading.value = true
  
  try {
    // إنشاء FormData لإرسال الصورة
    const submitData = new FormData()
    submitData.append('title', formData.title)
    submitData.append('description', formData.description)
    submitData.append('category', formData.category)
    submitData.append('price', formData.price)
    if (formData.image) {
      submitData.append('image', formData.image)
    }

    await providerService.createService(submitData)
    
    // إعادة التوجيه إلى صفحة الخدمات
    router.push('/provider/services')
    
  } catch (error) {
    console.error('فشل إضافة الخدمة:', error)
    alert('فشل إضافة الخدمة. يرجى المحاولة مرة أخرى.')
  } finally {
    loading.value = false
  }
}
</script>