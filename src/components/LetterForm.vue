<template>
  <div class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"></div>
    <div class="flex items-center justify-center min-h-screen p-4 backdrop-blur-sm">
      <div class="relative bg-white rounded-lg shadow-xl w-[85%] h-[85vh] max-w-[1200px]">
        <!-- Fixed header -->
        <div class="absolute top-0 left-0 right-0 bg-white px-6 py-3 border-b z-10">
          <div class="flex items-center justify-between">
            <!-- Title on left -->
            <h2 class="text-xl font-bold text-gray-900">{{ editMode ? 'Edit Letter' : 'Create New Letter' }}</h2>
            
            <!-- Input field centered - Modified to be editable -->
            <div class="flex-1 flex justify-center mx-4">
              <div class="flex flex-col w-[500px]">
                <div class="relative">
                  <input
                    v-model="letterForm.title"
                    :class="{'border-red-500': errors.title}"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full border-b-2 border-gray-300 focus:border-green-500 px-4 py-2 text-lg font-medium outline-none bg-transparent"
                  />
                  <span v-if="errors.title" class="absolute -bottom-6 left-0 text-sm text-red-500">{{ errors.title }}</span>
                </div>
              </div>
            </div>

            <!-- Buttons on right -->
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-1.5 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                @click="handleSubmit"
                class="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ editMode ? 'Update' : 'Save' }} 
              </button>
            </div>
          </div>
        </div>

        <!-- Scrollable content -->
        <div class="h-full overflow-y-auto pt-16 px-6 pb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Letter Type -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Type:</label>
                <div class="flex flex-col">
                  <div class="relative">
                    <!-- Update the letter type select options -->
                    <select
                      v-model="letterForm.type"
                      :class="{'border-red-500': errors.type}"
                      required
                      class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                    >
                      <option value="">Select Type</option>
                      <option value="Memo">Memo</option>
                      <option value="Business Letter">Business Letter</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <span v-if="errors.type" class="text-sm text-red-500 mt-1">{{ errors.type }}</span>
                </div>
              </div>

              <!-- Recipients Section -->
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">FOR:</label>
                  <button
                    type="button"
                    @click="addRecipient"
                    class="border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100 text-base flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Recipient
                  </button>
                </div>

                <div v-for="(recipient, index) in letterForm.recipients" :key="index" class="flex items-center gap-4 ml-24">
                  <div class="flex-1">
                    <div class="flex flex-col">
                      <select
                        v-model="recipient.id"
                        :class="{'border-red-500': errors.recipients}"
                        class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                        @change="updateRecipient(index, recipient.id)"
                      >
                        <option value="">Select Recipient</option>
                        <option 
                          v-for="r in recipientsList" 
                          :key="r.id" 
                          :value="r.id"
                        >
                          {{ r.name }} - {{ r.position }}
                        </option>
                      </select>
                      <span v-if="errors.recipients && index === 0" class="text-sm text-red-500 mt-1">{{ errors.recipients }}</span>
                    </div>
                  </div>
                  <button
                    v-if="letterForm.recipients.length > 1"
                    @click="removeRecipient(index)"
                    type="button"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Subject -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Subject:</label>
                <input
                  v-model="letterForm.subject"
                  :class="{'border-red-500': errors.subject}"
                  type="text"
                  required
                  placeholder="Title of the Letter"
                  class="w-[500px] border rounded-md px-4 py-2 text-base"
                />
                <span v-if="errors.subject" class="text-sm text-red-500 mt-1">{{ errors.subject }}</span>
              </div>

              <!-- Date -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Date:</label>
                <input
                  type="date"
                  v-model="letterForm.date"
                  :class="{'border-red-500': errors.date}"
                  class="w-[500px] border rounded-md px-4 py-2 text-base"
                />
                <span v-if="errors.date" class="text-sm text-red-500 mt-1">{{ errors.date }}</span>
              </div>

              <!-- Content Section -->
              <div class="space-y-2">
                <label class="font-medium block text-lg">Content:</label>
                <div class="relative h-[400px] border rounded-md">
                  <md-editor 
                    v-model="letterForm.content"
                    :class="{'border-red-500': errors.content}"
                    height="400px"
                    language="en-US"
                    :toolbars="[
                      'bold', 'underline', 'italic', 'strikethrough',
                      '-',
                      'title', 'quote', 'unorderedList', 'orderedList',
                      '-',
                      'link', 'image', 'table',
                      '-',
                      'preview', 'fullscreen'
                    ]"
                  />
                </div>
                <span v-if="errors.content" class="text-sm text-red-500">{{ errors.content }}</span>
              </div>

              <!-- Sender's Information Section -->
              <div class="mt-8">
                <h3 class="font-medium text-lg mb-4 border-b pb-2">Sender's Information:</h3>
                <div class="flex gap-6">
                  <div class="flex-1 space-y-2">
                    <label class="text-base font-medium">Name</label>
                    <input
                      type="text"
                      v-model="letterForm.sender.name"
                      :class="{'border-red-500': errors.senderName}"
                      class="w-full border rounded-md px-4 py-2"
                    />
                    <span v-if="errors.senderName" class="text-sm text-red-500">{{ errors.senderName }}</span>
                  </div>
                  <div class="flex-1 space-y-2">
                    <label class="text-base font-medium">Position/Title</label>
                    <input
                      type="text"
                      v-model="letterForm.sender.position"
                      :class="{'border-red-500': errors.senderPosition}"
                      class="w-full border rounded-md px-4 py-2"
                    />
                    <span v-if="errors.senderPosition" class="text-sm text-red-500">{{ errors.senderPosition }}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Save/Update Confirmation Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Confirm {{ editMode ? 'Update' : 'Save' }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to {{ editMode ? 'update' : 'save' }} this letter?
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="confirmSubmit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ editMode ? 'Update' : 'Save' }}
          </button>
          <button
            type="button"
            @click="showConfirmModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Success Message -->
  <div v-if="showSuccess" class="fixed inset-0 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 shadow-xl">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">{{ editMode ? 'Letter updated successfully!' : 'Letter saved successfully!' }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

// Update the apiClient configuration
const apiClient = axios.create({
  baseURL: 'http://192.168.5.95:8000/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false  // Change to false
});

export default {
  name: 'LetterForm',
  props: {
    letterData: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save-letter', 'close', 'refresh-letters'],
  recipients: {
    type: Array,
    default: () => []
  },
  
  // Add showConfirmModal to data
  data() {
    return {
      formData: {
        title: '',
        subject: '',
        type: '',
        date: '',
        recipients: [],
        content: ''
      },
      showConfirmModal: false, // Add this line
      localRecipients: [],
      letterForm: {
        id: this.editMode && this.letterData ? this.letterData.id : Date.now().toString(),
        title: this.editMode && this.letterData ? this.letterData.title : '',
        type: this.editMode && this.letterData ? this.letterData.type : '',
        subject: this.editMode && this.letterData ? this.letterData.subject : '',
        content: this.editMode && this.letterData ? this.letterData.content : '',
        recipients: this.editMode && this.letterData && this.letterData.recipients ? 
          this.letterData.recipients : 
          [{ id: '', name: '', position: '' }],
        date: this.editMode && this.letterData ? this.letterData.date : new Date().toISOString().split('T')[0],
        sender: {
          name: this.editMode && this.letterData ? this.letterData.sender?.name || '' : '',
          position: this.editMode && this.letterData ? this.letterData.sender?.position || '' : ''
        }
      },
      errors: {  // Add this errors object
        title: '',
        type: '',
        subject: '',
        content: '',
        date: '',
        recipients: '',
        senderName: '',
        senderPosition: ''
      },
      showSuccess: false,
      showUpdateFormModal: false,
      recipientForm: {
        id: '',
        name: '',
        position: ''
      },
      recipientsList: [], // We'll use only this for recipients
      // Remove localRecipients as we don't need it
    };
  },

  computed: {
    availableRecipients() {
      return (currentIndex) => {
        const selectedIds = this.letterForm.recipients
          .map((r, i) => i !== currentIndex ? r.id : null)
          .filter(id => id);
        return this.recipientsList.filter(r => !selectedIds.includes(r.id));
      };
    }
  },

  methods: {
    addRecipient() {
      this.letterForm.recipients.push({ 
        id: '', 
        name: '', 
        position: '' 
      });
    },

    removeRecipient(index) {
      if (this.letterForm.recipients.length > 1) {
        this.letterForm.recipients.splice(index, 1);
      }
    },

    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        if (Array.isArray(response.data)) {
          this.recipientsList = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          this.recipientsList = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipientsList = [];
      }
    },

    updateRecipient(index, recipientId) {
      const selectedRecipient = this.recipientsList.find(r => r.id === recipientId);
      if (selectedRecipient) {
        const newRecipient = {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        };
        
        const isDuplicate = this.letterForm.recipients.some((r, i) => 
          i !== index && r.id === recipientId
        );

        if (!isDuplicate) {
          this.letterForm.recipients.splice(index, 1, newRecipient);
        } else {
          this.letterForm.recipients[index] = { id: '', name: '', position: '' };
          alert('This recipient has already been selected');
        }
      }
    },  // Add comma here

    handleSubmit() {
      // Reset previous errors
      Object.keys(this.errors).forEach(key => this.errors[key] = '');
      
      // Validate form
      let isValid = true;
      
      if (!this.letterForm.title.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }
      
      if (!this.letterForm.type) {
        this.errors.type = 'Type is required';
        isValid = false;
      }
      
      if (!this.letterForm.subject.trim()) {
        this.errors.subject = 'Subject is required';
        isValid = false;
      }
      
      if (!this.letterForm.content.trim()) {
        this.errors.content = 'Content is required';
        isValid = false;
      }
      
      if (!this.letterForm.date) {
        this.errors.date = 'Date is required';
        isValid = false;
      }
      
      if (!this.letterForm.recipients[0].id) {
        this.errors.recipients = 'At least one recipient is required';
        isValid = false;
      }

      if (!this.letterForm.sender.name.trim()) {
        this.errors.senderName = 'Sender name is required';
        isValid = false;
      }

      if (!this.letterForm.sender.position.trim()) {
        this.errors.senderPosition = 'Sender position is required';
        isValid = false;
      }

      if (isValid) {
        this.showConfirmModal = true;
      }
    },  // Add comma here

    async confirmSubmit() {
      try {
        const letterData = {
          ...(this.editMode ? { id: this.letterForm.id } : {}),
          title: this.letterForm.title,
          type: this.letterForm.type,  // Changed from letter_type to type
          subject: this.letterForm.subject,
          content: this.letterForm.content,
          date: this.letterForm.date,
          recipients: this.letterForm.recipients.filter(r => r.id),
          sender_name: this.letterForm.sender.name,      // Changed from sender.name
          sender_position: this.letterForm.sender.position  // Changed from sender.position
        };

        if (this.editMode) {
          const response = await this.$emit('update-letter', letterData);
          console.log('Updated letter:', response);
        } else {
          const response = await this.$emit('save-letter', letterData);
          console.log('Saved letter:', response);
        }

        this.showConfirmModal = false;
        this.showSuccess = true;
        
        // Emit a refresh event to update the table
        this.$emit('refresh-letters');
        
        setTimeout(() => {
          this.showSuccess = false;
          this.$emit('close');
        }, 2000);
      } catch (error) {
        console.error('Error saving letter:', error);
        alert('An error occurred while saving the letter. Please try again.');
      }
    }
  },  // Close methods object with comma

  mounted() {
    this.fetchRecipients();
  },

  emits: ['save-letter', 'update-letter', 'close']
};
</script>

<!-- Remove the separate script setup section at the bottom -->
