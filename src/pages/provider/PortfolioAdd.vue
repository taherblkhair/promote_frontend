<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <AppHeader 
      title="إضافة مشروع جديد" 
      subtitle="أضف مشروعك إلى معرض الأعمال"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </template>
      
      <template #actions>
        <router-link 
          to="/provider/portfolio"
          class="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium flex items-center space-x-2 space-x-reverse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>رجوع للمعرض</span>
        </router-link>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- حالة التحميل -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">جاري حفظ المشروع...</p>
        </div>

        <!-- نموذج الإضافة -->
        <form v-else @submit.prevent="submitForm" class="space-y-8">
          <!-- المعلومات الأساسية -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- العنوان -->
            <div class="md:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                عنوان المشروع *
              </label>
              <input
                type="text"
                id="title"
                v-model="form.title"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="أدخل عنوان المشروع"
              >
            </div>

            <!-- الوصف -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                وصف المشروع *
              </label>
              <textarea
                id="description"
                v-model="form.description"
                required
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="أدخل وصفاً مفصلاً للمشروع"
              ></textarea>
            </div>

            <!-- التصنيف -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                التصنيف *
              </label>
              <input
                type="text"
                id="category"
                v-model="form.category"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="مثال: تصوير منتجات"
              >
            </div>

            <!-- تاريخ المشروع -->
            <div>
              <label for="project_date" class="block text-sm font-medium text-gray-700 mb-2">
                تاريخ المشروع *
              </label>
              <input
                type="date"
                id="project_date"
                v-model="form.project_date"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              >
            </div>

            <!-- الوسوم -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                الوسوم
              </label>
              <div class="space-y-3">
                <!-- الوسوم الحالية -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2 space-x-reverse"
                  >
                    <span>{{ tag }}</span>
                    <button
                      type="button"
                      @click="removeTag(index)"
                      required
                      class="text-primary-500 hover:text-primary-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </span>
                </div>

                <!-- إضافة وسم جديد -->
                <div class="flex gap-2">
                  <input
                    type="text"
                    v-model="newTag"
                    @keydown.enter.prevent="addTag"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="أدخل وسماً جديداً"
                    
                  >
                  <button
                    type="button"
                    @click="addTag"
                    class="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all duration-300"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- الإعدادات -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">إعدادات المشروع</h3>
            <div class="space-y-4">
              <!-- مشروع مميز -->
              <div class="flex items-center justify-between">
                <div>
                  <label for="is_featured" class="text-sm font-medium text-gray-700">
                    مشروع مميز
                  </label>
                  <p class="text-sm text-gray-500">عرض هذا المشروع في القسم المميز</p>
                </div>
                <div class="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    v-model="form.is_featured"
                    true-value="1"
                    false-value="0"
                    class="sr-only"
                  >
                  <div
                    :class="[
                      'w-12 h-6 rounded-full transition-all duration-300',
                      form.is_featured === '1' ? 'bg-primary-600' : 'bg-gray-300'
                    ]"
                  ></div>
                  <div
                    :class="[
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform',
                      form.is_featured === '1' ? 'translate-x-7' : 'translate-x-1'
                    ]"
                  ></div>
                </div>
              </div>

              <!-- مشروع عام -->
              <div class="flex items-center justify-between">
                <div>
                  <label for="is_public" class="text-sm font-medium text-gray-700">
                    مشروع عام
                  </label>
                  <p class="text-sm text-gray-500">عرض هذا المشروع للعملاء</p>
                </div>
                <div class="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="is_public"
                    v-model="form.is_public"
                    true-value="1"
                    false-value="0"
                    class="sr-only"
                  >
                  <div
                    :class="[
                      'w-12 h-6 rounded-full transition-all duration-300',
                      form.is_public === '1' ? 'bg-primary-600' : 'bg-gray-300'
                    ]"
                  ></div>
                  <div
                    :class="[
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform',
                      form.is_public === '1' ? 'translate-x-7' : 'translate-x-1'
                    ]"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- رفع الملفات -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">وسائط المشروع</h3>
            
            <!-- معاينة الملفات المرفوعة -->
            <div v-if="uploadedFiles.length > 0" class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">الملفات المرفوعة:</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="relative group"
                >
                  <img
                    v-if="file.type.startsWith('image/')"
                    :src="file.preview"
                    :alt="file.name"
                    class="w-full h-24 object-cover rounded-lg border border-gray-200"
                  >
                  <div
                    v-else
                    class="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
                  >
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <p class="text-xs text-gray-500 mt-1 truncate">{{ file.name }}</p>
                </div>
              </div>
            </div>

            <!-- منطقة السحب والإفلات -->
            <div
              @drop="handleDrop"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              :class="[
                'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300',
                isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              ]"
            >
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              
              <div class="space-y-2">
                <p class="text-lg font-medium text-gray-900">
                  اسحب وأفلت الملفات هنا
                </p>
                <p class="text-sm text-gray-500">
                  أو
                  <label for="file-upload" class="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                    اختر الملفات
                  </label>
                  من جهازك
                </p>
                <p class="text-xs text-gray-400">
                  PNG, JPG, GIF, MP4, PDF (الحد الأقصى: 10MB لكل ملف)
                </p>
              </div>

              <input
                id="file-upload"
                type="file"
                multiple
                @change="handleFileSelect"
                accept="image/*,video/*,.pdf"
                class="hidden"
              >
            </div>

            <!-- معلومات الملفات -->
            <div v-if="uploadedFiles.length > 0" class="mt-4 text-sm text-gray-600">
              <p>تم رفع {{ uploadedFiles.length }} ملف</p>
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <router-link
              to="/provider/portfolio"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium text-center"
            >
              إلغاء
            </router-link>
            <button
              type="submit"
              :disabled="submitting"
              :class="[
                'px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse',
                submitting
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              ]"
            >
              <span v-if="submitting">جاري الحفظ...</span>
              <span v-else>إضافة المشروع</span>
              <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const isDragging = ref(false)
