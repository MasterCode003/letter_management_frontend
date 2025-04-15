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

    <!-- Remove the Edit Modal section completely -->

    <ActionButton variant="preview" @click="showPreviewModal = true" title="Preview & Export">
      <EyeIcon class="w-5 h-5 text-purple-600" />
    </ActionButton>

    <ActionButton variant="delete" @click="showDeleteModal = true" title="Delete Letter">
      <TrashIcon class="w-5 h-5 text-red-600" />
    </ActionButton>

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
                <span>Export to Word</span>
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

export default {
  name: 'LetterActions',
  components: {
    ActionButton,
    PencilIcon,
    EyeIcon,
    TrashIcon,
    ArrowPathIcon // Add this line
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
      showDeleteModal: false,
      showEditModal: false,
      isConverting: false,
      deleteConfirmed: false
    }
  },
  methods: {
    handlePreviewPDF() {
      this.$emit('preview-pdf', this.letter);
      this.showPreviewModal = false;
    },
    handleExportWord() {
      this.isConverting = true;
      this.$emit('convert-pdf-to-word', this.letter);
      this.showPreviewModal = false;
      
      setTimeout(() => {
        this.isConverting = false;
      }, 10000);
    }, // Add comma here between methods
    confirmDelete() {
      this.deleteConfirmed = true;
      this.$emit('delete', this.letter.id);
      setTimeout(() => {
        this.deleteConfirmed = false;
        this.showDeleteModal = false;
      }, 2000);
    }
  }
};
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