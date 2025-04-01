<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Preview & Download Options</h2>
      
      <div class="space-y-4">
        <button 
          @click="handlePreview" 
          class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Preview Letter
        </button>
        
        <button 
          @click="handleDownload('pdf')" 
          class="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Download as PDF
        </button>
        
        <button 
          @click="handleDownload('word')" 
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
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'preview'): void
  (e: 'download', type: 'pdf' | 'word'): void
}>();

// Handle preview with security considerations
const handlePreview = () => {
  // Use try-catch to handle potential security issues
  try {
    emit('preview');
  } catch (error) {
    console.error('Preview error:', error);
    alert('Unable to preview the document due to security restrictions. Try downloading instead.');
  }
};

// Handle download with security considerations
const handleDownload = (type: 'pdf' | 'word') => {
  try {
    emit('download', type);
  } catch (error) {
    console.error(`Download error (${type}):`, error);
    alert(`Unable to download as ${type.toUpperCase()}. Please check your connection security.`);
  }
};
</script>