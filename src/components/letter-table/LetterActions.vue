<template>
  <div class="flex items-center space-x-2">
    <ActionButton 
      variant="edit" 
      @click="$emit('edit', letter)" 
      title="Edit Letter"
      class="p-2 hover:bg-blue-50 rounded-md"
    >
      <PencilIcon class="w-5 h-5 text-blue-600" />
    </ActionButton>

    <ActionButton variant="preview" @click="showPreviewModal = true" title="Preview & Export">
      <EyeIcon class="w-5 h-5 text-purple-600" />
    </ActionButton>

    <ActionButton variant="delete" @click="handleDelete" title="Delete Letter">
      <TrashIcon class="w-5 h-5 text-red-600" />
    </ActionButton>

    <!-- Success Message Modal -->
    <SuccessMessageModal
      v-if="showSuccessMessage"
      message="Letter successfully deleted!"
      @close="showSuccessMessage = false"
    />

    <!-- Error Message Modal -->
    <div v-if="showErrorMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <div class="flex items-center text-red-600 mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium">Conversion Failed</h3>
        </div>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <div class="flex justify-end">
          <button @click="showErrorMessage = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Modal -->
    <div v-if="isConverting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Converting to Word...</span>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm" @click="showPreviewModal = false"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Preview Options</h3>
            <div class="space-y-3">
              <button
                @click="handlePreviewPDF"
                class="w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <i class="fas fa-file-pdf text-red-500 mr-3 text-lg"></i>
                <span>Preview as PDF</span>
              </button>
              <button
                @click="handleExportWord"
                class="w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <i class="fas fa-file-word text-blue-500 mr-3 text-lg"></i>
                <span>Convert PDF to Word</span>
              </button>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
            <button
              @click="showPreviewModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from './ActionButton.vue'
import { PencilIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'

export default {
  name: 'LetterActions',
  components: {
    ActionButton,
    PencilIcon,
    EyeIcon,
    TrashIcon,
    ArrowPathIcon,
    SuccessMessageModal
  },
  props: {
    letter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showPreviewModal: false,
      showSuccessMessage: false,
      showEditModal: false,
      isConverting: false,
      showErrorMessage: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleExportWord() {
      try {
        this.isConverting = true;
        this.showPreviewModal = false;
        
        const result = await this.$emit('convert-pdf-to-word', this.letter);
        
        if (!result || result.success === false) {
          this.errorMessage = result?.message || 'Failed to convert PDF to Word';
          this.showErrorMessage = true;
        }
      } catch (error) {
        this.errorMessage = error.message || 'Failed to convert PDF to Word. Please try again later.';
        this.showErrorMessage = true;
      } finally {
        this.isConverting = false;
      }
    },
    handlePreviewPDF() {
      this.$emit('preview-pdf', this.letter);
      this.showPreviewModal = false;
    },
    handleDelete() {
      this.$emit('delete', this.letter.id);
      this.showSuccessMessage = true;
      
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 2000);
    }
  }
}
</script>

<style scoped>
.flex.items-center.space-x-2 {
  gap: 0.75rem; /* Ensure proper spacing between buttons */
}

/* Remove conflicting fas styles */
.fas {
  font-size: 1.1rem;
}
</style>