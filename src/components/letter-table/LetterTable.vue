
<template>
  <div class="p-6">
    <!-- Search Filters Component with New Button -->
    <SearchFilters
      :filters="{
        searchQuery,
        searchSubject,
        searchRecipient,
        selectedType,
        dateRange
      }"
      @update:filters="updateFilters"
      @new-letter="handleNewLetterClick"
      class="mb-6"
    />

    <!-- Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="letter in paginatedLetters" :key="letter.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <LetterActions 
                  :letter="letter"
                  @edit="openEditModal"
                  @preview-pdf="previewPDF"
                  @export-word="exportToWord"
                  @delete="confirmDelete"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
              <!-- In the template section, update the type column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-100 text-blue-800': letter.type === 'Business Letter',
                  'bg-green-100 text-green-800': letter.type === 'Memo'
                }">
                  {{ letter.type || 'Unknown Type' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.subject }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <template v-if="letter.recipients && letter.recipients.length">
                    <span 
                      v-for="(recipient, index) in letter.recipients" 
                      :key="index"
                      class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      <div class="flex flex-col">
                        <span class="text-blue-600">{{ recipient.name }}</span>
                        <span v-if="recipient.position" class="text-xs text-gray-500">
                          {{ recipient.position }}
                        </span>
                      </div>
                    </span>
                  </template>
                  <span v-else class="text-gray-500">No recipients</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

   
    <!-- Add background and border styling to pagination -->
    <div class="mt-4 bg-white rounded-lg shadow">
      <!-- Update the TablePagination usage -->
      <TablePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :displayed-pages="displayedPages"
        :total-items="filteredLetters.length"
        :items-per-page="perPage"
        @previous="previousPage"
        @next="nextPage"
        @goto-page="goToPage"
        class="p-4"
      />
    </div>

    <!-- Add transition and styling to modal -->
    <!-- Replace the existing modal section -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <LetterModal
              :letter="selectedLetter"
              @close="closeModal"
              @save-letter="handleLetterSaved"
              @update-letter="handleLetterSaved"
              @refresh-letters="fetchLetters"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Letter</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Are you sure you want to delete this letter? This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteLetter(confirmDeleteId)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              @click="showDeleteConfirmModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="showDeleteSuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      Letter deleted successfully!
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

<script>
import apiClient from '@/utils/apiClient';
import LetterModal from './LetterModal.vue';
import LetterActions from './LetterActions.vue';
import SearchFilters from './SearchFilters.vue';
import TablePagination from './TablePagination.vue';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';
import useLetterUpdate from './composables/useLetterUpdate';
import useLetterDelete from './composables/useLetterDelete';
import useLetterPreview from './composables/useLetterPreview';

export default {
  name: 'LetterTable',
  components: {
    LetterModal,
    LetterActions,
    SearchFilters,
    TablePagination,
    DeleteConfirmationModal
  },
  emits: ['refresh-letters'],
  data() {
    return {
      letters: [],
      recipients: [],
      showModal: false,
      showLetterForm: false,
      showEditModal: false,
      showDeleteConfirmModal: false,
      showDeleteSuccess: false,
      confirmDeleteId: null,
      selectedLetter: null,
      currentPage: 1,
      perPage: 10,
      searchQuery: '',
      sortKey: 'title',
      dateRange: {
        start: '',
        end: ''
      },
      selectedType: '', // Add this line
      searchSubject: '',
      searchRecipient: '',
      isFetching: false,       // Moved inside data()
      lastRequestTime: 0,      // Moved inside data()
      // Remove these properties as they're no longer needed
      dropdownStates: {},
      showPdfPreview: false,
      currentPdfUrl: null,
      networkStatus: false
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredLetters.length / this.perPage));
    },
    // In the computed section, update the filteredLetters method
    filteredLetters() {
      return this.letters.filter(letter => {
        const matchesTitle = letter.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false;
        const matchesSubject = letter.subject?.toLowerCase().includes(this.searchSubject.toLowerCase()) ?? false;
        // Update this line to use letter.type instead of letter.type?.toLowerCase()
        const matchesType = this.selectedType ? letter.type === this.selectedType : true;
        
        // Rest of the code remains the same
        const matchesRecipient = this.searchRecipient ? 
          (Array.isArray(letter.recipients) ? 
            letter.recipients.some(r => r.toLowerCase().includes(this.searchRecipient.toLowerCase())) :
            String(letter.recipients).toLowerCase().includes(this.searchRecipient.toLowerCase())
          ) : true;
        
        const letterDate = new Date(letter.date);
        const matchesDateRange = (!this.dateRange.start || letterDate >= new Date(this.dateRange.start)) &&
                                   (!this.dateRange.end || letterDate <= new Date(this.dateRange.end));
        
        return matchesTitle && matchesSubject && matchesType && matchesRecipient && matchesDateRange;
      });
    },
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    paginatedLetters() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredLetters.slice(start, end);
    },
    availableRecipients() {
      return this.recipients || []; // Ensure we always return an array
    },
  },
  async mounted() {
    try {
      await this.fetchLetters();
      await this.fetchRecipients();
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Date formatting error:', error);
        return dateString;
      }
    },
    formatDateForInput(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    },
    // Keep only one version of each method
    updateFilters(newFilters) {
      this.searchQuery = newFilters.searchQuery;
      this.searchSubject = newFilters.searchSubject;
      this.searchRecipient = newFilters.searchRecipient;
      this.selectedType = newFilters.selectedType;
      this.dateRange = newFilters.dateRange;
      this.currentPage = 1; // Reset to first page when filters change
    },

    closeEditModal() {
      this.showEditModal = false;
      this.currentLetter = null;
    },

    handleNewLetterClick() {
      this.selectedLetter = null;
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.selectedLetter = null;
    },

    async handleLetterSaved(letterData) {
      try {
        if (!letterData) {
          throw new Error('Letter data is undefined');
        }

        console.log('Original letter data:', letterData);

        // Validate recipients
        if (!letterData.recipients || !Array.isArray(letterData.recipients) || letterData.recipients.length === 0) {
          throw new Error('Please select at least one recipient');
        }

        // Ensure each recipient has required fields
        const validRecipients = letterData.recipients.filter(recipient => 
          recipient && 
          recipient.id && 
          recipient.name && 
          recipient.name.trim()
        );

        if (validRecipients.length === 0) {
          throw new Error('At least one recipient with a name is required');
        }

        // Update letterData with validated recipients
        const updatedLetterData = {
          ...letterData,
          recipients: validRecipients
        };

        console.log('Processed letter data:', updatedLetterData);

        if (letterData.id) {
          await this.updateLetter(updatedLetterData);
        } else {
          await this.addLetter(updatedLetterData);
        }
        
        this.showLetterForm = false;
        this.showEditModal = false;
        await this.fetchLetters();
        this.$router.push('/letters');
      } catch (error) {
        console.error('Error saving letter:', error);
        alert(error.message || 'Failed to save letter. Please check all required fields.');
      }
    },

    async addLetter(letterData) {
      try {
        // Ensure we have valid recipients with names
        if (!letterData.recipients || !letterData.recipients.length) {
          throw new Error('At least one recipient with a name is required');
        }

        // Format recipients with both IDs and names
        const recipients = letterData.recipients.map(recipient => ({
          id: recipient.id,
          name: recipient.name,
          position: recipient.position || ''
        }));

        const formattedData = {
          title: letterData.title?.trim() || '',
          subject: letterData.subject?.trim() || '',
          type: letterData.type || '',
          date: this.formatDateForInput(letterData.date),
          recipients: recipients, // Send full recipient objects
          recipient_ids: recipients.map(r => r.id),
          content: letterData.content?.trim() || '',
          sender_name: letterData.sender_name?.trim() || '',
          sender_position: letterData.sender_position?.trim() || ''
        };

        console.log('Sending formatted data:', formattedData);

        const response = await apiClient.post('/letters', formattedData);
        
        if (response.data.success) {
          await this.fetchLetters();
          this.showLetterForm = false;
          this.currentPage = 1;
          this.$emit('refresh-letters');
        }
      } catch (error) {
        console.error('Error adding letter:', error);
        throw error;
      }
    },

    async updateLetter(letterData) {
      try {
        if (!letterData.id) {
          throw new Error('Letter ID is required for update');
        }

        // Log incoming data for debugging
        console.log('Incoming letter data:', letterData);

        // Ensure recipients is properly formatted
        if (!letterData.recipients || !Array.isArray(letterData.recipients) || letterData.recipients.length === 0) {
          throw new Error('At least one recipient with a name is required');
        }

        // Format recipients
        const recipients = letterData.recipients.map(recipient => ({
          id: Number(recipient.id),
          name: recipient.name,
          position: recipient.position || ''
        }));

        const formattedData = {
          id: letterData.id,
          title: letterData.title?.trim() || '',
          subject: letterData.subject?.trim() || '',
          type: letterData.type || '',
          date: this.formatDateForInput(letterData.date),
          recipients: recipients,
          recipient_ids: recipients.map(r => r.id),
          content: letterData.content?.trim() || '',
          sender_name: letterData.sender_name?.trim() || '',
          sender_position: letterData.sender_position?.trim() || ''
        };

        console.log('Formatted data being sent:', formattedData);

        const response = await apiClient.put(`/letters/${letterData.id}`, formattedData);
        
        if (response.data?.success) {
          await this.fetchLetters();
          this.showModal = false;
          this.$emit('refresh-letters');
          return response.data;
        }

        throw new Error(response.data?.message || 'Update failed');
      } catch (error) {
        console.error('Error updating letter:', error);
        throw error;
      }
    },

    // Keep only one fetchLetters
    async fetchLetters() {
      try {
        const response = await apiClient.get('/letters', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data?.success && Array.isArray(response.data.data)) {
          this.letters = response.data.data.map(letter => ({
            ...letter,
            date: letter.date || new Date().toISOString().split('T')[0],
            type: letter.type || 'Unknown Type',
            recipients: Array.isArray(letter.recipients) ? letter.recipients : []
          }));
        } else {
          this.letters = [];
        }
      } catch (error) {
        console.error('Letters fetch error:', error);
        this.letters = [];
        if (error.response?.data?.error?.includes('Table')) {
          alert('Database tables are not set up. Please contact your system administrator.');
        } else {
          alert('Failed to fetch letters. Please try again later.');
        }
      }
    },

    // Keep only one deleteLetter
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.showDeleteConfirmModal = true;
    },

    async deleteLetter() {
      try {
        if (!this.confirmDeleteId) return;
        
        const response = await apiClient.delete(`/letters/${this.confirmDeleteId}`);
        if (response.data.success) {
          this.showDeleteConfirmModal = false;
          this.showDeleteSuccess = true;
          await this.fetchLetters();
          
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 2000);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.response?.data?.message || 'Failed to delete letter');
      } finally {
        this.confirmDeleteId = null;
      }
    },

    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        console.log('Recipients response:', response.data); // Debug log

        if (response.data?.success && Array.isArray(response.data.data)) {
          this.recipients = response.data.data.map(recipient => ({
            id: recipient.id,
            name: recipient.name || '',
            position: recipient.position || '',
            selected: false
          }));
          console.log('Processed recipients:', this.recipients); // Debug log
        } else {
          console.warn('Invalid recipients data structure:', response.data);
          this.recipients = [];
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        console.log('Error response:', error.response); // Debug log
        this.recipients = [];
        if (error.response?.status === 404) {
          alert('Recipients endpoint not found. Please check your API configuration.');
        } else if (error.response?.data?.error?.includes('Table')) {
          alert('Recipients table is not set up. Please contact your system administrator.');
        } else {
          alert('Failed to fetch recipients. Please check the console for details.');
        }
      }
    },
    // Add pagination methods
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    // Add edit modal method
    openEditModal(letter) {
      this.selectedLetter = { ...letter };
      this.showModal = true;
    },

    async previewPDF(letter) {
      try {
        console.log('Requesting preview for letter:', letter.id);
        
        await apiClient.get(`/letters/${letter.id}/preview`, {
          responseType: 'blob',
          headers: {
            'Accept': 'text/html, application/pdf',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
      } catch (error) {
        console.error('Preview Error:', error);
        alert('Failed to generate preview. Please try again.');
      }
    },

    async exportToWord(letter) {
      try {
        console.log('Exporting letter to Word:', letter.id);
        
        const response = await apiClient.get(`/letters/${letter.id}/export-word`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
    
        // Validate response
        if (!response.data || response.data.size === 0) {
          throw new Error('Empty document received from server');
        }
    
        console.log('Word document size:', response.data.size);
    
        // Create blob with proper MIME type
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
    
        if (blob.size === 0) {
          throw new Error('Generated document is empty');
        }
    
        // Create and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${letter.title || 'letter'}_${new Date().toISOString().split('T')[0]}.docx`;
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
    
      } catch (error) {
        console.error('Word Export Error:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          contentType: error.response?.headers?.['content-type'],
          size: error.response?.data?.size
        });
        alert('Failed to export Word document. Please try again.');
      }
    }
  }
};
</script>


