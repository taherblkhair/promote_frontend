<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- شريط التنقل -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">P</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Promote</span>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <router-link to="/login" class="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
              تسجيل الدخول
            </router-link>
            <router-link to="/register" class="btn-primary">
              إنشاء حساب
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- القسم الرئيسي -->
    <main>
      <!-- الهيرو -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            نظام Promote
            <span class="text-primary-600">لإدارة الخدمات</span>
          </h1>
          <p class="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            منصة متكاملة تربط بين مقدمي الخدمات والعملاء. إدارة طلباتك، متابعة خدماتك، وتنمية أعمالك في مكان واحد.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/register" class="btn-primary text-lg px-8 py-4">
              ابدأ الآن مجاناً
            </router-link>
            <button class="btn-secondary text-lg px-8 py-4">
              تعرف أكثر
            </button>
          </div>
        </div>
      </section>

      <!-- المميزات -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">مميزات النظام</h2>
            <p class="text-xl text-gray-600">كل ما تحتاجه لإدارة خدماتك بشكل احترافي</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" class="text-center p-6">
              <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <component :is="feature.icon" class="w-8 h-8 text-primary-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- الأدوار -->
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">مناسب لجميع الأدوار</h2>
            <p class="text-xl text-gray-600">نظام مرن يلبي احتياجات جميع المستخدمين</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="role in roles" :key="role.title" class="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div class="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <component :is="role.icon" class="w-10 h-10 text-primary-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ role.title }}</h3>
              <p class="text-gray-600 mb-6">{{ role.description }}</p>
              <ul class="space-y-3 text-right mb-8">
                <li v-for="item in role.features" :key="item" class="flex items-center space-x-2 space-x-reverse text-gray-700">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <router-link :to="role.link" class="btn-primary w-full">
                {{ role.buttonText }}
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- الفوتر -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2024 Promote. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// الأيقونات
const ShieldCheckIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>`
}

const LightningBoltIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`
}

const ChartBarIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`
}

const UserGroupIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>`
}

const ShoppingCartIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>`
}

const CogIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`
}

const features = [
  {
    title: 'آمن وسهل',
    description: 'نظام آمن وسهل الاستخدام مع واجهة عربية متكاملة',
    icon: ShieldCheckIcon
  },
  {
    title: 'سريع وفعال',
    description: 'أداء عالي وسرعة في تنفيذ المهام والإجراءات',
    icon: LightningBoltIcon
  },
  {
    title: 'تقارير متقدمة',
    description: 'تقارير وإحصائيات مفصلة لمتابعة أدائك',
    icon: ChartBarIcon
  }
]

const roles = [
  {
    title: 'عميل',
    description: 'ابحث عن الخدمات وادفع طلباتك بسهولة',
    icon: UserGroupIcon,
    features: [
      'تصفح الخدمات المتاحة',
      'تقديم طلبات الخدمات',
      'متابعة حالة الطلبات',
      'دفع إلكتروني آمن'
    ],
    link: '/register?role=client',
    buttonText: 'سجل كعميل'
  },
  {
    title: 'مقدم خدمة',
    description: 'عرض خدماتك وإدارة طلبات العملاء',
    icon: ShoppingCartIcon,
    features: [
      'إضافة وإدارة الخدمات',
      'استقبال طلبات العملاء',
      'متابعة المبيعات والأرباح',
      'تقارير أداء مفصلة'
    ],
    link: '/register?role=provider',
    buttonText: 'سجل كمقدم خدمة'
  },
  {
    title: 'مدير النظام',
    description: 'إدارة النظام بالكامل والمستخدمين',
    icon: CogIcon,
    features: [
      'إدارة جميع المستخدمين',
      'مراقبة الخدمات والطلبات',
      'تقارير شاملة عن النظام',
      'إعدادات النظام المتقدمة'
    ],
    link: '/register?role=admin',
    buttonText: 'سجل كمدير'
  }
]
</script>