<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto">
      <!-- العنوان والإحصائيات -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p class="text-gray-600">إدارة حسابات المستخدمين في النظام</p>
          </div>
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              @click="exportUsers"
              class="btn-secondary flex items-center space-x-2 space-x-reverse"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              <span>تصدير</span>
            </button>
            <button 
              @click="showAddUserModal = true"
              class="btn-primary flex items-center space-x-2 space-x-reverse"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>إضافة مستخدم</span>
            </button>
          </div>
        </div>

        <!-- إحصائيات سريعة -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-purple-600">{{ stats.totalUsers }}</p>
            <p class="text-sm text-gray-600">إجمالي المستخدمين</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ stats.activeUsers }}</p>
            <p class="text-sm text-gray-600">نشطين</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ stats.providers }}</p>
            <p class="text-sm text-gray-600">مقدمي خدمات</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-orange-600">{{ stats.clients }}</p>
            <p class="text-sm text-gray-600">عملاء</p>
          </div>
        </div>
      </div>

      <!-- فلترة وبحث -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- البحث -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">بحث</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                @input="debouncedSearch"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- فلترة بالدور -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
            <select
              v-model="filters.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="loadUsers"
            >
              <option value="">جميع الأدوار</option>
              <option value="admin">مدير</option>
              <option value="provider">مقدم خدمة</option>
              <option value="client">عميل</option>
            </select>
          </div>

          <!-- فلترة بالحالة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="loadUsers"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">موقوف</option>
            </select>
          </div>
        </div>
      </div>

      <!-- جدول المستخدمين -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <!-- حالة التحميل -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>

        <!-- الجدول -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المستخدم
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدور
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسجيل
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span class="text-purple-700 font-medium text-sm">
                          {{ getUserInitials(user.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="mr-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                      <div v-if="user.phone" class="text-xs text-gray-400">{{ user.phone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadgeClass(user.role)">
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(user.status)">
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="تعديل"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                      class="transition-colors"
                      :title="user.status === 'active' ? 'تعطيل' : 'تفعيل'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="user.status === 'active'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="حذف"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- لا توجد بيانات -->
          <div v-if="filteredUsers.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            <p class="text-gray-500 text-lg">لا توجد مستخدمين</p>
            <p class="text-gray-400 mt-2">لم يتم العثور على مستخدمين مطابقين لمعايير البحث</p>
          </div>
        </div>
      </div>

      <!-- التصفح -->
      <div v-if="!loading && filteredUsers.length > 0" class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div class="flex justify-between flex-1 sm:hidden">
          <button class="btn-secondary">السابق</button>
          <button class="btn-secondary">التالي</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              عرض
              <span class="font-medium">{{ filteredUsers.length }}</span>
              من
              <span class="font-medium">{{ stats.totalUsers }}</span>
              نتائج
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تعديل المستخدم -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">تعديل المستخدم</h3>
        </div>
        <form @submit.prevent="updateUser" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              v-model="editForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              v-model="editForm.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
            <select
              v-model="editForm.role"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="admin">مدير</option>
              <option value="provider">مقدم خدمة</option>
              <option value="client">عميل</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              v-model="editForm.status"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">موقوف</option>
            </select>
          </div>
          <div class="flex gap-4 justify-end pt-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="btn-primary disabled:opacity-50"
            >
              {{ updating ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
            </button>
          </div>
        </form>
      </div>
    </div>
     <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">إضافة مستخدم جديد</h3>
        </div>
        <form @submit.prevent="createUser" class="p-6 space-y-4">
          <!-- الاسم -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newUserForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="أدخل الاسم الكامل"
            >
          </div>

          <!-- البريد الإلكتروني -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newUserForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="example@email.com"
            >
          </div>

          <!-- كلمة المرور -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newUserForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="كلمة المرور"
              minlength="6"
            >
            <p class="text-xs text-gray-500 mt-1">كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
          </div>

          <!-- تأكيد كلمة المرور -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newUserForm.password_confirmation"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="تأكيد كلمة المرور"
            >
          </div>

          <!-- رقم الهاتف -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              v-model="newUserForm.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="+966 5X XXX XXXX"
            >
          </div>

          <!-- العنوان -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
            <input
              v-model="newUserForm.address"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="أدخل العنوان"
            >
          </div>

          <!-- الدور -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              الدور <span class="text-red-500">*</span>
            </label>
            <select
              v-model="newUserForm.role"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">اختر الدور</option>
              <option value="admin">مدير</option>
              <option value="provider">مقدم خدمة</option>
              <option value="client">عميل</option>
            </select>
          </div>

          <!-- الحالة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              الحالة <span class="text-red-500">*</span>
            </label>
            <select
              v-model="newUserForm.status"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">اختر الحالة</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">موقوف</option>
            </select>
          </div>

          <!-- السيرة الذاتية -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نبذة عن المستخدم</label>
            <textarea
              v-model="newUserForm.bio"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="أدخل نبذة عن المستخدم (اختياري)"
            ></textarea>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex gap-4 justify-end pt-4">
            <button
              type="button"
              @click="closeAddUserModal"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              :disabled="creatingUser"
              class="btn-primary disabled:opacity-50"
            >
              <svg v-if="creatingUser" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
              </svg>
              <span v-else>إنشاء مستخدم</span>
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
import { adminService } from '@/services/adminService'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()

// الحالة
const loading = ref(true)
const updating = ref(false)
const creatingUser = ref(false)
const showEditModal = ref(false)
const showAddUserModal = ref(false)

// البيانات
const users = ref([])
const selectedUser = ref(null)

const stats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  providers: 0,
  clients: 0
})

const filters = reactive({
  search: '',
  role: '',
  status: ''
})

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  role: '',
  status: ''
})
const newUserForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  address: '',
  role: '',
  status: 'active',
  bio: ''
})

