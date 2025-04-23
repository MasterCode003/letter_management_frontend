@ -1,603 +0,0 @@
@ -1,418 +0,0 @@
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Add modal overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Add modal content -->
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <!-- Modal Header -->
          <LetterHeader 
            :edit-mode="editMode"
            :title="letterForm.title"
            :is-submitting="isSubmitting"
            @back="handleBack"
            @submit="handleSubmit"
            @quick-save="handleQuickSave"
          />

          <!-- Modal Body -->
          <div class="p-6">
            <!-- Form Content -->
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  v-model="letterForm.title"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  :class="{ 'border-red-500': errors.title }"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <input 
                  v-model="letterForm.type"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  :class="{ 'border-red-500': errors.type }"
                />
                <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Subject</label>
                <input 
                  v-model="letterForm.subject"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  :class="{ 'border-red-500': errors.subject }"
                />
                <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input 
                  v-model="letterForm.date"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  :class="{ 'border-red-500': errors.date }"
                />
                <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
              </div>

              <!-- Recipients -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Recipients</label>
                <div v-for="(recipient, index) in letterForm.recipients" :key="index" class="flex gap-2 mt-2">
                  <select 
                    v-model="recipient.id"
                    @change="updateRecipient(index, $event.target.value)"
                    class="block w-full rounded-md border-gray-300 shadow-sm"
                    :class="{ 'border-red-500': errors.recipients }"
                  >
                    <option value="">Select a recipient</option>
                    <option v-for="r in filteredRecipientsList" :key="r.id" :value="r.id">
                      {{ r.name }} - {{ r.position }}
                    </option>
                  </select>
                  <button 
                    @click="removeRecipient(index)"
                    class="px-2 py-1 text-red-600 hover:text-red-800"
                    :disabled="letterForm.recipients.length === 1"
                  >
                    Remove
                  </button>
                </div>
                <button 
                  @click="addRecipient"
                  class="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Add Recipient
                </button>
                <p v-if="errors.recipients" class="mt-1 text-sm text-red-600">{{ errors.recipients }}</p>
              </div>

              <!-- Content -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Content</label>
                <QuillEditor
                  v-model:content="letterForm.content"
                  :options="editorOptions"
                  contentType="html"
                  class="h-64 mt-1"
                  :class="{ 'border-red-500': errors.content }"
                />
                <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
              </div>

              <!-- Sender Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Sender Name</label>
                  <input 
                    v-model="letterForm.sender_name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    :class="{ 'border-red-500': errors.sender_name }"
                  />
                  <p v-if="errors.sender_name" class="mt-1 text-sm text-red-600">{{ errors.sender_name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Sender Position</label>
                  <input 
                    v-model="letterForm.sender_position"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    :class="{ 'border-red-500': errors.sender_position }"
                  />
                  <p v-if="errors.sender_position" class="mt-1 text-sm text-red-600">{{ errors.sender_position }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Success Message Modal -->
  <SuccessMessageModal 
    v-if="showSuccess"
    @close="closeModal"
  />
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
      letterForm: {
        title: '',
        type: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [{ id: '', name: '', position: '' }],
        content: '',
        sender_name: '',
        sender_position: ''
      },
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
          baseURL: 'http://192.168.5.68:8000' // Add explicit base URL
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

    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        
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
            .filter(r => r.id) // Only include recipients with IDs
            .map(r => ({
              id: r.id,
              name: r.name, // Include name
              position: r.position // Include position
            }))
        };
    
        // Debug log
        console.log('Submitting:', formData);
    
        let response;
        if (this.editMode) {
          response = await apiClient.put(`/letters/${this.letter.id}`, formData);
        } else {
          response = await apiClient.post('/letters', formData);
        }
    
        console.log('Response:', response.data);
        this.$emit('refresh-letters');
        this.showSuccess = true;
        
      } catch (error) {
        console.error('Error submitting letter:', error);
        this.errors = error.response?.data?.errors || {};
        this.errors.submit = error.response?.data?.message || 'Failed to save letter';
      } finally {
        this.isSubmitting = false;
      }
    },  // <-- Add this comma
    
    handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.confirmSubmit();
    },

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

