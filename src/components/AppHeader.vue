<template>
  <header class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- الجزء الأيسر: العنوان والأيقونة -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="bg-primary-100 p-3 rounded-2xl">
            <slot name="icon">
              <!-- أيقونة افتراضية -->
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </slot>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              <slot name="title">{{ title }}</slot>
            </h1>
            <p v-if="subtitle" class="text-gray-600 mt-1 text-sm">{{ subtitle }}</p>
          </div>
        </div>

        <!-- الجزء الأيمن: الإجراءات -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <slot name="actions">
            <!-- إجراءات افتراضية -->
            <router-link to="/" class="btn-secondary flex items-center space-x-2 space-x-reverse">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>العودة للرئيسية</span>
            </router-link>
          </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'العنوان'
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>