// الحسابات
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesRole = !filters.role || user.role === filters.role
    const matchesStatus = !filters.status || user.status === filters.status
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// الدوال
onMounted(() => {
  loadUsers()
})
const createUser = async () => {
  // التحقق من صحة البيانات
  if (!validateNewUserForm()) {
    return
  }

  creatingUser.value = true
  try {
    await adminService.createUser(newUserForm)
    
    // إعادة تعيين النموذج
    resetNewUserForm()
    
    // إغلاق المودال
    showAddUserModal.value = false
    
    // إعادة تحميل قائمة المستخدمين
    await loadUsers()
    
    alert('تم إنشاء المستخدم بنجاح!')
  } catch (error) {
    console.error('Error creating user:', error)
    
    // عرض رسالة الخطأ من الخادم
    const errorMessage = error.response?.data?.message || 'فشل في إنشاء المستخدم'
    alert(errorMessage)
  } finally {
    creatingUser.value = false
  }}
  const validateNewUserForm = () => {
  // التحقق من تطابق كلمة المرور
  if (newUserForm.password !== newUserForm.password_confirmation) {
    alert('كلمة المرور وتأكيد كلمة المرور غير متطابقين')
    return false
  }

  // التحقق من طول كلمة المرور
  if (newUserForm.password.length < 6) {
    alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    return false
  }

  // التحقق من صحة البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newUserForm.email)) {
    alert('يرجى إدخال بريد إلكتروني صحيح')
    return false
  }

  return true
}

const resetNewUserForm = () => {
  Object.assign(newUserForm, {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: '',
    status: 'active',
    bio: ''
  })
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
  resetNewUserForm()
}

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await adminService.getUsers()
    users.value = response.data
    calculateStats()
  } catch (error) {
    console.error('Error loading users:', error)
    // استخدام بيانات وهمية للاختبار
    users.value = [
      {
        "id": 1,
        "name": "بيانات وهميه",
        "email": "provider@example.com",
        "address": null,
        "bio": null,
        "phone": null,
        "role": "provider",
        "status": "active",
        "created_at": "2025-10-17T18:03:00.000000Z"
      },
      {
        "id": 2,
        "name": "admin",
        "email": "admin@example.com",
        "address": "Tripoli",
        "bio": "admin system",
        "phone": "0919090220",
        "role": "admin",
        "status": "active",
        "created_at": null
      }
    ]
    calculateStats()
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.totalUsers = users.value.length
  stats.activeUsers = users.value.filter(u => u.status === 'active').length
  stats.providers = users.value.filter(u => u.role === 'provider').length
  stats.clients = users.value.filter(u => u.role === 'client').length
}

const debouncedSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => {
    // البحث يتم تلقائياً عبر computed property
  }, 300)
}

const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRoleText = (role) => {
  const roles = {
    admin: 'مدير',
    provider: 'مقدم خدمة',
    client: 'عميل'
  }
  return roles[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800',
    provider: 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800',
    client: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
  }
  return classes[role] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'موقوف'
  }
  return statuses[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    inactive: 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    suspended: 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const editUser = (user) => {
  selectedUser.value = user
  Object.assign(editForm, {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    status: user.status
  })
  showEditModal.value = true
}

const updateUser = async () => {
  updating.value = true
  try {
    await adminService.updateUser(selectedUser.value.id, editForm)
    await loadUsers() // إعادة تحميل البيانات
    showEditModal.value = false
    alert('تم تحديث المستخدم بنجاح!')
  } catch (error) {
    console.error('Error updating user:', error)
    alert('فشل في تحديث المستخدم')
  } finally {
    updating.value = false
  }
}

const toggleUserStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const confirmMessage = `هل أنت متأكد من ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} المستخدم ${user.name}؟`
  
  if (!confirm(confirmMessage)) return

  try {
    await adminService.updateUser(user.id, { status: newStatus })
    await loadUsers()
    alert(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح!`)
  } catch (error) {
    console.error('Error toggling user status:', error)
    alert('فشل في تغيير حالة المستخدم')
  }
}

const deleteUser = async (user) => {
  if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
    return
  }

  try {
    await adminService.deleteUser(user.id)
    await loadUsers()
    alert('تم حذف المستخدم بنجاح!')
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('فشل في حذف المستخدم')
  }
}

const exportUsers = () => {
  // منطق تصدير البيانات
  console.log('Exporting users...')
  alert('سيتم تصدير البيانات قريباً')
}
</script>

<style scoped>
.btn-primary {
  @apply bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.max-h-90vh {
  max-height: 90vh;
}
</style>