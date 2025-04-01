<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Download Options</h2>
      
      <div class="space-y-4">
        <button 
          @click="$emit('download', 'pdf')" 
          class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Download as PDF
        </button>
        
        <button 
          @click="$emit('download', 'word')" 
          class="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Export to Word
        </button>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'close'): void
  (e: 'download', type: 'pdf' | 'word'): void
}>()
</script>