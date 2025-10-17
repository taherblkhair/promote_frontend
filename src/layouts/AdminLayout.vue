<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />
    
    <!-- المحتوى الرئيسي -->
    <div :class="['flex-1 transition-all duration-300', sidebarOpen ? 'mr-64' : 'mr-20']">
      <!-- Header -->
      <AdminHeader @toggle-sidebar="handleSidebarToggle" />
      
      <!-- محتوى الصفحة -->
      <main class="mt-16">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

const sidebarOpen = ref(true)

const handleSidebarToggle = (isOpen) => {
  sidebarOpen.value = isOpen
}
</script>