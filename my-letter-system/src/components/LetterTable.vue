<template>
  <div class="p-6">
    <!-- Network Status Indicator -->
    <div class="fixed bottom-4 right-4 p-3 rounded-lg" :class="networkStatus ? 'bg-green-500' : 'bg-red-500'">
      {{ networkStatus ? 'Connected' : 'Disconnected' }}
    </div>

    <!-- Header and Add New Letter button -->
    <div class="flex justify-end items-center mb-6">
      <button 
        @click="showLetterForm = true" 
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New
      </button>
    </div>

    <!-- Combined Search and Filter Bar -->
    <div class="mb-6 bg-white rounded-lg shadow px-4 py-4 w-full"> <!-- Changed max-w-full to w-full -->
      <div class="flex flex-wrap gap-1 md:flex-nowrap">
        <!-- Title Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title..."
              class="w-full border rounded-md pl-8 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Type Filter and Date Range -->
        <div class="flex items-center gap-4 flex-nowrap">
          <select v-model="selectedType" class="border rounded-md px-4 py-2 w-32 mr-2">
            <option value="">All Types</option>
            <option value="memo">Memo</option>
            <option value="business-letter">Business Letter</option>
          </select>
          <div class="flex gap-2">
            <input
              v-model="dateRange.start"
              type="date"
              class="border rounded-md px-3 py-2 w-40 min-w-[160px]"
            />
            <input
              v-model="dateRange.end"
              type="date"
              class="border rounded-md px-3 py-2 w-40 min-w-[160px]"
            />
          </div>
        </div>

        <!-- Subject Search -->
        <div class="w-full max-w-[250px] flex-grow min-w-[200px]"> <!-- Increased max-width and min-width -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H18a1 1 0 110 2h-3.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H2a1 1 0 110-2h3.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="searchSubject"
              type="text"
              placeholder="Search by subject..."
              class="w-full border rounded-md pl-8 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Recipient Search -->
        <div class="w-full max-w-[300px] flex-grow min-w-[200px]"> <!-- Adjusted max-width to 300px -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <input
              v-model="searchRecipient"
              type="text"
              placeholder="Search by recipient..."
              class="w-full border rounded-md pl-8 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
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
        <tbody class="divide-y divide-gray-200">
          <template v-if="filteredLetters.length">
            <tr v-for="letter in filteredLetters" :key="letter.id">
              <td class="px-6 py-4 whitespace-nowrap flex space-x-3">
                <button 
                  @click="openEditModal(letter)" 
                  class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-100/50 transition-colors group relative"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit
                  </span>
                </button>
                <button 
                  @click="confirmDelete(letter.id)" 
                  class="p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-100/50 transition-colors group relative"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Delete
                  </span>
                </button>
                <!-- Improved Preview Button with Eye Icon -->
                <button 
                  @click="previewLetter(letter)" 
                  class="p-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-100/50 transition-colors group relative"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  </svg>
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Preview
                  </span>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.letter_type }}</td>
              <td class="px-6 py-4">{{ letter.subject }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="recipient in letter.recipients" 
                    :key="recipient.id"
                    class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                  >
                    {{ recipient.name }}
                  </span>
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

      <!-- Pagination for Letters -->
      <div class="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200">
        <nav class="flex items-center space-x-1 mt-2">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="px-2 py-1 border rounded-md text-sm font-medium"
            :class="currentPage === 1 ? 'text-gray-300 cursor-default' : 'text-gray-700 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <template v-for="page in displayedPages" :key="page">
            <button
              @click="goToPage(page)"
              class="px-3 py-1 border rounded-md text-sm font-medium"
              :class="page === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-700 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </template>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-2 py-1 border rounded-md text-sm font-medium"
            :class="currentPage === totalPages ? 'text-gray-300 cursor-default' : 'text-gray-700 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div> <!-- Closing div for bg-white rounded-lg shadow overflow-hidden -->

    <!-- Edit Letter Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"></div>
      <div class="flex items-center justify-center min-h-screen p-4 backdrop-blur-sm">
        <div class="relative bg-white rounded-lg shadow-xl w-[85%] h-[85vh] max-w-[1200px]">
          <!-- Fixed header -->
          <div class="absolute top-0 right-0 bg-white px-6 py-3 border-b z-10 flex justify-end gap-3">
            <button
              type="button"
              @click="updateLetter(currentLetter)"
              class="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              Update
            </button>
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-1.5 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          <!-- Modal content -->
          <div class="h-full overflow-y-auto pt-16 px-6 pb-6">
            <letter-form 
              :editMode="true" 
              :letterData="currentLetter" 
              @update-letter="updateLetter"
              @close="showEditModal = false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
      <div class="flex items-center justify-center min-h-screen p-4 backdrop-blur-sm">
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Are you sure you want to delete this letter?</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteLetter(confirmDeleteId)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              @click="showDeleteConfirmModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Letter Form Modal -->
    <letter-form 
      v-if="showLetterForm" 
      @close="showLetterForm = false" 
      @save-letter="addLetter" 
      @update-letter="updateLetter"
      :letterData="currentLetter"
      :editMode="!!currentLetter"
    />

    <!-- Delete Success Message -->
    <div v-if="showDeleteSuccess" class="fixed inset-0 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Letter deleted successfully!</h3>
        </div>
      </div>
    </div>
  </div> <!-- Proper closing div for main container -->
</template>

<script>
import axios from 'axios';
import axiosRetry from 'axios-retry';
import LetterForm from './LetterForm.vue';

// Update the apiClient configuration
const apiClient = axios.create({
  baseURL: 'http://192.168.5.15:8000/api/letters',
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: false,
  // Add proxy configuration if needed
  proxy: false,
  // Add maximum retries
  maxRedirects: 5,
  // Add keepalive
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

export default {
  components: {
    LetterForm
  },
  data() {
    return {
      letters: [],
      recipients: [],
      showLetterForm: false,
      showEditModal: false,
      showDeleteConfirmModal: false,
      showDeleteSuccess: false,
      confirmDeleteId: null,
      currentLetter: null,
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
      networkStatus: false
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredLetters.length / this.perPage));
    },
    paginatedLetters() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredLetters.slice(start, end);
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
    filteredLetters() {
      return this.letters.filter(letter => {
        const matchesTitle = letter.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false;
        const matchesSubject = letter.subject?.toLowerCase().includes(this.searchSubject.toLowerCase()) ?? false;
        const matchesType = this.selectedType ? letter.type === this.selectedType : true;
        const matchesRecipient = this.searchRecipient ? 
          letter.recipients?.some(r => 
            r.name?.toLowerCase().includes(this.searchRecipient.toLowerCase())
          ) ?? false : true;
        
        const matchesDateRange = (!this.dateRange.start || new Date(letter.date) >= new Date(this.dateRange.start)) &&
                                 (!this.dateRange.end || new Date(letter.date) <= new Date(this.dateRange.end));
        
        return matchesTitle && matchesSubject && matchesType && matchesRecipient && matchesDateRange;
      }).sort((a, b) => {
        if (this.sortKey === 'date') {
          return new Date(a.date) - new Date(b.date);
        }
        return a[this.sortKey]?.localeCompare(b[this.sortKey]) ?? 0;
      });
    }
  },
  async mounted() {
    try {
      await this.fetchLetters();
      await this.fetchRecipients();
    } catch (error) {
      console.error('Error during component initialization:', error);
      // Removed alert dialog, only logging to console
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    openEditModal(letter) {
      this.currentLetter = { ...letter };
      this.showEditModal = true;
    },
    confirmDelete(letterId) {
      this.confirmDeleteId = letterId;
      this.showDeleteConfirmModal = true;
    },
    async checkNetwork() {
      try {
        await axios.get('http://192.168.5.15:8000', { timeout: 5000 });
        return true;
      } catch (error) {
        console.error('Network connection error:', error);
        return false;
      }
    },

    async fetchLetters() {
      if (!await this.checkNetwork()) {
        console.error('Network connection failed');
        return;
      }
      try {
        console.log('Fetching letters...');
        const response = await apiClient.get('/letters', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log('Letters response:', response);
        if (response?.data?.data) {
          this.letters = response.data.data;
        }
      } catch (error) {
        console.error('Full error object:', error);
        if (error.response) {
          console.error(`Server error (${error.response.status}):`, error.response.data);
        } else if (error.code === 'ECONNABORTED') {
          console.error('Request timed out - server might be down or wrong URL');
        } else if (!error.response) {
          console.error('Network error - check if API is running at correct address');
        }
        this.letters = [];
      }
    },

    async fetchRecipients() {
      try {
        console.log('Fetching recipients...');
        const response = await apiClient.get('/recipients', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log('Recipients response:', response);
        if (response?.data?.data) {
          this.recipients = response.data.data;
        }
      } catch (error) {
        console.error('Full error object:', error);
        if (error.response) {
          console.error(`Server error (${error.response.status}):`, error.response.data);
        } else if (error.code === 'ECONNABORTED') {
          console.error('Request timed out - server might be down or wrong URL');
        } else if (!error.response) {
          console.error('Network error - check if API is running at correct address');
        }
        this.recipients = [];
      }
    },
    formatRecipients(recipients) {
      return recipients.map(recipient => {
        if (typeof recipient === 'object') {
          return {
            name: recipient.name.replace(/[\[\]']+/g, ''),
            position: recipient.position
          };
        }
        return this.recipients.find(r => r.id === recipient)?.name || recipient;
      });
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    previewLetter(letter) {
      console.log('Preview letter:', letter);
    }
  }
};
</script>

<style scoped>
.mb-6 {
  max-width: 100%;
}
</style>
    
