
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Header with gradient -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">New Letter</h2>
              
              <!-- Title input centered with white background -->
              <!-- Change this in the title input -->
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <!-- Keep the input with letter.title -->
                  <input
                    v-model="letterForm.title"
                    :class="{'border-red-500': errors.title}"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                    @input="clearError('title')"
                  />
                  <ValidationWarning v-if="errors.title" :message="errors.title" />
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
                  type="button"
                  @click="showConfirmModal = true"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
                <button
                  type="button"
                  @click="handleQuickSave"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <!-- Changed icon to bookmark -->
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14l7-7 7 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/>
                  </svg>
                  {{ editMode ? 'Update Template' : 'Save as Template' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Content with updated styling -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <form @submit.prevent="handleSubmit" class="space-y-8">
                <!-- Letter Type -->
                <!-- Letter Type and Template in a row -->
                <div class="flex items-center gap-8">
                  <!-- Type Field -->
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Type:</label>
                    <div class="flex flex-col">
                      <div class="relative">
                        <!-- In the type select element -->
                        <!-- Change this in the template section -->
                        <!-- Change the select element -->
                        <select
                          v-model="letterForm.type"
                          required
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          @change="handleTypeChange"
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="Memo">Memo</option>
                          <option value="Endorsement">Endorsement</option>
                          <option value="Invitation Meeting">Invitation Meeting</option>
                          <option value="Letter to Admin">Letter to Admin</option>
                        </select>
                        <ValidationWarning v-if="errors.type" :message="errors.type" />
                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <!-- Template Field (right next to Type) -->
                
                    
                   
                    <div class="flex items-center gap-4 ml-8">
                      <label class="font-medium w-24 text-lg">Template:</label>
                      <div class="relative">
                        <!-- In the template section, update the template select element -->
                        <select
                          v-model="selectedTemplate"
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          @change="handleTemplateChange"
                          :disabled="isTemplateLoading"
                        >
                          <option value="">Select Template</option>
                          <option 
                            v-for="template in templates" 
                            :key="template.id" 
                            :value="template.id"
                          >
                            {{ template.name }}
                          </option>
                        </select>
                        <div 
                          v-if="isTemplateLoading" 
                          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        >
                          <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                            <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span class="mt-4 text-gray-700">Loading Template...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- End Letter Type and Template row -->
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

              
                  <!-- In the recipients section -->
                  <div v-for="(recipient, index) in letterForm.recipients" :key="index" class="flex items-center gap-4 ml-24">
                    <div class="flex-1">
                      <div class="relative flex items-center">
                        <select
                          v-model="recipient.id"
                          @change="updateRecipient(index, $event.target.value)"
                          class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                          :class="{ 'border-red-500': errors.recipients }"
                        >
                          <option value="">Select Recipient</option>
                          <option
                            v-for="r in getAvailableRecipients(index)"
                            :key="r.id"
                            :value="r.id"
                          >
                            {{ r.name }} - {{ r.position }}
                          </option>
                        </select>
                        <!-- In the recipients section -->
                        <button
                          v-if="letterForm.recipients.length > 1"
                          @click="removeRecipient(index)"
                          type="button"
                          class="absolute right-[-40px] p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
                            <path d="M6 21h12V7H6v14zm2.46-9.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                      <div v-if="recipient.name && recipient.position" class="mt-1 text-sm text-gray-600 flex items-center gap-2">
                        <!-- Make name clickable -->
                        <span
                          class="cursor-pointer text-blue-600 underline"
                          @click="showPdfPreviewButton(index)"
                        >
                          Selected: {{ recipient.name }} - {{ recipient.position }}
                        </span>
                        <!-- Show PDF Preview button if this recipient is selected for preview -->
                        <button
                          v-if="pdfPreviewIndex === index"
                          @click="previewRecipientPdf(recipient)"
                          type="button"
                          class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Preview PDF
                        </button>
                      </div>
                    </div>
                  </div>
                  <ValidationWarning v-if="errors.recipients" :message="errors.recipients" />
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
                      @input="clearError('subject')"
                    />
                    <ValidationWarning v-if="errors.subject" :message="errors.subject" />
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
                      @input="clearError('date')"
                    />
                    <ValidationWarning v-if="errors.date" :message="errors.date" />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex items-start gap-4 mt-6">
                  <label class="font-medium w-24 text-lg pt-2">Content:</label>
                  <div class="flex-1">
                    <div class="relative">
                      <QuillEditor
                        v-model:content="letterForm.content"
                        contentType="html"
                        :options="editorOptions"
                        class="h-[350px] min-h-[200px] border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
                        :class="{ 'border-red-500': errors.content }"
                        @update:content="onContentInput"
                      />
                      <div class="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-inset ring-gray-200"></div>
                    </div>
                    <!-- Improved single validation warning below the editor -->
                    <div v-if="errors.content" class="flex justify-center mt-2">
                      <ValidationWarning :message="errors.content" class="w-fit bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-2 rounded shadow" />
                    </div>
                  </div>
                </div>

                <!-- Sender Information section -->
                <div class="space-y-4 mt-8 pt-6 border-t">
                  <h3 class="font-medium text-lg">Sender Information</h3>
                  
                  <!-- Sender Name -->
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Name:</label>
                    <div class="flex flex-col flex-1">
                      <input
                        v-model="letterForm.sender_name"
                        type="text"
                        required
                        class="border rounded-md px-4 py-2"
                        :class="{ 'border-red-500': errors.sender_name }"
                        @input="clearError('sender_name')"
                      />
                      <ValidationWarning v-if="errors.sender_name" :message="errors.sender_name" />
                    </div>
                  </div>
                  
                  <!-- Sender Position -->
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Position:</label>
                    <div class="flex flex-col flex-1">
                      <input
                        v-model="letterForm.sender_position"
                        type="text"
                        required
                        class="border rounded-md px-4 py-2"
                        :class="{ 'border-red-500': errors.sender_position }"
                        @input="clearError('sender_position')"
                      />
                      <ValidationWarning v-if="errors.sender_position" :message="errors.sender_position" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div> <!-- End .bg-white rounded-xl ... -->
      </div> <!-- End .flex.items-center.justify-center.min-h-screen.p-4 -->
  </transition>

  <!-- Success Message Modal -->
  <!-- Keep the imported ConfirmationModal component -->
  <ConfirmationModal
    :show="showConfirmModal"
    @confirm="confirmSubmit"
    @cancel="showConfirmModal = false"
  />

  <SuccessMessageModal 
    v-if="showSuccess"
    message="Updated successfully!"
    @close="showSuccess = false"
    class="transition-opacity duration-300"
  />

  <!-- Save as Template Modal -->
  <div v-if="showTemplateModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Save as Template
              </h3>
              <div class="mt-2">
                <input
                  v-model="templateName"
                  type="text"
                  placeholder="Enter template name"
                  class="w-full border rounded-md px-4 py-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="confirmQuickSave"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Yes
          </button>
          <button
            type="button"
            @click="showTemplateModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Change this line:
import apiClient from '@/utils/apiClient'; // Using default import of named import

import { Quill } from '@vueup/vue-quill';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ConfirmationModal from './modals/ConfirmationModal.vue';
import SuccessMessageModal from './modals/SuccessMessageModal.vue';
import ValidationWarning from '@/components/common/ValidationWarning.vue';

// Add this constant before export default
const typeMap = {
  'memo': 'Memo',
  'endorsement': 'Endorsement',
  'invitation_meeting': 'Invitation Meeting',
  'letter_to_admin': 'Letter to Admin'
};

export default {
  name: 'LetterEditModal',
  components: {
    QuillEditor,
    SuccessMessageModal,
    ValidationWarning,
    ConfirmationModal // <-- Add this line
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
      required: false, // Change from required: true
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'save-letter', 'update-letter', 'refresh-letters', 'update:editMode'],
  data() {
    const defaultForm = { 
      title: '',
      type: '',
      subject: '',
      date: new Date().toISOString().split('T')[0],
      recipients: [{ id: '', name: '', position: '' }],
      content: '',
      sender_name: '',
      sender_position: '',
      pdfPreviewIndex: null
    };
    
    return {
      letterForm: {
        title: this.letter?.title || '',
        type: this.letter?.type || '',
        subject: this.letter?.subject || '',
        date: this.letter?.date ? this.formatDateForInput(this.letter.date) : defaultForm.date,
        recipients: this.letter?.recipients || [{ id: '', name: '', position: '' }],
        content: this.letter?.content || '',
        sender_name: this.letter?.sender_name || '',
        sender_position: this.letter?.sender_position || ''
      },
      errors: {},
      showConfirmModal: false,
      showTemplateModal: false,
      showSuccess: false,
      recipientsList: [],
      isSubmitting: false,
      templates: [],
      selectedTemplate: '',
      isTemplateLoading: false,
      editorOptions: {
        modules: {
          toolbar: [
            [{ 'font': [
              'arial', 'calibri', 'cambria', 'times-new-roman', 'courier', 'georgia', 'garamond', 'tahoma', 'verdana', 'trebuchet', 'helvetica'
            ] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link'],
            ['clean']
          ]
        },
        theme: 'snow',
        placeholder: 'Write your letter content here...'
      }
      // --- End of Quill editor options ---
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
      await this.fetchRecipients();
      
      const templatesResponse = await apiClient.get('/templates');
      this.templates = templatesResponse.data.data || templatesResponse.data;

      if (this.letter && Object.keys(this.letter).length > 0) {
        this.$emit('update:editMode', true);
        
        // Update letterForm instead of trying to set localLetter
        this.letterForm = {
          ...this.letterForm,
          date: this.formatDateForInput(this.letter.date || new Date()),
          type: typeMap[this.letter.type] || this.letter.type || ''
        };
      } else {
        // Update letterForm with default date
        this.letterForm.date = this.formatDateForInput(new Date());
      }
    } catch (error) {
      console.error('Component initialization error:', error);
      this.closeModal();
    }
  },  // <-- Add this comma
  methods: {
    async fetchCSRFToken() {
      try {
        // Add timeout and retry logic
        const response = await apiClient.get('/sanctum/csrf-cookie', {
          timeout: 5000, // 5 second timeout
          retry: 3 // Retry 3 times
        });
        
        if (!response) {
          throw new Error('No response from server');
        }
        return response;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        
        // More specific error messages
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Cannot connect to the server. Please check if the backend server is running.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Connection timed out. Please check your network connection.');
        }
        
        const errorMsg = error.response?.status === 404 
          ? 'CSRF endpoint not found. Check your API configuration.'
          : error.message || 'Failed to fetch CSRF token';
        throw new Error(errorMsg);
      }
    },

    formatDateForInput(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Invalid date
        
        // Adjust for local timezone
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    },

    closeModal() {
      this.errors = {};
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    addRecipient() {
      if (!Array.isArray(this.letterForm.recipients)) {
        this.letterForm.recipients = [];
      }
      this.letterForm.recipients.push({
        id: '',
        name: '',
        position: ''
      });
      this.clearError('recipients');
    },

    removeRecipient(index) {
      if (this.letterForm.recipients.length > 1) {
        this.letterForm.recipients.splice(index, 1);
      }
    },
    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        this.recipientsList = response.data.data || response.data;
        
        // Add null check for letterForm.recipients
        if (!this.letterForm.recipients) {
          this.letterForm.recipients = [{ id: '', name: '', position: '' }];
        }
        
        this.letterForm.recipients = this.letterForm.recipients.map(recipient => {
          const found = this.recipientsList.find(r => r.id == recipient.id);
          return found ? {
            id: found.id,
            name: found.name,
            position: found.position
          } : recipient;
        });
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
      this.clearError('recipients');
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
    
      // Validate type with human-readable values
      const validTypes = [
        'Memo',
        'Endorsement',
        'Invitation Meeting',
        'Letter to Admin'
      ];
      if (!this.letterForm.type || !validTypes.includes(this.letterForm.type)) {
        this.errors.type = 'Please select a valid type';
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

    async handleSubmit() {
      if (!this.validateForm()) return;
      this.isSubmitting = true;
      try {
        // Ensure all fields are properly converted to strings where needed
        const formData = {
          title: this.letterForm.title?.toString() || '',
          type: this.letterForm.type?.toString() || '',
          subject: this.letterForm.subject?.toString() || '',
          date: this.letterForm.date,
          content: this.letterForm.content?.toString() || '',
          sender_name: this.letterForm.sender_name?.toString() || '',
          sender_position: this.letterForm.sender_position?.toString() || '',
          recipients: this.letterForm.recipients.map(recipient => ({
            id: recipient.id ? parseInt(recipient.id) : null,
            name: recipient.name?.toString() || '',
            position: recipient.position?.toString() || ''
          })).filter(r => r.id !== null)
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
    },

    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        this.showConfirmModal = false;
    
        const formData = {
          title: String(this.letterForm.title || ''),
          type: String(this.letterForm.type || ''),
          subject: String(this.letterForm.subject || ''),
          date: this.letterForm.date,
          content: String(this.letterForm.content || ''),
          sender_name: String(this.letterForm.sender_name || ''),
          sender_position: String(this.letterForm.sender_position || ''),
          recipients: this.letterForm.recipients
            .filter(r => r.id) // Filter out empty recipients
            .map(recipient => parseInt(recipient.id)) // Send only the IDs as integers
        };
    
        let response;
        if (this.editMode && this.letter?.id) {
          response = await apiClient.put(`/letters/${this.letter.id}`, formData);
        } else {
          response = await apiClient.post('/letters', formData);
        }
    
        this.$emit('refresh-letters', { sortDescending: !this.editMode });
        this.showSuccess = true;
      
        setTimeout(() => {
          this.showSuccess = false;
          setTimeout(() => {
            this.closeModal();
          }, 300);
        }, 5000);
    
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
      this.showTemplateModal = true;
    },

    async confirmQuickSave() {
      try {
        this.isSubmitting = true;
        this.showTemplateModal = false;

        const formData = {
          name: this.templateName,
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

        // Change from POST to PUT
        const response = await apiClient.put(`/templates/${this.selectedTemplate}`, formData);
        
        // Adjust API response handling
        const newTemplate = response.data?.data || response.data;
        
        // Update templates list reactively
        this.templates = [
          ...this.templates,
          {
            id: newTemplate.id,
            name: newTemplate.name,
            // Include other necessary template properties
          }
        ];
        // Select the new template
        this.selectedTemplate = newTemplate.id;

        this.templateName = '';
        this.showSuccess = true;
        setTimeout(() => this.closeModal(), 1500);
      } catch (error) {
        console.error('Template save error:', error);
        this.errors.submit = error.response?.data?.message || 'Template save failed';
      } finally {
        this.isSubmitting = false;
      }
    },  // <-- Add this comma
    clearError(field) {
      if (this.errors && this.errors[field]) {
        delete this.errors[field] // Changed from this.$delete to standard delete
      }
    }, // <-- Add this comma
    onContentInput() {
      this.clearError('content');
    },
    async handleTemplateChange(eventOrId) {
      let templateId;
      if (eventOrId && eventOrId.target) {
        templateId = eventOrId.target.value;
      } else {
        templateId = eventOrId;
      }
      if (!templateId) return;
    
      try {
        this.isTemplateLoading = true;
        const response = await apiClient.get(`/templates/${templateId}`);
        const template = response.data.data || response.data;
    
        // Update letterForm directly instead of using this.letter
        this.letterForm = {
          ...this.letterForm,
          title: template.title || this.letterForm.title,
          type: template.type || this.letterForm.type,
          subject: template.subject || this.letterForm.subject,
          content: template.content || this.letterForm.content,
          sender_name: template.sender_name || this.letterForm.sender_name,
          sender_position: template.sender_position || this.letterForm.sender_position,
          date: this.formatDateForInput(template.date) || this.letterForm.date,
          recipients: template.recipients?.map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          })) || [{ id: '', name: '', position: '' }]
        };
    
        // Clear any template-related errors
        this.$nextTick(() => {
          this.clearError('template');
        });
      } catch (error) {
        console.error('Error loading template:', error);
        this.errors.template = 'Failed to load template';
      } finally {
        this.isTemplateLoading = false;
      }
    },
    initQuill() {
      // Whitelist the fonts for Quill
      const Font = Quill.import('formats/font');
      Font.whitelist = [
        'arial', 'calibri', 'cambria', 'times-new-roman', 'courier', 'georgia', 'garamond', 'tahoma', 'verdana', 'trebuchet', 'helvetica'
      ];
      Quill.register(Font, true);
    },
    getAvailableRecipients(currentIndex) {
      // Get all selected recipient IDs except the current one
      const selectedIds = this.letterForm.recipients
        .map((r, idx) => idx !== currentIndex ? r.id : null)
        .filter(id => id);

      // Always include the currently selected recipient for this dropdown
      return this.recipientsList.filter(r =>
        !selectedIds.includes(r.id) || r.id === this.letterForm.recipients[currentIndex].id
      );
    },
  },
  mounted() {
    this.initQuill();
  }
} // Single closing brace for the component definition

</script>

<style>
@import './styles/quill-editor.css';

/* Add custom fonts to Quill editor */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=""]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=""]::before {
  content: 'Standard';
  font-family: 'Arial', sans-serif;
}

.ql-font-arial {
  font-family: 'Arial', sans-serif;
}

.ql-font-times-new-roman {
  font-family: 'Times New Roman', serif;
}

.ql-font-courier {
  font-family: 'Courier New', monospace;
}

.ql-font-georgia {
  font-family: 'Georgia', serif;
}
</style>

