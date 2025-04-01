
<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-end items-center mb-6">
      <!-- Update the New button click handler -->
      <button 
        @click="$router.push('/letters/new')" 
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New
      </button>
      
      <!-- Update the router-view section -->
      <router-view 
        v-if="$route.name === 'letter-new' || $route.name === 'letter-edit'"
        @letter-saved="handleLetterSaved"
        @close="$router.push('/letters')"
      ></router-view>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="letter in letters" :key="letter.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <LetterActions 
                  :letter="letter"
                  @edit="openEditModal"
                  @preview="previewLetter"
                  @download="downloadLetter"
                  @export-word="exportToWord"
                  @delete="confirmDelete"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.subject }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <template v-if="letter.recipients">
                    <span 
                      v-for="(recipient, index) in (typeof letter.recipients === 'string' ? 
                        JSON.parse(letter.recipients) : letter.recipients)" 
                      :key="index"
                      class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      <div class="flex flex-col">
                        <span>{{ typeof recipient === 'object' ? recipient.name : recipient }}</span>
                        <span v-if="typeof recipient === 'object' && recipient.position" 
                              class="text-xs text-gray-500"
                        >
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

    <!-- Letter Modal -->
    <LetterModal
      v-if="showModal"
      @close="showModal = false"
      :letter="selectedLetter"
    />
  </div>
</template>

<script>
import apiClient from '@/utils/apiClient';
import LetterModal from './LetterModal.vue';
import LetterActions from './LetterActions.vue';
import * as pdfjsLib from 'pdfjs-dist';

