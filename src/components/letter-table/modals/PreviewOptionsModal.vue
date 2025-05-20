<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Document Options</h2>
      
<<<<<<< HEAD
      <!-- Preview Button -->
      <button
        @click="$emit('preview-pdf')"
        class="w-full mb-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
        :disabled="isPreviewLoading"
      >
        <template v-if="!isPreviewLoading">
          <EyeIcon class="w-5 h-5" />
          <span>Preview PDF</span>
        </template>
        <template v-else>
          <LoadingSpinner />
          <span class="ml-2">Generating Preview...</span>
        </template>
      </button>

      <!-- Export Button -->
      <button
        @click="$emit('export-word')"
        class="w-full mb-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center gap-2"
        :disabled="isExporting"
      >
        <template v-if="!isExporting">
          <DocumentIcon class="w-5 h-5" />
          <span>Export to Word</span>
        </template>
        <template v-else>
          <LoadingSpinner />
          <span class="ml-2">Exporting...</span>
        </template>
      </button>

      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Close
      </button>
=======
      <div class="space-y-4">
        <button 
          @click="handlePreview"
          :disabled="isLoadingPDF"
          class="w-full py-2 px-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          <template v-if="isLoadingPDF">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Opening PDF...</span>
          </template>
          <template v-else>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4v12h12V4H4zm11 11H5V5h10v10z"/>
            </svg>
            <span>Preview PDF</span>
          </template>
        </button>
        
        <button 
          @click="handleExportWord"
          :disabled="isConverting"
          class="w-full py-2 px-4 flex items-center justify-center gap-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          <template v-if="isConverting">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Exporting to Word...</span>
          </template>
          <template v-else>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
            <span>Export to Word</span>
          </template>
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
>>>>>>> parent of 5a33d4d (adjust the designs)
    </div>
  </div>
</template>

<<<<<<< HEAD
<script>
import { EyeIcon, DocumentIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'PreviewOptionsModal',
  components: {
    EyeIcon,
    DocumentIcon,
    LoadingSpinner
  },
  props: {
    letter: {
      type: Object,
      required: true
    },
    isPreviewLoading: {
      type: Boolean,
      default: false
    },
    isExporting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['preview-pdf', 'export-word', 'close']
}
=======
<script setup lang="ts">
import { ref } from 'vue';

const isLoadingPDF = ref(false);
const isConverting = ref(false);

const props = defineProps<{
  letter: {
    id: number;
    [key: string]: any;
  }
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'preview', letter: any): void
  (e: 'convert-pdf-to-word', letter: any): void
}>();

const handlePreview = async () => {
  try {
    isLoadingPDF.value = true;
    await emit('preview', props.letter);
    // Let the parent component handle the URL opening
    emit('close');
  } catch (error) {
    console.error('Preview error:', error);
    alert('Unable to preview PDF. Please try again later.');
  } finally {
    isLoadingPDF.value = false;
  }
};

const handleExportWord = async () => {
  try {
    isConverting.value = true;
    await emit('convert-pdf-to-word', props.letter);
    emit('close');
  } catch (error) {
    console.error('PDF to Word export error:', error);
    alert('Unable to export to Word. Please try again later.');
  } finally {
    isConverting.value = false;
  }
};
>>>>>>> parent of 5a33d4d (adjust the designs)
</script>

