
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
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold type-badge',
                  {
                    'type-memo': letter.type && letter.type.trim().toLowerCase() === 'memo',
                    'type-endorsement': letter.type && letter.type.trim().toLowerCase() === 'endorsement',
                    'type-invitation': letter.type && letter.type.trim().toLowerCase() === 'invitation meeting',
                    'type-admin': letter.type && letter.type.trim().toLowerCase() === 'letter to admin'
                  }
                ]">
                  {{ letter.type ? letter.type.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown type' }}
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
.type-badge {
  color: #fff;
}
.type-memo {
  background-color: #2563eb; /* blue-700 */
}
.type-endorsement {
  background-color: #059669; /* green-600 */
}
.type-invitation {
  background-color: #7c3aed; /* purple-600 */
}
.type-admin {
  background-color: #ea580c; /* orange-600 */
}
</style>

<script>
// Remove the axios configuration from here and keep only the import
import axios from 'axios';
import apiClient from '@/utils/apiClient';
import LetterModal from './LetterModal.vue';
import LetterActions from './LetterActions.vue';
import SearchFilters from './SearchFilters.vue';
import TablePagination from './TablePagination.vue';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal.vue';
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
        
        // Updated date filtering logic using letter.date
        const letterDate = letter.date ? new Date(letter.date) : null;
        const startDate = this.dateRange.start ? new Date(this.dateRange.start) : null;
        const endDate = this.dateRange.end ? new Date(this.dateRange.end) : null;
        
        const matchesDateRange = !letterDate ? false :
          (!startDate || letterDate >= startDate) &&
          (!endDate || letterDate <= endDate);
        
        return matchesTitle && matchesSubject && matchesType && matchesRecipient && 
          ((!startDate && !endDate) || matchesDateRange);
      });

      // Prefer sorting by created_at or id if available
      filtered.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        if (a.id && b.id) {
          return b.id - a.id;
        }
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
  mounted() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        await this.fetchLetters();
        await this.fetchRecipients();
      } catch (error) {
        console.error('Error during component initialization:', error);
      }
    },
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
        // Handle both ISO date string and regular date string
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
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

    async addLetter(letterData) {
      try {
        const formattedData = {
          title: String(letterData.title?.trim() || ''),
          subject: String(letterData.subject?.trim() || ''),
          type: String(letterData.type || ''),
          date: letterData.date ? this.formatDateForInput(letterData.date) : this.formatDateForInput(new Date()),
          content: String(letterData.content?.trim() || ''),
          sender_name: String(letterData.sender_name?.trim() || ''),
          sender_position: String(letterData.sender_position?.trim() || ''),
          // Ensure recipients is properly formatted
          recipients: letterData.recipients
            .filter(r => r !== null)
            .map(recipient => ({
              id: recipient.id,
              name: String(recipient.name || ''),
              position: String(recipient.position || '')
            }))
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
    }, // Keep this comma
    async fetchLetters() {
      try {
        this.isFetching = true;
        const response = await apiClient.get('/letters', {
          params: {
            sort: '-updated_at'
          }
        });

        if (response.data) {
          // If response.data is an array directly
          if (Array.isArray(response.data)) {
            this.letters = response.data.map(letter => ({
              ...letter,
              type: letter.type || 'Unknown Type' // Ensure type is always set
            }));
          }
          // If response.data has a data property that's an array
          else if (Array.isArray(response.data.data)) {
            this.letters = response.data.data.map(letter => ({
              ...letter,
              type: letter.type || 'Unknown Type' // Ensure type is always set
            }));
            
            if (response.data.meta) {
              this.pagination = response.data.meta;
              this.currentPage = response.data.meta.current_page;
            }
          }
          // If response.data is an object with letters
          else if (typeof response.data === 'object') {
            this.letters = Object.values(response.data);
          }
          else {
            throw new Error('Unexpected response format');
          }
        } else {
          this.letters = [];
        }
      } catch (error) {
        console.error('Refresh error:', error);
        let errorMessage = 'Failed to fetch letters';
        
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
        this.letters = [];
      } finally {
        this.isFetching = false;
      }
    },

    // Keep only one deleteLetter
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.showDeleteConfirmModal = true;
      this.showDeleteSuccess = false; // <-- Add this line to hide success message when opening confirmation modal
    },

    async deleteLetter(id) {
      try {
        await apiClient.delete(`/letters/${id}`);
        this.showDeleteConfirmModal = false;
        this.showDeleteSuccess = true;
        this.fetchLetters(); // Refresh the list immediately
        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 1500);
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
        const recipientsData = response.data?.data || response.data || [];
        if (Array.isArray(recipientsData)) {
          this.recipients = recipientsData.map(recipient => ({
            id: recipient.id,
            name: recipient.name || '',
            position: recipient.position || '',
            selected: false
          }));
        } else {
          this.recipients = [];
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipients = [];
        alert('Failed to fetch recipients. Please try again.');
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
      // Normalize type before passing to modal
      const typeMap = {
        'memo': 'Memo',
        'endorsement': 'Endorsement',
        'invitation_meeting': 'Invitation Meeting',
        'invitation meeting': 'Invitation Meeting',
        'letter_to_admin': 'Letter to Admin',
        'letter to admin': 'Letter to Admin',
        'Memo': 'Memo',
        'Endorsement': 'Endorsement',
        'Invitation Meeting': 'Invitation Meeting',
        'Letter to Admin': 'Letter to Admin'
      };
      this.selectedLetter = {
        ...letter,
        type: typeMap[letter.type?.toLowerCase().replace(/_/g, ' ')] || ''
      };
      this.editMode = true;
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


