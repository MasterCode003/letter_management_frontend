<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Preview Options</h2>
      
      <div class="space-y-4">
        <button 
          @click="handlePreview" 
          class="w-full py-2 px-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4v12h12V4H4zm11 11H5V5h10v10z"/>
          </svg>
          Preview as PDF
        </button>
        
        <button 
          @click="handleConvertPDFToWord" 
          class="w-full py-2 px-4 flex items-center justify-center gap-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
          </svg>
          Convert Pdf to Word
        </button>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Close
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
  (e: 'convert-pdf-to-word'): void
}>();

// Handle preview with security considerations
const handlePreview = () => {
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

// Handle PDF to Word conversion
const handleConvertPDFToWord = () => {
  try {
    emit('convert-pdf-to-word');
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    alert('Unable to convert PDF to Word. Please try again later.');
  }
};
</script>