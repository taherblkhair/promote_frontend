<template>
    <AdminLayout>
   
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- العنوان -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">الملف الشخصي للمدير</h1>
          <p class="text-gray-600">إدارة معلومات حسابك وإعدادات النظام</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- العمود الأيسر: الصورة والمعلومات الأساسية -->
          <div class="lg:col-span-1 space-y-6">
            <!-- بطاقة الصورة الشخصية -->
            <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div class="relative inline-block">
                <div class="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                  <span class="text-3xl font-bold text-white">
                    {{ userInitials }}
                  </span>
                </div>
                <button 
                  @click="triggerImageUpload"
                  class="absolute bottom-2 left-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>

              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                class="hidden"
              >

              <h2 class="text-xl font-semibold text-gray-800 mt-4">{{ userData.name }}</h2>
              <p class="text-gray-600">{{ userData.email }}</p>
              <p class="text-sm text-purple-600 font-medium mt-1">مدير النظام</p>

              <div class="mt-6 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">الحالة</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">نشط</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">مسجل منذ</span>
                  <span class="text-gray-900">{{ formatDate(userData.created_at) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">آخر دخول</span>
                  <span class="text-gray-900">{{ formatDate(userData.last_login) }}</span>
                </div>
              </div>
            </div>

            <!-- بطاقة إحصائيات المدير -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">إحصائيات المدير</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">إجمالي المستخدمين</span>
                  <span class="text-purple-600 font-semibold">{{ adminStats.totalUsers }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">المستخدمين النشطين</span>
                  <span class="text-purple-600 font-semibold">{{ adminStats.activeUsers }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">الخدمات المنشورة</span>
                  <span class="text-purple-600 font-semibold">{{ adminStats.publishedServices }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">الطلبات هذا الشهر</span>
                  <span class="text-purple-600 font-semibold">{{ adminStats.monthlyOrders }}</span>
                </div>
              </div>
            </div>

            <!-- بطاقة الإجراءات السريعة -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
              <div class="space-y-3">
                <button 
                  @click="goToUsers"
                  class="w-full flex items-center space-x-2 space-x-reverse p-3 text-right text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  <span>إدارة المستخدمين</span>
                </button>
                <button 
                  @click="goToSystemSettings"
                  class="w-full flex items-center space-x-2 space-x-reverse p-3 text-right text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>إعدادات النظام</span>
                </button>
                <button 
                  @click="goToBackup"
                  class="w-full flex items-center space-x-2 space-x-reverse p-3 text-right text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                  </svg>
                  <span>النسخ الاحتياطي</span>
                </button>
              </div>
            </div>
          </div>

          <!-- العمود الأيمن: معلومات الحساب والإعدادات -->
          <div class="lg:col-span-3 space-y-6">
            <!-- معلومات الحساب -->
            <div class="bg-white rounded-lg shadow-sm border">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">معلومات الحساب</h3>
                <p class="text-gray-600 text-sm">إدارة معلومات حسابك الشخصية</p>
              </div>

              <form @submit.prevent="updateProfile" class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- الاسم -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="أدخل اسمك الكامل"
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
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="admin@example.com"
                    >
                  </div>

                  <!-- الهاتف -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      v-model="formData.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="+966 5X XXX XXXX"
                    >
                  </div>

                  <!-- الصلاحيات -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      مستوى الصلاحيات
                    </label>
                    <div class="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                      مدير نظام كامل
                    </div>
                  </div>
                </div>

                <!-- السيرة الذاتية -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    نبذة عن المدير
                  </label>
                  <textarea
                    v-model="formData.bio"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="أدخل نبذة عن مسؤولياتك وخبراتك..."
                  ></textarea>
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    @click="resetForm"
                    class="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span>إلغاء</span>
                  </button>
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
                    <span>{{ updating ? 'جاري الحفظ...' : 'حفظ التغييرات' }}</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- الأمان -->
            <div class="bg-white rounded-lg shadow-sm border">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">الأمان</h3>
                <p class="text-gray-600 text-sm">إدارة كلمة المرور وإعدادات الأمان المتقدمة</p>
              </div>
              <div class="p-6 space-y-4">
                <button
                  @click="showChangePassword = true"
                  class="btn-secondary flex items-center space-x-2 space-x-reverse"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span>تغيير كلمة المرور</span>
                </button>
                
                <!-- إعدادات أمان إضافية للمدير -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="text-sm text-gray-700">المصادقة الثنائية</span>
                    <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      تفعيل
                    </button>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="text-sm text-gray-700">سجل النشاط</span>
                    <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      عرض
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- إعدادات النظام (للمدير فقط) -->
            <div class="bg-white rounded-lg shadow-sm border">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">إعدادات النظام</h3>
                <p class="text-gray-600 text-sm">الإعدادات المتقدمة للنظام</p>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">وضع الصيانة</p>
                    <p class="text-sm text-gray-500">إيقاف النظام للصيانة</p>
                  </div>
                  <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    إعداد
                  </button>
                </div>
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">النسخ الاحتياطي</p>
                    <p class="text-sm text-gray-500">إدارة النسخ الاحتياطي للنظام</p>
                  </div>
                  <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    إدارة
                  </button>
                </div>
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">السجلات</p>
                    <p class="text-sm text-gray-500">عرض سجلات النظام</p>
                  </div>
                  <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    عرض
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    <!-- مودال تغيير كلمة المرور -->
    <div v-if="showChangePassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">تغيير كلمة المرور</h3>
        </div>
        <form @submit.prevent="changePassword" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الحالية</label>
            <input
              v-model="passwordData.currentPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
            <input
              v-model="passwordData.newPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور الجديدة</label>
            <input
              v-model="passwordData.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>
          <div class="flex gap-4 justify-end pt-4">
            <button
              type="button"
              @click="showChangePassword = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              :disabled="changingPassword"
              class="btn-primary disabled:opacity-50"
            >
              {{ changingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const fileInput = ref(null)
const updating = ref(false)
const changingPassword = ref(false)
const showChangePassword = ref(false)

// بيانات المدير
const userData = reactive({
  name: '',
  email: '',
  phone: '',
  bio: '',
  created_at: '',
  last_login: ''
})

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  bio: ''
})

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const adminStats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  publishedServices: 0,
  monthlyOrders: 0
})

// الحسابات
const userInitials = computed(() => {
  return userData.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// الدوال
onMounted(() => {
  loadAdminData()
})

const loadAdminData = async () => {
  try {
    // محاكاة جلب بيانات المدير
    const mockAdminData = {
      name: authStore.user?.name || 'مدير النظام',
      email: authStore.user?.email || 'admin@example.com',
      phone: '+966 50 123 4567',
      bio: 'مدير النظام المسؤول عن إدارة المنصة ومراقبة الأداء.',
      created_at: new Date('2024-01-01').toISOString(),
      last_login: new Date().toISOString()
    }

    Object.assign(userData, mockAdminData)
    Object.assign(formData, mockAdminData)

    // إحصائيات وهمية للمدير
    Object.assign(adminStats, {
      totalUsers: 156,
      activeUsers: 142,
      publishedServices: 89,
      monthlyOrders: 234
    })
  } catch (error) {
    console.error('Error loading admin data:', error)
  }
}

const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('Selected file:', file)
    // منطق رفع الصورة
  }
}

const updateProfile = async () => {
  updating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    Object.assign(userData, formData)
    console.log('Admin profile updated:', formData)
    alert('تم تحديث الملف الشخصي بنجاح!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('فشل في تحديث الملف الشخصي')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    alert('كلمات المرور غير متطابقة')
    return
  }

  changingPassword.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Password changed')
    showChangePassword.value = false
    Object.assign(passwordData, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    alert('تم تغيير كلمة المرور بنجاح!')
  } catch (error) {
    console.error('Error changing password:', error)
    alert('فشل في تغيير كلمة المرور')
  } finally {
    changingPassword.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, userData)
}

const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

// التنقل
const goToUsers = () => {
  router.push('/admin/users')
}

const goToSystemSettings = () => {
  router.push('/admin/settings')
}

const goToBackup = () => {
  router.push('/admin/backup')
}
</script>

<style scoped>
.btn-primary {
  @apply bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>