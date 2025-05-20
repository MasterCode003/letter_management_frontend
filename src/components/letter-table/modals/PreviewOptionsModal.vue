<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Document Options</h2>

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
</script>

