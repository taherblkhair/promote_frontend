<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      title="الملف الشخصي" 
      subtitle="إدارة معلومات حسابك الشخصية"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- العمود الأيسر: معلومات سريعة -->
        <div class="lg:col-span-1">
          <!-- بطاقة المستخدم -->
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <!-- صورة المستخدم -->
            <div class="text-center mb-6">
              <div class="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span class="text-4xl font-bold text-white">
                  {{ userInitials }}
                </span>
                <button 
                  @click="editPhoto"
                  class="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>
              <h2 class="text-xl font-bold text-gray-900">{{ userData.name }}</h2>
              <p class="text-gray-600">{{ userData.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                عميل
              </span>
            </div>

            <!-- الإحصائيات -->
            <div class="space-y-4 border-t border-gray-200 pt-6">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">الطلبات النشطة</span>
                <span class="font-bold text-primary-600">{{ stats.activeOrders }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">الطلبات المكتملة</span>
                <span class="font-bold text-green-600">{{ stats.completedOrders }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">تاريخ الانضمام</span>
                <span class="font-medium text-gray-900">{{ formatDate(userData.joinDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن: نموذج التعديل -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- رأس النموذج -->
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h3 class="text-xl font-bold text-white">المعلومات الشخصية</h3>
              <p class="text-primary-100 text-sm">يمكنك تعديل معلوماتك الشخصية هنا</p>
            </div>

            <!-- النموذج -->
            <form @submit.prevent="saveProfile" class="p-6 space-y-6">
              <!-- المعلومات الأساسية -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- الاسم الكامل -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="أدخل الاسم الكامل"
                  >
                </div>

                <!-- البريد الإلكتروني -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="example@email.com"
                  >
                </div>

                <!-- رقم الهاتف -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="05XXXXXXXX"
                  >
                </div>

                <!-- المدينة -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    المدينة
                  </label>
                  <select
                    v-model="formData.city"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                    <option value="">اختر المدينة</option>
                    <option value="riyadh">الرياض</option>
                    <option value="jeddah">جدة</option>
                    <option value="dammam">الدمام</option>
                    <option value="mecca">مكة المكرمة</option>
                    <option value="medina">المدينة المنورة</option>
                  </select>
                </div>
              </div>

              <!-- العنوان -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <textarea
                  v-model="formData.address"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="أدخل عنوانك بالتفصيل"
                ></textarea>
              </div>

              <!-- معلومات إضافية -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- تاريخ الميلاد -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الميلاد
                  </label>
                  <input
                    v-model="formData.birthDate"
                    type="date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                </div>

                <!-- النوع -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    النوع
                  </label>
                  <div class="flex space-x-4 space-x-reverse">
                    <label class="flex items-center">
                      <input
                        v-model="formData.gender"
                        type="radio"
                        value="male"
                        class="text-primary-600 focus:ring-primary-500"
                      >
                      <span class="mr-2 text-gray-700">ذكر</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.gender"
                        type="radio"
                        value="female"
                        class="text-primary-600 focus:ring-primary-500"
                      >
                      <span class="mr-2 text-gray-700">أنثى</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- تفضيلات الإشعارات -->
              <div class="border-t border-gray-200 pt-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4">تفضيلات الإشعارات</h4>
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">الإشعارات البريدية</span>
                    <input
                      v-model="formData.notifications.email"
                      type="checkbox"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                    >
                  </label>
                  <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">إشعارات التطبيق</span>
                    <input
                      v-model="formData.notifications.app"
                      type="checkbox"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                    >
                  </label>
                  <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">عروض خاصة</span>
                    <input
                      v-model="formData.notifications.offers"
                      type="checkbox"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                    >
                  </label>
                </div>
              </div>

              <!-- أزرار الإجراءات -->
              <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="resetForm"
                  class="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>إعادة تعيين</span>
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="btn-primary flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="saving" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- قسم تغيير كلمة المرور -->
          <div class="bg-white rounded-2xl shadow-lg mt-6 overflow-hidden">
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <h3 class="text-xl font-bold text-white">تغيير كلمة المرور</h3>
              <p class="text-orange-100 text-sm">تحديث كلمة المرور لحسابك</p>
            </div>
            <div class="p-6">
              <button
                @click="changePassword"
                class="btn-secondary flex items-center space-x-2 space-x-reverse w-full justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                <span>تغيير كلمة المرور</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const saving = ref(false)

// بيانات المستخدم الافتراضية
const userData = reactive({
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  city: 'riyadh',
  address: 'حي الملز، شارع الملك فهد، الرياض',
  birthDate: '1990-05-15',
  gender: 'male',
  joinDate: '2024-01-15',
  notifications: {
    email: true,
    app: true,
    offers: false
  }
})

// الإحصائيات الافتراضية
const stats = reactive({
  activeOrders: 3,
  completedOrders: 12,
  totalSpent: 8450
})

// بيانات النموذج
const formData = reactive({ ...userData })

// الأحرف الأولى من الاسم
const userInitials = computed(() => {
  return userData.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// تنسيق التاريخ
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// تعديل الصورة
const editPhoto = () => {
  alert('سيتم إضافة خاصية تعديل الصورة قريباً!')
}

// تغيير كلمة المرور
const changePassword = () => {
  alert('سيتم إضافة خاصية تغيير كلمة المرور قريباً!')
}

// حفظ التغييرات
const saveProfile = async () => {
  saving.value = true
  
  try {
    // محاكاة طلب API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // تحديث البيانات
    Object.assign(userData, formData)
    
    // تحديث بيانات المستخدم في الـ store
    if (authStore.user) {
      authStore.user.name = formData.name
      authStore.user.email = formData.email
    }
    
    alert('تم حفظ التغييرات بنجاح!')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('حدث خطأ أثناء حفظ التغييرات')
  } finally {
    saving.value = false
  }
}

// إعادة تعيين النموذج
const resetForm = () => {
  Object.assign(formData, userData)
}

// التهيئة
onMounted(() => {
  // إذا كان هناك بيانات مستخدم في الـ store، نستخدمها
  if (authStore.user) {
    userData.name = authStore.user.name || userData.name
    userData.email = authStore.user.email || userData.email
    Object.assign(formData, userData)
  }
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>