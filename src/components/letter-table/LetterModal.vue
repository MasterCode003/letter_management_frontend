@ -1,418 +0,0 @@
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Header with gradient -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">{{ editMode ? 'Edit Letter' : 'New Letter' }}</h2>
              
              <!-- Title input centered with white background -->
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[600px] bg-white rounded-lg shadow-sm">
                  <input
                    v-model="letterForm.title"
                    :class="{'border-red-500': errors.title}"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                  />
                </div>
              </div>
              
              <!-- Action buttons with updated styling -->
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  @click="handleBack"
                  class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ editMode ? 'Update' : 'Save' }}
                </button>
                <button
                  type="button"
                  @click="handleQuickSave"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save as Template
                </button>
              </div>
            </div>
          </div>

          <!-- Content with updated styling -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <form @submit.prevent="handleSubmit" class="space-y-8">
                <!-- Letter Type -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Type:</label>
                  <div class="flex flex-col">
                    <div class="relative">
                      <select
                        v-model="letterForm.type"
                        required
                        class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                      >
                        <option value="Memo">Memo</option>
                        <option value="Business Letter">Business Letter</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
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
                      <!-- Update the recipient select element -->
                      <select
                        v-model="recipient.id"
                        @change="updateRecipient(index, $event.target.value)"
                        class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                        :class="{ 'border-red-500': errors.recipients }"
                      >
                        <option value="">Select Recipient</option>
                        <option v-for="r in recipientsList" :key="r.id" :value="r.id">
                          {{ r.name }} - {{ r.position }}
                        </option>
                      </select>
                      <!-- Display selected recipient info -->
                      <div v-if="recipient.name && recipient.position" class="mt-1 text-sm text-gray-600">
                        Selected: {{ recipient.name }} - {{ recipient.position }}
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

                <!-- Subject field -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Subject:</label>
                  <div class="flex flex-col flex-1">
                    <input
                      v-model="letterForm.subject"
                      type="text"
                      required
                      class="border rounded-md px-4 py-2"
                      :class="{ 'border-red-500': errors.subject }"
                    />
                  </div>
                </div>

                <!-- Date field -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Date:</label>
                  <div class="flex flex-col">
                    <input
                      v-model="letterForm.date"
                      type="date"
                      required
                      class="w-[200px] border rounded-md px-4 py-2"
                      :class="{ 'border-red-500': errors.date }"
                    />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex items-start gap-4 mt-6">
                  <label class="font-medium w-24 text-lg pt-2">Content:</label>
                  <div class="flex-1">
                    <QuillEditor
                      v-model:content="letterForm.content"
                      contentType="html"
                      :options="editorOptions"
                      class="h-[300px]"
                      :class="{ 'border-red-500': errors.content }"
                    />
                  </div>
                </div>

                <!-- Sender Information -->
                <div class="mt-8 pt-6 border-t">
                  <h3 class="font-medium text-lg mb-4">Sender's Information:</h3>
                  <div class="grid grid-cols-2 gap-6">
                    <div class="flex flex-col space-y-2">
                      <label class="text-base font-medium">Name</label>
                      <input
                        type="text"
                        v-model="letterForm.sender_name"
                        placeholder="Enter sender's name"
                        class="w-full border rounded-md px-4 py-2"
                        :class="{ 'border-red-500': errors.sender_name }"
                      />
                    </div>
                    <div class="flex flex-col space-y-2">
                      <label class="text-base font-medium">Position/Title</label>
                      <input
                        type="text"
                        v-model="letterForm.sender_position"
                        placeholder="Enter sender's position"
                        class="w-full border rounded-md px-4 py-2"
                        :class="{ 'border-red-500': errors.sender_position }"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Add this right before the closing </template> tag -->
  <!-- Success Message Modal -->
  <SuccessMessageModal 
    v-if="showSuccess"
    @close="closeModal"
  />

  <!-- Confirmation Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
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
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ editMode ? 'Update' : 'Save' }}
          </button>
          <button
            type="button"
            @click="showConfirmModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LetterHeader from './LetterHeader.vue';
// Change this line:
import apiClient from '@/utils/apiClient'; // Using default import instead of named import

import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import SuccessMessageModal from './modals/SuccessMessageModal.vue';

