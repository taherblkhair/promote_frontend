<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">منصة بروموت</h1>
          <div class="flex space-x-4 space-x-reverse">
            <router-link to="/login" class="btn-secondary">تسجيل الدخول</router-link>
            <router-link to="/register" class="btn-primary">إنشاء حساب</router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          منصة التسويق الرقمي الشاملة
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          اربط بين أصحاب الأنشطة ومزودي الخدمات التسويقية
        </p>
        <router-link to="/services" class="btn-primary text-lg px-8 py-3">
          استعرض الخدمات
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
// الصفحة الرئيسية
</script>