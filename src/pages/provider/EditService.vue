<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="تعديل الخدمة" 
      subtitle="تعديل بيانات الخدمة"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
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
          <h3 class="text-xl font-bold text-white">تعديل الخدمة</h3>
          <p class="text-primary-100 text-sm">قم بتعديل بيانات الخدمة</p>
        </div>

        <!-- حالة التحميل -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">جاري تحميل بيانات الخدمة...</p>
        </div>

        <!-- النموذج -->
        <form v-else @submit.prevent="updateService" class="p-6 space-y-6">
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
              وصف الخدمة
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="أدخل وصفاً مفصلاً للخدمة"
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">ملاحظة: الوصف لا يمكن تعديله حالياً عبر النظام</p>
          </div>

          <!-- التصنيف والسعر -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- التصنيف -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <select
                v-model="formData.category"
                
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
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
              <div v-if="!imagePreview && !serviceData.image">
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
                <img :src="imagePreview || serviceData.image" alt="معاينة الصورة" class="w-32 h-32 object-cover rounded-lg mx-auto mb-4">
                <div class="space-x-4">
                  <button
                    type="button"
                    @click="removeImage"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    إزالة الصورة
                  </button>
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    تغيير الصورة
                  </button>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-1">اختياري - إذا لم تقم باختيار صورة جديدة سيتم الاحتفاظ بالصورة الحالية</p>
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
              :disabled="updating"
              class="btn-primary flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="updating" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ updating ? 'جاري التحديث...' : 'تحديث الخدمة' }}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const updating = ref(false)
const imagePreview = ref('')
const fileInput = ref(null)

const serviceData = reactive({})
const formData = reactive({
  title: '',
  price: '',
  category: '',
  description: '',
  image: null
})

onMounted(async () => {
  await loadService()
})

const loadService = async () => {
  try {
    const response = await providerService.getService(route.params.id)
    Object.assign(serviceData, response.data)
    Object.assign(formData, {
      title: response.data.title,
      category: response.data.category,
      description: response.data.description,
      price: parseFloat(response.data.price),
      image: null
    })
    console.log('بيانات الخدمة المحملة:', response.data)
  } catch (error) {
    console.error('فشل تحميل بيانات الخدمة:', error)
    alert('فشل تحميل بيانات الخدمة')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // التحقق من حجم الصورة (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5MB')
      return
    }
    
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

const updateService = async () => {
  updating.value = true
  
  try {
    // إنشاء FormData لإرسال البيانات
    const submitData = new FormData()
    submitData.append('title', formData.title)
    submitData.append('price', formData.price.toString())
    submitData.append('category', formData.category)
    submitData.append('description', formData.description)
    submitData.append('has_image', formData.image ? 'true' : 'false')
    
    submitData.append('_method', 'PUT') // إذا كان الخادم يتطلب ذلك لتحديد طريقة PUT    
    // إضافة الصورة فقط إذا تم اختيار صورة جديدة
    if (formData.image) {
      submitData.append('image', formData.image)
    }

    console.log('بيانات التعديل المرسلة:', {
      title: formData.title,
      price: formData.price,
      category: formData.category,
      description: formData.description,
      hasImage: !!formData.image
    })

    const response = await providerService.updateService(route.params.id, submitData)
    console.log('استجابة التعديل:', response.data)
    
    // إعادة التوجيه إلى صفحة الخدمات
    router.push('/provider/services')
    
  } catch (error) {
    console.error('فشل تحديث الخدمة:', error)
    console.error('تفاصيل الخطأ:', error.response?.data)
    alert('فشل تحديث الخدمة. يرجى المحاولة مرة أخرى.')
  } finally {
    updating.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>