const newTag = ref('')

const form = reactive({
  title: '',
  description: '',
  category: '',
  tags: [],
  is_featured: '0',
  is_public: '1',
  project_date: ''
})

const uploadedFiles = ref([])

// إضافة وسوم
const addTag = () => {
  if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

// إدارة الملفات
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragging.value = false
}

const processFiles = (files) => {
  files.forEach(file => {
    // التحقق من حجم الملف (10MB كحد أقصى)
    if (file.size > 10 * 1024 * 1024) {
      alert(`الملف ${file.name} يتجاوز الحد الأقصى المسموح به (10MB)`)
      return
    }

    // إنشاء معاينة للصور
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedFiles.value.push({
          file,
          name: file.name,
          type: file.type,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    } else {
      uploadedFiles.value.push({
        file,
        name: file.name,
        type: file.type,
        preview: null
      })
    }
  })
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

// إرسال النموذج
const submitForm = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    // إنشاء FormData
    const formData = new FormData()
    
    // إضافة الحقول النصية
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('category', form.category)
    formData.append('is_featured', form.is_featured)
    formData.append('is_public', form.is_public)
    formData.append('project_date', form.project_date)

    // إضافة الوسوم
    form.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag)
    })

    // إضافة الملفات
    uploadedFiles.value.forEach((fileObj, index) => {
      formData.append('media_files[]', fileObj.file)
    })

    // إرسال البيانات
    const response = await providerService.addPortfolioItem(formData)
    
    if (response.data.success) {
      // نجاح الإضافة
      alert('تم إضافة المشروع بنجاح!')
      router.push('/provider/portfolio')
    } else {
      throw new Error(response.data.message || 'فشل إضافة المشروع')
    }

  } catch (error) {
    console.error('خطأ في إضافة المشروع:', error)
    alert('فشل إضافة المشروع. يرجى المحاولة مرة أخرى.')
  } finally {
    submitting.value = false
  }
}

// التحقق من صحة النموذج
const validateForm = () => {
  if (!form.title.trim()) {
    alert('يرجى إدخال عنوان المشروع')
    return false
  }
  
  if (!form.description.trim()) {
    alert('يرجى إدخال وصف المشروع')
    return false
  }
  
  if (!form.category.trim()) {
    alert('يرجى إدخال تصنيف المشروع')
    return false
  }
  
  if (!form.project_date) {
    alert('يرجى اختيار تاريخ المشروع')
    return false
  }
  
  if (uploadedFiles.value.length === 0) {
    alert('يرجى رفع ملف واحد على الأقل')
    return false
  }

  return true
}

// تعيين التاريخ الحالي كقيمة افتراضية
onMounted(() => {
  const today = new Date().toISOString().split('T')[0]
  form.project_date = today
})
</script>

<style scoped>
input[type="file"] {
  display: none;
}
</style>