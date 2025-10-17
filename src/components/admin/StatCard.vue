<template>
  <div class="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mb-2">{{ formattedValue }}</p>
        <div class="flex items-center">
          <span :class="`inline-flex items-center text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`">
            <svg :class="`w-3 h-3 ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="change >= 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            {{ Math.abs(change) }}%
          </span>
          <span class="text-xs text-gray-500 mr-2">من الشهر الماضي</span>
        </div>
      </div>
      <div :class="`p-3 rounded-lg bg-${color}-100`">
        <span class="text-xl">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: {
    type: String,
    default: 'blue'
  },
  change: {
    type: Number,
    default: 0
  }
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>