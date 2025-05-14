
<template>
  <div class="p-6">
    <!-- Add New Letter button above SearchFilters -->
    <div class="flex justify-end mb-4">
      <button
        @click="showModal = true"  
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Letter
      </button>
    </div>

    <!-- Update SearchFilters to remove the new letter button -->
    <SearchFilters
      :filters="{
        searchQuery,
        searchSubject,
        searchRecipient,
        selectedType,
        dateRange
      }"
      @update:filters="updateFilters"
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
                <div class="flex items-center space-x-2">
                  <LetterActions 
                    :letter="letter"
                    :is-loading="isPreviewLoading"
                    @edit="openEditModal"
                    @preview-pdf="previewPDF"
                    @convert-pdf-to-word="convertPDFToWord"
                    @delete="confirmDelete"
                  />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
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
                  <template v-if="letter.recipients && letter.recipients.length > 0">
                    <span 
                      v-for="(recipient, index) in letter.recipients" 
                      :key="index"
                      class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      <div class="flex flex-col" v-if="recipient">
                        <span class="text-blue-600">{{ recipient?.name || 'Unnamed Recipient' }}</span>
                        <span v-if="recipient?.position" class="text-xs text-gray-500">
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
              v-model="showModal"
              :letter="selectedLetter"
              :available-recipients="availableRecipients"
              @save-letter="handleSaveLetter"
              @update-letter="handleUpdateLetter"
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

    <!-- Update the LetterEditModal component usage -->
    
    <LetterEditModal
      v-model="showEditModal"
      :letter="selectedLetter || { 
        title: '',
        type: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [],
        content: '',
        sender_name: '',
        sender_position: ''
      }"
      :edit-mode="editMode"
      @update:edit-mode="val => editMode = val"
      @refresh-letters="fetchLetters"
      @close="resetSelection"
    />
  
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
// Update the import statement
import SearchFilters from './SearchFilters.vue';
import TablePagination from './TablePagination.vue';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal.vue';  // Updated path
import useLetterUpdate from './composables/useLetterUpdate';
import useLetterDelete from './composables/useLetterDelete';
import useLetterPreview from './composables/useLetterPreview';
import LetterEditModal from './LetterEditModal.vue';

