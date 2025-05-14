
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Header with gradient -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">Edit Letter</h2>
              
              <!-- Title input centered with white background -->
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <input
                    v-model="letter.title"
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
                  type="submit"
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Update
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
                        <select
                          v-model="letter.type"
                          required
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          @change="clearError('type')"
                        >
                          <option value="Memo">Memo</option>
                          <option value="Business Letter">Business Letter</option>
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
                        <select
                          v-model="selectedTemplate"
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          @change="clearError('template')"
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

                  <div v-for="(recipient, index) in letterForm.recipients" :key="index" class="flex items-center gap-4 ml-24">
                    <div class="flex-1">
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
                  <ValidationWarning v-if="errors.recipients" :message="errors.recipients" />
                </div>

                <!-- Subject field -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Subject:</label>
                  <div class="flex flex-col flex-1">
                    <input
                      v-model="letter.subject"
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
                      v-model="letter.date"
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
                        v-model:content="letter.content"
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
                        v-model="letter.sender_name"
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
                        v-model="letter.sender_position"
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
  <SuccessMessageModal 
    v-if="showSuccess"
    message="Letter saved successfully!"
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
                Confirm Update
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to update this letter?
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

  <!-- Add this after the Confirmation Modal -->
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
import LetterHeader from './LetterHeader.vue';
// Change this line:
import apiClient from '@/utils/apiClient'; // Using default import of named import

import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import SuccessMessageModal from './modals/SuccessMessageModal.vue';
// Add this import:
import ValidationWarning from '@/components/common/ValidationWarning.vue';

export default {
  name: 'LetterEditModal',
  components: {
    QuillEditor,
    SuccessMessageModal,
    LetterHeader,
    ValidationWarning // Register the component
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
      required: true  // If parent component must provide this
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
      pdfPreviewIndex: null // Add index tracking for PDF preview button
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
      showTemplateModal: false,  // Add this line
      showSuccess: false,  // Keep this for controlling visibility
      recipientsList: [],
      isSubmitting: false,
      // Add these lines:
      templates: [], // List of templates (should be fetched from API if needed)
      selectedTemplate: '', // Currently selected template ID
      isTemplateLoading: false, // <-- Add this line
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
      
      // Fetch recipients first
      await this.fetchRecipients();
      
      // Then fetch templates
      const templatesResponse = await apiClient.get('/templates');
      this.templates = templatesResponse.data.data || templatesResponse.data;

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
        const response = await apiClient.get('/sanctum/csrf-cookie');
        // Remove the baseURL parameter completely
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
        
        // Add template fetching
        const templatesResponse = await apiClient.get('/templates');
        this.templates = templatesResponse.data.data || templatesResponse.data;

        if (this.letter && Object.keys(this.letter).length > 0) {
          // Instead of setting editMode directly, emit an event
          this.$emit('update:editMode', true);
          
          const formattedRecipients = Array.isArray(this.letter.recipients) 
            ? this.letter.recipients.map(r => {
                if (typeof r === 'object') {
                  return {
                    id: r.id || '',
                    name: r.name || '',
                    position: r.position || ''
                  };
                } else {
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
        await this.fetchRecipients();
      } catch (error) {
        console.error('Component initialization error:', error);
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
        // Update to match your API response structure
        this.recipientsList = response.data.data || response.data;
        
        // Update existing recipients with complete data
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

    // In confirmSubmit method
    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        this.showConfirmModal = false;
        
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

        this.$emit('refresh-letters', { sortDescending: !this.editMode }); // Add sort parameter
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
    async loadTemplate(templateId) {
      try {
        this.isTemplateLoading = true;
        const response = await apiClient.get(`/templates/${templateId}`);
        // Update to match your template response structure
        const template = response.data.data || response.data;
        
        // Clear existing recipients before applying template
        this.letterForm.recipients = template.recipients.map(r => ({
          id: r.id,
          name: r.name,
          position: r.position
        }));
        
        // Rest of the template loading logic remains the same
      } catch (error) {
        console.error('Error loading template:', error);
        this.errors.submit = 'Failed to load template';
      } finally {
        this.isTemplateLoading = false;
      }
    },
  }, // <-- end of methods

  // Move watch here, as a sibling to methods:
  watch: {
    selectedTemplate(newVal) {
      console.log('Selected template ID:', newVal);
      if (newVal) {
        this.loadTemplate(newVal);
      }
    }
  } // <-- Removed extra comma and fixed indentation
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

// --- Add your methods here ---
showPdfPreviewButton(index) {
  this.pdfPreviewIndex = index;
},
previewRecipientPdf(recipient) {
  // Placeholder: Replace with your actual PDF preview logic
  alert(`Previewing PDF for: ${recipient.name} - ${recipient.position}`);
