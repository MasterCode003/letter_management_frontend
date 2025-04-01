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
            <!-- Update the header buttons section -->
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="handleBack"
                class="px-4 py-1.5 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
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
            <!-- Inside the form element, reorder the sections -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Letter Type -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Type:</label>
                <div class="flex flex-col">
                  <div class="relative">
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

              <!-- Subject field -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Subject:</label>
                <div class="flex flex-col flex-1">
                  <input
                    v-model="letterForm.subject"
                    :class="{'border-red-500': errors.subject}"
                    type="text"
                    required
                    class="border rounded-md px-4 py-2"
                  />
                  <span v-if="errors.subject" class="text-sm text-red-500 mt-1">{{ errors.subject }}</span>
                </div>
              </div>

              <!-- Date field -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Date:</label>
                <div class="flex flex-col">
                  <input
                    v-model="letterForm.date"
                    :class="{'border-red-500': errors.date}"
                    type="date"
                    required
                    class="w-[200px] border rounded-md px-4 py-2"
                  />
                  <span v-if="errors.date" class="text-sm text-red-500 mt-1">{{ errors.date }}</span>
                </div>
              </div>

              <!-- Content - Moved up -->
              <div class="flex items-start gap-4 mt-6">
                <label class="font-medium w-24 text-lg pt-2">Content:</label>
                <div class="flex-1">
                  <QuillEditor
                    v-model:content="letterForm.content"
                    contentType="html"
                    theme="snow"
                    toolbar="full"
                    class="h-[300px]"
                    :class="{'border-red-500': errors.content}"
                  />
                  <span v-if="errors.content" class="text-sm text-red-500 mt-1">{{ errors.content }}</span>
                </div>
              </div>

              <!-- Sender Information - Moved to bottom -->
              <div class="mt-8 pt-6 border-t">
                <h3 class="font-medium text-lg mb-4">Sender's Information:</h3>
                <div class="grid grid-cols-2 gap-6">
                  <div class="flex flex-col space-y-2">
                    <label class="text-base font-medium">Name</label>
                    <input
                      type="text"
                      v-model="letterForm.sender_name"
                      :class="{'border-red-500': errors.sender_name}"
                      placeholder="Enter sender's name"
                      class="w-full border rounded-md px-4 py-2"
                    />
                    <span v-if="errors.sender_name" class="text-sm text-red-500">{{ errors.sender_name }}</span>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <label class="text-base font-medium">Position/Title</label>
                    <input
                      type="text"
                      v-model="letterForm.sender_position"
                      :class="{'border-red-500': errors.sender_position}"
                      placeholder="Enter sender's position"
                      class="w-full border rounded-md px-4 py-2"
                    />
                    <span v-if="errors.sender_position" class="text-sm text-red-500">{{ errors.sender_position }}</span>
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
            <!-- In the template section, update the cancel button -->
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-1.5 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { nextTick } from 'vue'

const apiClient = axios.create({
  baseURL: 'http://192.168.8.36:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 15000
});

export default {
  name: 'LetterForm',
  components: {
    QuillEditor
  },
  emits: [
    'close',
    'save',
    'save-letter',
    'update-letter',
    'refresh-letters'
  ],
  props: {
    letter: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
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
      showSuccess: false,
      recipientsList: [],
      editMode: false,
      isSubmitting: false
    }
  },
  created() {
    if (this.letter && Object.keys(this.letter).length > 0) {
      this.editMode = true;
      this.letterForm = {
        ...this.letter,
        date: this.formatDateForInput(this.letter.date),
        recipients: Array.isArray(this.letter.recipients) 
          ? this.letter.recipients 
          : [this.letter.recipients]
      };
    }
    this.fetchRecipients();
  },
  methods: {
    closeModal() {
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
        const response = await apiClient.get('/recipients', {
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        });
        
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            this.recipientsList = response.data;
          } else if (response.data && Array.isArray(response.data.data)) {
            this.recipientsList = response.data.data;
          }
        } else {
          console.error('Server returned status:', response.status);
          this.recipientsList = [];
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipientsList = [];
        alert('Unable to fetch recipients. Please check your connection and try again.');
      }
    },

    async handleSubmit() {
      try {
        // Validate form data
        const errors = this.validateForm();
        if (Object.keys(errors).length > 0) {
          this.errors = errors;
          return;
        }

        // Show confirmation modal instead of directly emitting
        this.showConfirmModal = true;
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },

    validateForm() {
      const errors = {};
      if (!this.letterForm.title) {
        errors.title = 'Title is required';
      }
      if (!this.letterForm.type) {
        errors.type = 'Type is required';
      }
      // Add other validations as needed
      return errors;
    },

    updateRecipient(index, recipient) {
      try {
        // Handle string input (name only)
        if (typeof recipient === 'string') {
          this.letterForm.recipients[index] = {
            id: '',
            name: recipient,
            position: ''
          };
          return;
        }

        // Handle array input (first item)
        if (Array.isArray(recipient)) {
          const [firstRecipient] = recipient;
          this.letterForm.recipients[index] = {
            id: firstRecipient?.id || '',
            name: firstRecipient?.name || firstRecipient || '',
            position: firstRecipient?.position || ''
          };
          return;
        }

        // Handle object input
        if (typeof recipient === 'object' && recipient !== null) {
          this.letterForm.recipients[index] = {
            id: recipient.id || '',
            name: recipient.name || '',
            position: recipient.position || ''
          };
          return;
        }

        // Handle invalid input
        this.letterForm.recipients[index] = { id: '', name: '', position: '' };
      } catch (error) {
        console.error('Error updating recipient:', error);
        this.letterForm.recipients[index] = { id: '', name: '', position: '' };
      }
    },

    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    handleBack() {
      const hasUnsavedChanges = this.checkUnsavedChanges();
      
      if (hasUnsavedChanges) {
        if (confirm('You have unsaved changes. Are you sure you want to go back?')) {
          this.$emit('close');
          this.$router.push('/letters');
        }
      } else {
        this.$emit('close');
        this.$router.push('/letters');
      }
    },

    checkUnsavedChanges() {
      const initialForm = this.letter || {
        title: '',
        type: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [{ id: '', name: '', position: '' }],
        content: '',
        sender_name: '',
        sender_position: ''
      };

      return JSON.stringify(this.letterForm) !== JSON.stringify(initialForm);
    }
  }
}

// Remove the second export default completely
</script>

<style>
.prose {
  width: 100%;
}
.editor-toolbar button {
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
}
.editor-toolbar button.is-active {
  background-color: #e5e7eb;
}
.ck-editor__editable {
  min-height: 400px;
  max-height: 600px;
}
.ck.ck-editor {
  width: 100%;
}
.ck.ck-editor__main > .ck-editor__editable {
  background-color: white;
}
/* Update QuillEditor styles */
.quill-editor {
  height: 400px !important;
  margin-bottom: 20px;
}

.ql-container {
  height: auto !important;
  min-height: 350px;
}

.ql-editor {
  height: 350px !important;
  overflow-y: auto !important;
}

.ql-container {
  position: relative !important;
  height: auto !important;
}
.ql-toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

/* Remove the deprecated styles */
.ql-container {
  position: static !important;
}
</style>
