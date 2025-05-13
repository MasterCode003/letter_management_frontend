<template>
  <div class="flex items-center space-x-2">
    <ActionButton 
      variant="edit" 
      @click="handleEdit"
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

    <!-- Loading modal -->
    <div v-if="isConverting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center gap-3">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Exporting to Word...</span>
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
import apiClient from '@/utils/apiClient';

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
  emits: ['edit', 'delete', 'preview-pdf', 'convert-pdf-to-word'],
  data() {
    return {
      showPreviewModal: false,
      showSuccessMessage: false,
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
        this.showPreviewModal = false;
        await this.$emit('convert-pdf-to-word', this.letter);
      } catch (error) {
        console.error('Export error:', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Failed to export to Word. Please try again.';
      } finally {
        this.isConverting = false;
      }
    },
    async handlePreviewPDF() {
      try {
        if (!this.letter?.id) {
          throw new Error('No letter selected');
        }

        const response = await apiClient.get(`/api/letters/${this.letter.id}/preview`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          },
          baseURL: 'http://192.168.5.94:8000'
        });

        // Add response validation
        if (response.status !== 200) {
          console.error('Unexpected response:', response);
          throw new Error(`Server returned status ${response.status}`);
        }

        // Verify we received PDF content
        if (!response.headers['content-type'].includes('application/pdf')) {
          console.warn('Received non-PDF response:', response.headers, response.data);
          throw new Error('Invalid content type received from server');
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        console.error('PDF preview error:', {
          message: error.message,
          response: error.response?.data,
          config: error.config
        });
        this.errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         error.message || 
                         'Failed to generate PDF preview. Please try again.';
        this.showErrorMessage = true;
      }
    },
    handleEdit() {
      try {
        if (!this.letter) {
          throw new Error('Letter data is missing');
        }
        
        const validLetter = {
          id: this.letter.id,
          title: this.letter.title || '',
          type: this.letter.type || '',
          subject: this.letter.subject || '',
          date: this.letter.date || '',
          recipients: (Array.isArray(this.letter.recipients) ? this.letter.recipients : []).map(r => ({
            id: r?.id || '',
            name: r?.name || '',
            position: r?.position || ''
          })),
          content: this.letter.content || '',
          sender_name: this.letter.sender_name || '',
          sender_position: this.letter.sender_position || ''
        };
        
        this.$emit('edit', validLetter);
      } catch (error) {
        console.error('Edit error:', error);
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
</style>