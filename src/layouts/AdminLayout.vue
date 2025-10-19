<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar :is-open="sidebarOpen" @toggle="toggleSidebar" />
    
    <!-- المحتوى الرئيسي -->
    <div :class="['flex-1 transition-all duration-300', sidebarOpen ? 'mr-64' : 'mr-20']">
      <!-- Header -->
      <AdminHeader @toggle-sidebar="toggleSidebar" />
      
      <!-- محتوى الصفحة -->
      <main class="mt-16 p-6">
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

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>