export default {
  components: {
    LetterModal,
    LetterActions
  },
  emits: ['refresh-letters'],
  data() {
    return {
      letters: [],
      recipients: [],
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
      return this.letters.filter(letter => {
        const matchesTitle = letter.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false;
        const matchesSubject = letter.subject?.toLowerCase().includes(this.searchSubject.toLowerCase()) ?? false;
        const matchesType = this.selectedType ? letter.type?.toLowerCase() === this.selectedType.toLowerCase() : true;
        const matchesRecipient = this.searchRecipient ? 
          (Array.isArray(letter.recipient) ? 
            letter.recipient.some(r => r.toLowerCase().includes(this.searchRecipient.toLowerCase())) :
            String(letter.recipient).toLowerCase().includes(this.searchRecipient.toLowerCase())
          ) : true;
        
        const letterDate = new Date(letter.date);  // Changed from date_created to date
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
    // Update the availableRecipients computed property
    availableRecipients() {
    // Filter out already selected recipients
    return this.recipients.filter(recipient => 
    !this.selectedRecipients.includes(recipient.name)
    );
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
    closeEditModal() {
      this.showEditModal = false;
      this.currentLetter = null;
    },
    // Remove or update handleNewLetterClick as we're using router now
    handleNewLetterClick() {
      this.$router.push('/letters/new');
    },
    
    // Update handleLetterSaved
    async handleLetterSaved(letterData) {
      try {
        await this.fetchLetters();
        this.$router.push('/letters');
      } catch (error) {
        console.error('Error after saving letter:', error);
      }
    },
  
    closeLetterForm() {
      this.showLetterForm = false;
      this.selectedLetter = null;
    },
    addNewRecipient() {
      if (!this.currentLetter.recipients) {
        this.currentLetter.recipients = [];
      }
      this.currentLetter.recipients.push({
        id: '',
        name: '',
        position: ''
      });
    },
  
    removeRecipientAt(index) {
      this.currentLetter.recipients.splice(index, 1);
    },
  
    updateRecipient(index, recipientId) {
      const selectedRecipient = this.recipients.find(r => r.id === recipientId);
      if (selectedRecipient) {
        this.$set(this.currentLetter.recipients, index, {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        });
      }
    },
  
    // Update the openEditModal method to handle recipients properly
    async openEditModal(letter) {
      try {
        const letterData = { ...letter };
        if (typeof letterData.recipients === 'string') {
          letterData.recipients = JSON.parse(letterData.recipients);
        }
        this.currentLetter = letterData;
        
        // Initialize selectedRecipients with the letter's recipients
        this.selectedRecipients = Array.isArray(letterData.recipients) 
          ? letterData.recipients.map(r => typeof r === 'object' ? r.name : r)
          : [];
    
        // Ensure recipients are fetched
        if (this.recipients.length === 0) {
          await this.fetchRecipients();
        }
        
        this.showEditModal = true;
      } catch (error) {
        console.error('Error preparing letter data for edit:', error);
      }
    },
  
    // Update the addRecipient method
    addRecipient(event) {
      const selectedValue = event.target.value;
      if (selectedValue && !this.selectedRecipients.includes(selectedValue)) {
        this.selectedRecipients.push(selectedValue);
        this.currentLetter.recipients = this.selectedRecipients;
      }
      event.target.value = ''; // Reset select
    },
  
    // Update the removeRecipient method
    removeRecipient(recipient) {
      this.selectedRecipients = this.selectedRecipients.filter(r => r !== recipient);
      this.currentLetter.recipients = this.selectedRecipients;
    },
  
    closeEditModal() {
      this.showEditModal = false;
      this.currentLetter = null;
      this.selectedRecipients = []; // Reset selected recipients
    },
    async handleLetterSaved(letterData) {
      try {
        if (!letterData) {
          console.error('Letter data is undefined');
          return;
        }
    
        if (letterData.id) {
          await this.updateLetter(letterData);
        } else {
          await this.addLetter(letterData);
        }
        
        this.showLetterForm = false;
        this.showEditModal = false;
        await this.fetchLetters();
      } catch (error) {
        console.error('Error saving letter:', error);
        // Show error to user
        alert(error.response?.data?.message || 'Failed to save letter. Please check all required fields.');
      }
    },
    async addLetter(letterData) {
      try {
        // Format recipients to ensure they are strings
        const recipients = Array.isArray(letterData.recipients)
          ? letterData.recipients.map(recipient => 
              typeof recipient === 'object' ? recipient.name : String(recipient)
            )
          : [String(letterData.recipients)];
    
        // Format the data before sending
        const formattedData = {
          title: letterData.title,
          subject: letterData.subject,
          type: letterData.type,
          date: this.formatDateForInput(letterData.date),
          recipients: recipients,
          content: letterData.content || '',
          sender_name: letterData.sender_name,
          sender_position: letterData.sender_position
        };
    
        console.log('Sending letter data:', formattedData);
    
        const response = await apiClient.post('/letters', formattedData);
        
        if (response.data.success) {
          await this.fetchLetters();
          this.showLetterForm = false;
          this.currentPage = 1;
          this.$emit('refresh-letters');
        } else {
          console.error('Server response indicates failure:', response.data);
          throw new Error(response.data.message || 'Failed to add letter');
        }
      } catch (error) {
        console.error('Error adding letter:', error);
        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
          alert(errorMessages);
        }
        throw error;
      }
    },
    async fetchLetters() {
      try {
        console.log('Fetching letters...');
        const response = await apiClient.get('/letters');
        
        if (response.data.success && Array.isArray(response.data.data)) {
          this.letters = response.data.data;
          const maxPage = Math.ceil(this.letters.length / this.perPage);
          if (this.currentPage > maxPage) {
            this.currentPage = maxPage || 1;
          }
        } else {
          console.error('Unexpected data structure:', response.data);
          this.letters = [];
        }
      } catch (error) {
        console.error('Letters fetch error:', error);
        this.letters = [];
      }
    },
    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        if (response.data.success) {
          this.recipients = response.data.data;
          console.log('Recipients fetched:', this.recipients); // Add this line
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipients = [];
      }
    },
    async updateLetter(letterData) {
      try {
        const response = await apiClient.put(`/letters/${letterData.id}`, letterData);
        if (response.data.success) {
          await this.fetchLetters();
          this.showEditModal = false;
        }
      } catch (error) {
        console.error('Error updating letter:', error);
      }
    },
  
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.showDeleteConfirmModal = true;
    },
  
    async deleteLetter(id) {
      try {
        const response = await apiClient.delete(`/letters/${id}`);
        if (response.data.success) {
          this.showDeleteConfirmModal = false;
          this.showDeleteSuccess = true;
          await this.fetchLetters();
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 2000);
        }
      } catch (error) {
        console.error('Error deleting letter:', error);
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
      this.currentPage = page;
    },  // Add comma here
    
    toggleDropdown(letterId) {
      // Create reactive state if it doesn't exist
      if (!this.dropdownStates[letterId]) {
        this.$set(this.dropdownStates, letterId, false);
      }
      
      // Close all other dropdowns first
      Object.keys(this.dropdownStates).forEach(key => {
        if (key !== letterId.toString()) {
          this.$set(this.dropdownStates, key, false);
        }
      });
      
      // Toggle the current dropdown
      this.$set(this.dropdownStates, letterId, !this.dropdownStates[letterId]);
    
      // Close dropdown when clicking preview or download
      if (this.dropdownStates[letterId]) {
        this.$nextTick(() => {
          const handleClickOutside = (event) => {
            if (!event.target.closest('.relative.inline-block')) {
              this.$set(this.dropdownStates, letterId, false);
              document.removeEventListener('click', handleClickOutside);
            }
          };
          document.addEventListener('click', handleClickOutside);
        });
      }
    },  // Added comma here
  
    // Update the previewLetter method
    async previewLetter(letter) {
      try {
        // Format recipients to include both name and position
        const formattedRecipients = Array.isArray(letter.recipients) 
          ? letter.recipients.map(recipient => {
              // Handle string recipients (possibly JSON strings)
              if (typeof recipient === 'string') {
                try {
                  const parsed = JSON.parse(recipient);
                  return {
                    name: parsed.name || parsed,
                    position: parsed.position || ''
                  };
                } catch {
                  // If parsing fails, assume it's just a name
                  return { name: recipient, position: '' };
                }
              }
              // Handle object recipients
              return {
                name: recipient.name || '',
                position: recipient.position || ''
              };
            })
          : [];
    
        // Log the formatted data for debugging
        console.log('Formatted recipients:', formattedRecipients);
    
        const response = await apiClient.get(`/letters/${letter.id}/preview`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          },
          data: {
            recipients: formattedRecipients  // Send as data instead of params
          }
        });
    
        if (response.status === 200 && response.data) {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const blobUrl = window.URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
        } else {
          throw new Error('Failed to load PDF preview');
        }
      } catch (error) {
        console.error('Error previewing letter:', error);
        alert('Unable to preview the letter. The file might not be available or there was a server error.');
      }
    },
  
    async downloadLetter(letter) {
      try {
        const response = await apiClient.get(`/letters/${letter.id}/download`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          }
        });
    
        if (response.status === 200 && response.data) {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${letter.title || 'letter'}-${letter.id}.pdf`);
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
        } else {
          throw new Error('Failed to download file');
        }
      } catch (error) {
        console.error('Error downloading letter:', error);
        alert('Unable to download the letter. The file might not be available or there was a server error.');
      }
    },

    closePdfPreview() {
      this.showPdfPreview = false;
      if (this.currentPdfUrl) {
        URL.revokeObjectURL(this.currentPdfUrl);
        this.currentPdfUrl = null;
      }
    },
  }
};
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 4px;
  border: 2px solid #EDF2F7;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #A0AEC0;
}

.mb-6 {
  max-width: 100%;
}
</style>