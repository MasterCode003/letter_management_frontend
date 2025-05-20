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

    <!-- Add PreviewOptionsModal -->
    <PreviewOptionsModal
      v-if="showPreviewModal"
      :letter="letter"
      @preview-pdf="handlePreviewPDF"
      @export-word="handleExportWord"
      @close="showPreviewModal = false"
    />

    <!-- Delete Button -->
    <ActionButton 
      variant="delete"
      @click="$emit('delete', letter.id)"
      title="Delete Letter"
      class="group relative hover:bg-red-600 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5">
        <rect x="32" y="48" width="448" height="80" rx="32" ry="32" fill="currentColor"></rect>
        <path d="M74.45 160a8 8 0 0 0-8 8.83l26.31 252.56a1.5 1.5 0 0 0 0 .22A48 48 0 0 0 140.45 464h231.09a48 48 0 0 0 47.67-42.39v-.21l26.27-252.57a8 8 0 0 0-8-8.83zm248.86 180.69a16 16 0 1 1-22.63 22.62L256 318.63l-44.69 44.68a16 16 0 0 1-22.63-22.62L233.37 296l-44.69-44.69a16 16 0 0 1 22.63-22.62L256 273.37l44.68-44.68a16 16 0 0 1 22.63 22.62L278.62 296z" fill="currentColor"></path>
      </svg>
    </ActionButton>
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
    // Remove SuccessMessageModal from components
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

        // Normalize the letter type and convert to lowercase for comparison
        const normalizedType = this.letter.type?.trim().toLowerCase();
        console.log('Letter type:', normalizedType);

        // Map letter types to their corresponding endpoints (using lowercase keys)
        const endpointMap = {
          'memo': `/memos/${this.letter.id}/preview-pdf`,
          'endorsement': `/endorsements/${this.letter.id}/preview-pdf`,
          'letter to admin': `/letters-to-admin/${this.letter.id}/preview-pdf`,
          'invitation meeting': `/invitation-meetings/${this.letter.id}/preview-pdf`,
          // Add snake_case variants
          'letter_to_admin': `/letters-to-admin/${this.letter.id}/preview-pdf`,
          'invitation_meeting': `/invitation-meetings/${this.letter.id}/preview-pdf`
        };

        const endpoint = endpointMap[normalizedType];
        if (!endpoint) {
          console.error('Type mapping failed for:', normalizedType);
          throw new Error(`Invalid letter type: ${this.letter.type}`);
        }

        console.log('Using endpoint:', endpoint); // Debug log

        const response = await apiClient.get(endpoint, {
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
      // Remove the success message handling from here
    }
  }
}
</script>

<style scoped>
.flex.items-center.space-x-2 {
  gap: 0.75rem;
}
</style>