export default {
  name: 'LetterTable',
  components: {
    LetterModal,
    LetterActions,
    SearchFilters,
    TablePagination,
    DeleteConfirmationModal,
    LetterEditModal
  },
  emits: ['refresh-letters'],
  data() {
    return {
      isPreviewLoading: false,  // Add this line
      letters: [],
      recipients: [], // Add this line if not already present
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
      let filtered = this.letters.filter(letter => {
        const matchesTitle = letter.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false;
        const matchesSubject = letter.subject?.toLowerCase().includes(this.searchSubject.toLowerCase()) ?? false;
        const matchesType = this.selectedType ? letter.type === this.selectedType : true;
        
        const matchesRecipient = this.searchRecipient ? 
          (Array.isArray(letter.recipients) ? 
            letter.recipients.some(r => 
              r.name?.toLowerCase().includes(this.searchRecipient.toLowerCase()) ||
              r.position?.toLowerCase().includes(this.searchRecipient.toLowerCase())
            ) :
            false
          ) : true;
        
        const letterDate = new Date(letter.date);
        const matchesDateRange = (!this.dateRange.start || letterDate >= new Date(this.dateRange.start)) &&
                               (!this.dateRange.end || letterDate <= new Date(this.dateRange.end));
        
        return matchesTitle && matchesSubject && matchesType && matchesRecipient && matchesDateRange;
      });
    
      // Prefer sorting by created_at or id if available
      filtered.sort((a, b) => {
        // If created_at exists, use it
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        // Otherwise, fallback to id (assuming higher id is newer)
        if (a.id && b.id) {
          return b.id - a.id;
        }
        // Fallback to date
        return new Date(b.date) - new Date(a.date);
      });
      return filtered;
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

    // Remove or update this method:
    handleNewLetterClick() {
      this.showModal = true;
      this.selectedLetter = null; // Clear any previous letter data
    },
    
    closeModal() {
      this.showModal = false;
      this.selectedLetter = null;
    },

    async handleLetterSaved(letterData) {
      try {
        // Add loading state
        this.isFetching = true;
        
        if (letterData.id) {
          await this.updateLetter(letterData);
        } else {
          await this.addLetter(letterData);
        }
        
        // Force refresh from server
        await this.fetchLetters();
        
        this.showModal = false;
        this.showEditModal = false;
      } catch (error) {
        console.error('Error saving letter:', error);
        alert(error.message || 'Failed to save letter. Please check all required fields.');
      } finally {
        this.isFetching = false;
      }
    },

    // In addLetter method - Remove the recipient validation
    async addLetter(letterData) {
      try {
        const formattedData = {
          title: letterData.title?.trim(),
          subject: letterData.subject?.trim(),
          type: letterData.type,
          date: letterData.date ? this.formatDateForInput(letterData.date) : this.formatDateForInput(new Date()),
          // Use IDs directly from form data
          recipients: letterData.recipients.filter(r => r !== null), // Add filter to remove null entries
          content: letterData.content?.trim(),
          sender_name: letterData.sender_name?.trim(),
          sender_position: letterData.sender_position?.trim()
        };

        const response = await apiClient.post('/letters/', formattedData);
        
        if (response?.data?.success) {
          await this.fetchLetters();
          this.showModal = false;
          return response.data;
        }
        
        throw new Error(response?.data?.message || 'Failed to save letter');
      } catch (error) {
        console.error('Error adding letter:', error);
        throw error;
      }
    },

    // In updateLetter method
    async updateLetter(letterData) {
      try {
        // Add comprehensive validation
        if (!letterData.id) throw new Error('Letter ID required');
        
        const requiredFields = {
          title: letterData.title?.trim(),
          type: letterData.type?.trim(),
          subject: letterData.subject?.trim(),
          content: letterData.content?.trim()
        };
        
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) throw new Error(`${field} is required`);
        }

    
        // Keep only this single declaration:
        const recipients = letterData.recipients
          .filter(r => r !== null)
          .map(recipient => {
            if (typeof recipient === 'object') return recipient;
            const found = this.recipients.find(r => r.id === recipient);
            return found ? { name: found.name, position: found.position } : null;
          })
          .filter(Boolean);

        if (recipients.length === 0) {
          throw new Error('At least one recipient with a name is required');
        }

        const formattedData = {
          id: letterData.id,
          title: letterData.title.trim(),
          subject: letterData.subject?.trim() || '',  // Provide default empty string
          type: letterData.type || 'Business Letter',  // Provide default type
          date: this.formatDateForInput(letterData.date || new Date()),
          recipients: recipients,
          content: letterData.content?.trim() || '',  // Provide default empty string
          sender_name: letterData.sender_name?.trim() || '',  // Provide default empty string
          sender_position: letterData.sender_position?.trim() || ''  // Provide default empty string
        };

        const response = await apiClient.put(`/letters/${letterData.id}`, formattedData);
        
        if (response.data?.success) {
          await this.fetchLetters();
          this.showModal = false;
          return response.data;
        }

        throw new Error(response.data?.message || 'Update failed');
      } catch (error) {
        console.error('Error updating letter:', error);
        throw error;
      }
    },

    // Keep only one fetchLetters
    async handleRefreshLetters(params = {}) {
      const query = new URLSearchParams({
        sort: params.sort || '-updated_at',
        page: params.page || 1
      }).toString();
    
      try {
        const response = await apiClient.get(`/letters?${query}`);
        this.letters = response.data.data;
    
        if (response.data.meta) {
          this.pagination = response.data.meta;
          this.currentPage = response.data.meta.current_page;
        }
      } catch (error) {
        console.error('Refresh error:', error);
        alert('Failed to refresh letters');
      }
    },

    async fetchLetters() {
      await this.handleRefreshLetters({ sort: '-updated_at' });
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
        console.log('Recipients response:', response.data);

        // Handle both data structures: {data: [...]} and direct array
        const recipientsData = response.data?.data || response.data || [];
        
        if (Array.isArray(recipientsData)) {
          this.recipients = recipientsData.map(recipient => ({
            id: recipient.id,
            name: recipient.name || '',
            position: recipient.position || '',
            selected: false
          }));
          console.log('Processed recipients:', this.recipients);
        } else {
          console.warn('Invalid recipients data structure:', response.data);
          this.recipients = [];
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        console.log('Error response:', error.response);
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
      this.showEditModal = true;
    },

    previewPDF(letter) {
      // ... your existing previewPDF logic ...
    },

    async convertPDFToWord(letter) {
      try {
        this.isPreviewLoading = true;
        
        if (!letter?.id) {
          throw new Error('Invalid letter ID');
        }

        // Updated endpoint to use export endpoint
        const response = await apiClient.get(`/letters/${letter.id}/export`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        });

        // Create and trigger download
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${letter.title || 'letter'}.docx`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export document. Please try again.');
      } finally {
        this.isPreviewLoading = false;
      }
    }
  } // <-- This closes the methods object. No comma needed if this is the last property in export default.
} // <-- This closes the export default object.

</script>


