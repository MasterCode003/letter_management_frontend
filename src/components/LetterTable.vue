<template>
<div class="p-6">
    <!-- Remove the Network Status Indicator -->
    
    <!-- Header and Add New Letter button -->
    <div class="flex justify-end items-center mb-6">
      <button 
        @click="handleNewLetterClick" 
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New
      </button>
    </div>
    <!-- Search and Filter Bar -->
    <div class="mb-6 bg-white rounded-lg shadow p-4">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Title Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title..."
            class="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <!-- Subject Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchSubject"
            type="text"
            placeholder="Search by subject..."
            class="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <!-- Recipient Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchRecipient"
            type="text"
            placeholder="Search by recipient..."
            class="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <!-- Type Filter -->
        <div class="w-[150px]">
          <select
            v-model="selectedType"
            class="w-full px-4 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="memo">Memo</option>
            <option value="business-letter">Business Letter</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="flex gap-2">
          <input
            type="date"
            v-model="dateRange.start"
            class="w-[160px] px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            v-model="dateRange.end"
            class="w-[160px] px-4 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>

    <!-- Table Section -->
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
            <template v-if="letters.length">
              <tr v-for="letter in paginatedLetters" :key="letter.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex space-x-3">
                    <button 
                      @click="openEditModal(letter)" 
                      class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-100/50 transition-colors group relative"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </span>
                    </button>
                    <button 
                      @click="previewLetter(letter)" 
                      class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-100/50 transition-colors group relative"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      </svg>
                      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Preview PDF
                      </span>
                    </button>
                    <button 
                      @click="downloadLetter(letter)"
                      class="p-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-100/50 transition-colors group relative"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Download PDF
                      </span>
                    </button>
                    <button 
                      @click="confirmDelete(letter.id)"
                      class="p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-100/50 transition-colors group relative"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ letter.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ letter.subject }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <template v-if="letter.recipients">
                      <span 
                        v-for="recipient in (typeof letter.recipients === 'string' ? 
                          JSON.parse(letter.recipients) : letter.recipients)" 
                        :key="recipient"
                        class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        {{ typeof recipient === 'object' ? recipient.name : recipient }}
                      </span>
                    </template>
                    <span v-else class="text-gray-500">No recipients</span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                No letters found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <div class="flex gap-1">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 border rounded-md',
              currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div class="text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
    </div>

    <!-- Update Letter Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"></div>
      <div class="flex items-center justify-center min-h-screen p-4 backdrop-blur-sm">
        <div class="relative bg-white rounded-lg shadow-xl w-[85%] h-[85vh] max-w-[1200px]">
          <!-- Fixed header -->
          <div class="absolute top-0 left-0 right-0 bg-white px-6 py-3 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900">Edit Letter</h2>
              
              <!-- Input field centered -->
              <div class="flex-1 flex justify-center mx-4">
                <div class="flex flex-col w-[500px]">
                  <div class="relative">
                    <input
                      v-model="currentLetter.title"
                      type="text"
                      required
                      placeholder="Enter letter title"
                      class="w-full border-b-2 border-gray-300 focus:border-green-500 px-4 py-2 text-lg font-medium outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="closeEditModal"
                  class="px-4 py-1.5 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  @click="handleUpdate"
                  class="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Update
                </button>
              </div>
            </div>
          </div>
          
          <!-- Scrollable content -->
          <div class="h-full overflow-y-auto pt-16 px-6 pb-6">
            <div class="bg-white rounded-lg shadow p-6">
              <form @submit.prevent="handleUpdate" class="space-y-6">
                <!-- Letter Type -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Type:</label>
                  <div class="flex flex-col">
                    <div class="relative">
                      <select
                        v-model="currentLetter.type"
                        required
                        class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                      >
                        <option value="">Select Type</option>
                        <option value="memo">Memo</option>
                        <option value="business-letter">Business Letter</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Subject -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Subject:</label>
                  <input
                    v-model="currentLetter.subject"
                    type="text"
                    required
                    class="flex-1 border rounded-md px-4 py-2"
                  />
                </div>

                <!-- Date -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Date:</label>
                  <input
                    v-model="currentLetter.date"
                    type="date"
                    required
                    class="w-[200px] border rounded-md px-4 py-2"
                  />
                </div>

                <!-- Replace the Recipients section in the edit modal -->
                <!-- Recipients -->
                <div class="space-y-4">
                  <!-- FOR heading with add button -->
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">FOR:</label>
                    <button
                      type="button"
                      @click="addNewRecipient"
                      class="border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100 text-base flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Recipient
                    </button>
                  </div>

                  <!-- Recipients list -->
                  <div v-for="(recipient, index) in currentLetter.recipients" :key="index" class="flex items-center gap-4 ml-24">
                    <div class="flex-1">
                      <div class="flex flex-col">
                        <select
                          v-model="recipient.id"
                          class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                          @change="updateRecipient(index, recipient.id)"
                        >
                          <option value="">Select Recipient</option>
                          <option 
                            v-for="r in recipients" 
                            :key="r.id" 
                            :value="r.id"
                          >
                            {{ r.name }} - {{ r.position }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <button
                      v-if="currentLetter.recipients.length > 1"
                      @click="removeRecipientAt(index)"
                      type="button"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex items-start gap-4">
                  <label class="font-medium w-24 text-lg pt-2">Content:</label>
                  <div class="flex-1">
                    <QuillEditor
                      v-model:content="currentLetter.content"
                      contentType="html"
                      theme="snow"
                      toolbar="full"
                      class="h-[300px]"
                    />
                  </div>
                </div>

                <!-- Sender Information -->
                <div class="grid grid-cols-2 gap-6">
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Name:</label>
                    <input
                      v-model="currentLetter.sender_name"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                    />
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Position:</label>
                    <input
                      v-model="currentLetter.sender_position"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Letter Form Modal -->
    <LetterForm
      v-if="showLetterForm"
      :letter="selectedLetter"
      @close="closeLetterForm"
      @save="handleLetterSaved"
    />
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-medium mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this letter? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirmModal = false"
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteLetter(confirmDeleteId)"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="showDeleteSuccess"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg"
    >
      Letter deleted successfully
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <!-- ... pagination content ... -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import axiosRetry from 'axios-retry';
import LetterForm from './LetterForm.vue';
import * as pdfjsLib from 'pdfjs-dist';

// Keep the apiClient configuration
const apiClient = axios.create({
  baseURL: 'http://192.168.8.36:8000/api',  // Update this line to match LetterForm.vue
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: false,
  proxy: false,
  maxRedirects: 5,
  keepAlive: true
});

// Configure retry mechanism with more attempts and longer delays
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 5000; // Wait 5s, 10s, 15s between retries
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.code === 'ECONNABORTED' ||
           error.response?.status >= 500;
  },
  shouldResetTimeout: true
});

// Add this line after your imports
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default {
  components: {
    LetterForm
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
    handleNewLetterClick() {
      this.selectedLetter = null;
      this.showLetterForm = true;
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
    },

    async previewLetter(letter) {
      try {
        const response = await apiClient.get(`/letters/${letter.id}/preview`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
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
    
