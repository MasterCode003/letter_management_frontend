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

    <ActionButton 
      variant="document" 
      @click="showPreviewModal = true" 
      title="Document Options"
    >
      <DocumentIcon class="w-5 h-5 text-purple-600" />
    </ActionButton>

    <ActionButton variant="delete" @click="handleDelete" title="Delete Letter">
      <TrashIcon class="w-5 h-5 text-red-600" />
    </ActionButton>

    <PreviewOptionsModal
      v-if="showPreviewModal"
      :letter="letter"
      @preview="handlePreviewPDF"
      @convert-pdf-to-word="handleExportWord"
      @close="showPreviewModal = false"
    />
    
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

    
    <!-- Keep only the Word conversion loading modal -->
    <div v-if="isConverting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center gap-3">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Converting to Word...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { CSpinner } from '@coreui/vue'
import ActionButton from './ActionButton.vue'
import { 
  PencilIcon, 
  TrashIcon,
  ArrowPathIcon,
  DocumentIcon 
} from '@heroicons/vue/24/solid'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import PreviewOptionsModal from './modals/PreviewOptionsModal.vue'

export default {
  name: 'LetterActions',
  components: {
    ActionButton,
    PencilIcon,
    TrashIcon,
    ArrowPathIcon,
    DocumentIcon,
    SuccessMessageModal,
    CSpinner,
    PreviewOptionsModal
  },
  props: {
    letter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showPreviewModal: false, // Changed from showConvertModal
      showSuccessMessage: false,
      showEditModal: false,
      isConverting: false,
      isLoadingPDF: false,
      showErrorMessage: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleExportWord() {
      try {
        this.isConverting = true;
        this.showPreviewModal = false; // Changed from showPreviewModal
        await this.$emit('convert-pdf-to-word', this.letter);
      } catch (error) {
        console.error('Conversion error:', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Failed to convert PDF to Word. Please try again.';
      } finally {
        this.isConverting = false;
      }
    },
    async handlePreviewPDF() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://192.168.5.71:8000';
        const endpoint = `${baseUrl}/api/letters/preview-pdf/${this.letter.id}`;
        
        console.log('Attempting to fetch PDF from:', endpoint);
        console.log('Letter ID:', this.letter.id);
        
        // First verify the endpoint exists
        const checkResponse = await fetch(endpoint, {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!checkResponse.ok) {
          throw new Error(`Endpoint not found (${checkResponse.status}). Please verify the backend route exists.`);
        }

        this.isLoadingPDF = true;
        
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/pdf',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }).catch(err => {
          throw new Error(`Network error: ${err.message}`);
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', response.status, errorText);
          throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('PDF preview error:', error);
        this.showErrorMessage = true;
        this.errorMessage = error.message;
      } finally {
        this.isLoadingPDF = false;
      }
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
  gap: 0.75rem;
}

.fas {
  font-size: 1.1rem;
}

/* Add styles for disabled state */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>