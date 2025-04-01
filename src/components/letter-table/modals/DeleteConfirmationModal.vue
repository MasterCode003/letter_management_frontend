<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
      
      <p class="mb-6 text-gray-700">
        Are you sure you want to delete this letter? This action cannot be undone.
      </p>
      
      <div class="flex justify-end space-x-3">
        <button 
          @click="$emit('cancel')" 
          class="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        
        <button 
          @click="$emit('confirm')" 
          class="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>