export default {
  name: 'LetterModal',
  components: {
    QuillEditor,
    SuccessMessageModal,
    LetterHeader
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    letter: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'save-letter', 'update-letter', 'refresh-letters'],
  data() {
    const defaultForm = {
      title: '',
      type: '',
      subject: '',
      date: new Date().toISOString().split('T')[0],
      recipients: [{ id: '', name: '', position: '' }],
      content: '',
      sender_name: '',
      sender_position: ''
    };

    return {
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        },
        placeholder: 'Compose your letter...',
        theme: 'snow'
      },
      letterForm: this.letter ? {
        title: this.letter.title || '',
        type: this.letter.type || '',
        subject: this.letter.subject || '',
        date: this.letter.date ? this.formatDateForInput(this.letter.date) : defaultForm.date,
        recipients: this.letter.recipients ? 
          (Array.isArray(this.letter.recipients) ? 
            this.letter.recipients.map(r => ({
              id: r.id || r || '',
              name: r.name || '',
              position: r.position || ''
            })) : 
            [{ 
              id: this.letter.recipients?.id || this.letter.recipients || '',
              name: this.letter.recipients?.name || '',
              position: this.letter.recipients?.position || ''
            }]
          ) : defaultForm.recipients,
        content: this.letter.content || '',
        sender_name: this.letter.sender_name || '',
        sender_position: this.letter.sender_position || ''
      } : { ...defaultForm },
      errors: {},
      showConfirmModal: false,
      showSuccess: false,  // Keep this for controlling visibility
      recipientsList: [],
      isSubmitting: false
    }
  },
  computed: {
    filteredRecipientsList() {
      // Get all currently selected recipient IDs
      const selectedIds = this.letterForm.recipients
        .filter(r => r.id)
        .map(r => r.id);
      
      // Filter out recipients that are already selected
      return this.recipientsList.filter(recipient => 
        !selectedIds.includes(recipient.id)
      );
    }
  },
  async created() {
    try {
      await this.fetchCSRFToken();
      
      if (this.letter && Object.keys(this.letter).length > 0) {
        this.editMode = true;
        const formattedRecipients = Array.isArray(this.letter.recipients) 
          ? this.letter.recipients.map(r => {
              // Handle both object and ID formats
              if (typeof r === 'object') {
                return {
                  id: r.id || '',
                  name: r.name || '',
                  position: r.position || ''
                };
              } else {
                // If it's just an ID, we'll populate name/position after fetching recipients
                return {
                  id: r,
                  name: '',
                  position: ''
                };
              }
            })
          : [{
              id: this.letter.recipients?.id || this.letter.recipients || '',
              name: this.letter.recipients?.name || '',
              position: this.letter.recipients?.position || ''
            }];
        
        this.letterForm = {
          ...this.letter,
          date: this.formatDateForInput(this.letter.date),
          recipients: formattedRecipients
        };
      }
      this.fetchRecipients();
    } catch (error) {
      console.error('Component initialization error:', error);
      this.closeModal();
    }
  },  // <-- Add this comma
  methods: {
    async fetchCSRFToken() {
      try {
        const response = await apiClient.get('/sanctum/csrf-cookie', {
          baseURL: 'http://192.168.5.34:8000' // Updated IP address
        });
        
        if (!response) {
          throw new Error('No response from server');
        }
        return response;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        // Provide more helpful error message
        const errorMsg = error.response?.status === 404 
          ? 'CSRF endpoint not found. Check your API configuration.'
          : error.message || 'Failed to fetch CSRF token';
        throw new Error(errorMsg);
      }
    },

    async created() {
      try {
        await this.fetchCSRFToken();
        
        if (this.letter && Object.keys(this.letter).length > 0) {
          this.editMode = true;
          const formattedRecipients = Array.isArray(this.letter.recipients) 
            ? this.letter.recipients.map(r => {
                // Handle both object and ID formats
                if (typeof r === 'object') {
                  return {
                    id: r.id || '',
                    name: r.name || '',
                    position: r.position || ''
                  };
                } else {
                  // If it's just an ID, we'll populate name/position after fetching recipients
                  return {
                    id: r,
                    name: '',
                    position: ''
                  };
                }
              })
            : [{
                id: this.letter.recipients?.id || this.letter.recipients || '',
                name: this.letter.recipients?.name || '',
                position: this.letter.recipients?.position || ''
              }];
          
          this.letterForm = {
            ...this.letter,
            date: this.formatDateForInput(this.letter.date),
            recipients: formattedRecipients
          };
        }
        this.fetchRecipients();
      } catch (error) {
        console.error('Component initialization error:', error);
        this.$emit('error', error.message); // Emit error event
        this.closeModal();
      }
    },  // Add comma here
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    closeModal() {
      this.errors = {};
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
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
        // Ensure consistent data structure
        this.recipientsList = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipientsList = [];
      }
    },
    updateRecipient(index, recipientId) {
      if (!recipientId) {
        this.letterForm.recipients[index] = { id: '', name: '', position: '' };
        return;
      }
      
      const selectedRecipient = this.recipientsList.find(r => 
        r.id === parseInt(recipientId)
      );
      
      if (selectedRecipient) {
        // Replace this.$set with direct assignment and array copy
        this.letterForm.recipients = [
          ...this.letterForm.recipients.slice(0, index),
          {
            id: selectedRecipient.id,
            name: selectedRecipient.name,
            position: selectedRecipient.position
          },
          ...this.letterForm.recipients.slice(index + 1)
        ];
      }
    },  // Add comma here
    handleBack() {
      // Reset form and close modal
      this.errors = {};
      this.letterForm = {
        title: '',
        type: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [{ id: '', name: '', position: '' }],
        content: '',
        sender_name: '',
        sender_position: ''
      };
      this.closeModal();
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      // Validate title
      if (!this.letterForm.title?.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }

      // Validate type
      if (!this.letterForm.type?.trim()) {
        this.errors.type = 'Type is required';
        isValid = false;
      }

      // Validate subject
      if (!this.letterForm.subject?.trim()) {
        this.errors.subject = 'Subject is required';
        isValid = false;
      }

      // Validate date
      if (!this.letterForm.date) {
        this.errors.date = 'Date is required';
        isValid = false;
      }

      // Validate content
      if (!this.letterForm.content?.trim()) {
        this.errors.content = 'Content is required';
        isValid = false;
      }

      // Validate sender info
      if (!this.letterForm.sender_name?.trim()) {
        this.errors.sender_name = 'Sender name is required';
        isValid = false;
      }

      if (!this.letterForm.sender_position?.trim()) {
        this.errors.sender_position = 'Sender position is required';
        isValid = false;
      }

      // Validate recipients
      const hasEmptyRecipients = this.letterForm.recipients.some(r => !r.id);
      if (hasEmptyRecipients) {
        this.errors.recipients = 'All recipients must be selected';
        isValid = false;
      }

      return isValid;
    },

    handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      // Show confirmation modal instead of direct submission
      this.showConfirmModal = true;
    },

    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        this.showConfirmModal = false; // Hide confirmation modal
        
        // Prepare the data with full recipient objects
        const formData = {
          title: this.letterForm.title,
          type: this.letterForm.type,
          subject: this.letterForm.subject,
          date: this.letterForm.date,
          content: this.letterForm.content,
          sender_name: this.letterForm.sender_name,
          sender_position: this.letterForm.sender_position,
          recipients: this.letterForm.recipients
            .filter(r => r.id)
            .map(r => ({
              id: r.id,
              name: r.name,
              position: r.position
            }))
        };
    
        let response;
        if (this.editMode) {
          response = await apiClient.put(`/letters/${this.letter.id}`, formData);
        } else {
          response = await apiClient.post('/letters', formData);
        }
    
        this.$emit('refresh-letters');
        this.showSuccess = true;
        setTimeout(() => {
          this.closeModal();
        }, 1500);
        
      } catch (error) {
        console.error('Error submitting letter:', error);
        this.errors = error.response?.data?.errors || {};
        this.errors.submit = error.response?.data?.message || 'Failed to save letter';
      } finally {
        this.isSubmitting = false;
      }
    },  // <-- Add this comma
    
    async handleQuickSave() {
      if (!this.validateForm()) {
        return;
      }
      
      try {
        this.isSubmitting = true;
        const formData = {
          title: this.letterForm.title,
          type: this.letterForm.type,
          subject: this.letterForm.subject,
          date: this.letterForm.date,
          content: this.letterForm.content,
          sender_name: this.letterForm.sender_name,
          sender_position: this.letterForm.sender_position,
          recipients: this.letterForm.recipients
            .filter(r => r.id)
            .map(r => ({
              id: r.id,
              name: r.name,
              position: r.position
            }))
        };

        const response = await apiClient.post('/letters', formData);
        this.$emit('refresh-letters');
        this.showSuccess = true;
      } catch (error) {
        console.error('Quick save error:', error);
        this.errors.submit = error.response?.data?.message || 'Quick save failed';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style>
.prose {
  width: 100%;
}

/* Add these styles for better Quill editor formatting */
.ql-editor {
  font-size: 1rem;
  line-height: 1.6;
}

.ql-editor p {
  margin-bottom: 1em;
}

.ql-editor strong {
  font-weight: 700;
}

.ql-editor h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
}

.ql-editor h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

.ql-snow .ql-editor pre {
  white-space: pre-wrap;
}
</style>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
