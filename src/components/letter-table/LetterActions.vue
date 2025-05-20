<template>
  <div class="flex items-center space-x-2">
    <!-- Edit Button -->
    <ActionButton 
      variant="edit" 
      @click="handleEdit"  
      title="Edit Letter"
      class="group relative hover:bg-blue-600 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"></path>
          <path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3"></path>
          <path d="M16 5l3 3"></path>
        </g>
      </svg>
    </ActionButton>

    <!-- Preview Button -->
    <ActionButton 
      variant="preview"
      @click="showPreviewModal = true"
      title="Preview PDF"
      class="group relative hover:bg-purple-600 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5">
        <path d="M307.94 248L216 154.52V242a6 6 0 0 0 6 6z" fill="currentColor"></path>
        <path d="M184 268V144H60a12 12 0 0 0-12 12v328a12 12 0 0 0 12 12h248a12 12 0 0 0 12-12V280H196a12 12 0 0 1-12-12z" fill="currentColor"></path>
        <path d="M366 120h85.94L360 26.52V114a6 6 0 0 0 6 6z" fill="currentColor"></path>
        <path d="M340 152a12 12 0 0 1-12-12V16H172a12 12 0 0 0-12 12v84h42.12A40.81 40.81 0 0 1 231 124.14l109.16 111a41.11 41.11 0 0 1 11.83 29V400H452a12 12 0 0 0 12-12V152z" fill="currentColor"></path>
      </svg>
    </ActionButton>

    <!-- Trash Button -->
    <ActionButton 
      variant="delete"
      @click="handleDelete"
      title="Delete Letter"
      class="group relative hover:bg-red-600 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M9 6v12m6-12v12M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"></path>
      </svg>
    </ActionButton>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteConfirm"
      title="Confirm Delete"
      message="Are you sure you want to delete this letter?"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Success Message Modal -->
    <SuccessMessageModal
      v-if="showDeleteSuccess"
      message="Letter deleted successfully!"
      @close="showDeleteSuccess = false"
    />

    <!-- Add PreviewOptionsModal -->
    <PreviewOptionsModal
      v-if="showPreviewModal"
      :letter="letter"
      @preview-pdf="handlePreviewPDF"
      @export-word="handleExportWord"
      @close="showPreviewModal = false"
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

    <!-- Loading modal for Word export -->
    <div v-if="isConverting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center gap-3">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Exporting to Word...</span>
      </div>
    </div>

    <!-- Loading modal for PDF preview -->
    <div v-if="isLoadingPDF" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center gap-3">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Generating PDF preview...</span>
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
import ConfirmationModal from './modals/ConfirmationModal.vue'
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
    CSpinner,
    PreviewOptionsModal,
    ConfirmationModal,
    SuccessMessageModal
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
      errorMessage: '',
      showDeleteConfirm: false,
      showDeleteSuccess: false
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

        const normalizedType = this.letter.type?.trim().toLowerCase();
        const endpointMap = {
          'memo': `/memos/${this.letter.id}/preview-pdf`,
          'endorsement': `/endorsements/${this.letter.id}/preview-pdf`,
          'letter to admin': `/letters-to-admin/${this.letter.id}/preview-pdf`,
          'invitation meeting': `/invitation-meetings/${this.letter.id}/preview-pdf`,
          'letter_to_admin': `/letters-to-admin/${this.letter.id}/preview-pdf`,
          'invitation_meeting': `/invitation-meetings/${this.letter.id}/preview-pdf`
        };

        const endpoint = endpointMap[normalizedType];
        if (!endpoint) {
          throw new Error(`Invalid letter type: ${this.letter.type}`);
        }

        const response = await apiClient.get(endpoint, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          },
          baseURL: 'http://192.168.5.94:8000'
        });

        if (response.status !== 200 || !response.headers['content-type'].includes('application/pdf')) {
          throw new Error('Invalid content type received from server');
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        console.error('PDF preview error:', error);
        this.errorMessage = error.message || 'Failed to generate PDF preview. Please try again.';
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
      this.showDeleteConfirm = true;
    },
    async confirmDelete() {
      try {
        await apiClient.delete(`/letters/${this.letter.id}`);
        this.showDeleteConfirm = false;
        this.showDeleteSuccess = true;
        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 1500);
      } catch (error) {
        console.error('Delete error:', error);
        this.errorMessage = error.message || 'Failed to delete letter. Please try again.';
        this.showErrorMessage = true;
      }
    }
  }
}
</script>

<style scoped>
.flex.items-center.space-x-2 {
  gap: 0.75rem;
}
</style>