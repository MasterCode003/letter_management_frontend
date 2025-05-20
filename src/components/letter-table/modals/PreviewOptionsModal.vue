<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-80">
      <h3 class="text-lg font-medium mb-4">Document Options</h3>
      
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

