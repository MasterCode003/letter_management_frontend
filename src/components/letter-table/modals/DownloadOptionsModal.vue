<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Download Options</h2>
      
      <div class="space-y-4">
        <button 
          @click="handleDownload('pdf')" 
          class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Download as PDF</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing...
          </span>
        </button>
        
        <button 
          @click="handleConvertAndDownload" 
          class="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Convert and Download as Word</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Converting...
          </span>
        </button>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          :disabled="isLoading"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(false);

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'download', type: 'pdf' | 'word'): void
  (e: 'convert-and-download'): void
}>();

const handleDownload = async (type: 'pdf' | 'word') => {
  try {
    isLoading.value = true;
    await emit('download', type);
  } catch (error) {
    console.error(`Download error (${type}):`, error);
    alert(`Unable to download as ${type.toUpperCase()}. Please try again later.`);
  } finally {
    isLoading.value = false;
  }
};

const handleConvertAndDownload = async () => {
  try {
    isLoading.value = true;
    await emit('convert-and-download');
  } catch (error) {
    console.error('Conversion and download error:', error);
    alert('Unable to convert and download. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};
</script>