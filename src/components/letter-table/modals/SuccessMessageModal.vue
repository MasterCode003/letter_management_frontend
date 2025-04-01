<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div class="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded shadow-lg pointer-events-auto">
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>