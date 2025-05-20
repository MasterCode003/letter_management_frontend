
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Header with gradient -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">New Letter</h2>  <!-- Changed from "Edit Letter" -->
              
              <!-- Title input centered with white background -->
              <!-- Change this in the title input -->
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
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
                  type="submit"
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save  <!-- Changed from "Update" -->
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
                        
                     
                        <select
                          v-model="letterForm.type" 
                          required
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          @change="clearError('type')"
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

                  <!-- Recipient rows -->
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
                            v-for="r in recipientsList"
                            :key="r.id"
                            :value="r.id"
                          >
                            {{ r.name }} - {{ r.position }}
                          </option>
                        </select>
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
                        <span
                          class="cursor-pointer text-blue-600 underline"
                          @click="showPdfPreviewButton(index)"
                        >
                          Selected: {{ recipient.name }} - {{ recipient.position }}
                        </span>
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
                Confirm Create
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure to create new letter?
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
      required: false, // Change from required: true
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'save-letter', 'update-letter', 'refresh-letters', 'update:editMode'],
  // In the data() function, add pdfPreviewIndex
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
      templateName: '', // Add this line
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
        // Instead of mutating prop directly
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
        
        // Build a new object for letterForm, do NOT spread this.letter
        this.letterForm = {
          title: this.letter.title || '',
          type: this.letter.type || '',
          subject: this.letter.subject || '',
          content: this.letter.content || '',
          sender_name: this.letter.sender_name || '',
          sender_position: this.letter.sender_position || '',
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
    async handleTemplateChange(eventOrId) {
      // Accept both event object and direct ID
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

        // Build a new object for letterForm, do NOT spread this.letter or this.letterForm
        this.letterForm = {
          title: template.title || '',
          type: template.type || '',
          subject: template.subject || '',
          content: template.content || '',
          sender_name: template.sender_name || '',
          sender_position: template.sender_position || '',
          date: template.date || new Date().toISOString().split('T')[0],
          recipients: template.recipients?.map(r => ({
            id: r.id || '',
            name: r.name || '',
            position: r.position || ''
          })) || [{ id: '', name: '', position: '' }]
        };

        this.clearErrors();
      } catch (error) {
        console.error('Error loading template:', error);
        this.errors.template = 'Failed to load template';
      } finally {
        this.isTemplateLoading = false;
      }
    },

    clearErrors() {
      this.errors = {};
    },

    async fetchCSRFToken() {
      try {
        const response = await apiClient.get('/sanctum/csrf-cookie');
        if (!response) {
          throw new Error('No response from server');
        }
        return response;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        const errorMsg = error.response?.status === 404 
          ? 'CSRF endpoint not found. Check your API configuration.'
          : error.message || 'Failed to fetch CSRF token';
        throw new Error(errorMsg);
      }
    },

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
        this.recipientsList = response.data.data || response.data || [];
        if (this.letterForm.recipients.length > 0) {
          this.letterForm.recipients = this.letterForm.recipients.map(recipient => {
            if (!recipient.id) return recipient;
            const foundRecipient = this.recipientsList.find(r => r.id === recipient.id);
            return foundRecipient ? {
              id: foundRecipient.id,
              name: foundRecipient.name,
              position: foundRecipient.position
            } : recipient;
          });
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipientsList = [];
        this.errors.recipients = 'Failed to fetch recipients. Please try again.';
      }
    },

    // Update updateRecipient method to handle null cases
    updateRecipient(index, recipientId) {
      if (!recipientId) return;
      
      const selectedRecipient = this.recipientsList.find(r => 
        r.id === (typeof recipientId === 'string' ? parseInt(recipientId) : recipientId)
      );
      
      if (selectedRecipient) {
        this.letterForm.recipients[index] = {
          id: selectedRecipient.id,
          name: selectedRecipient.name || '',
          position: selectedRecipient.position || ''
        };
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
    // Update the validateForm method
    validateForm() {
      this.errors = {};
      let isValid = true;
    
      // Validate type with specific values
      // Update valid types to match backend expectations
      const validTypes = ['Memo', 'Endorsement', 'Invitation Meeting', 'Letter to Admin'];
      if (!this.letterForm.type || !validTypes.includes(this.letterForm.type)) {
        this.errors.type = 'Please select a valid type';
        isValid = false;
      }

      // Add validation for required fields
      if (!this.letterForm.title) {
        this.errors.title = 'Title is required';
        isValid = false;
      }

      if (!this.letterForm.subject) {
        this.errors.subject = 'Subject is required';
        isValid = false;
      }

      if (!this.letterForm.content) {
        this.errors.content = 'Content is required';
        isValid = false;
      }

      if (!this.letterForm.sender_name) {
        this.errors.sender_name = 'Sender name is required';
        isValid = false;
      }

      if (!this.letterForm.sender_position) {
        this.errors.sender_position = 'Sender position is required';
        isValid = false;
      }

      // Validate recipients
      if (!this.letterForm.recipients.some(r => r.id)) {
        this.errors.recipients = 'At least one recipient is required';
        isValid = false;
      }
    
      return isValid;
    },

    // Add these methods
    async handleSubmit() {
      if (this.isSubmitting) return;
      
      if (!this.validateForm()) {
        return;
      }

      this.showConfirmModal = true;
    },

    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        // Ensure recipients are sent as integer IDs
        const payload = {
          ...this.letterForm,
          recipients: this.letterForm.recipients
            .map(r => parseInt(r.id, 10))
            .filter(id => !isNaN(id))
        };
        const endpoint = this.editMode ? `/letters/${this.letter.id}` : '/letters';
        const method = this.editMode ? 'put' : 'post';
        const response = await apiClient[method](endpoint, payload);
        this.showConfirmModal = false;
        this.showSuccess = true;
        setTimeout(() => {
          this.closeModal();
        }, 1200); // Close after 1.2 seconds
        if (this.editMode) {
          this.$emit('update-letter', response.data);
        } else {
          this.$emit('save-letter', response.data);
        }
        this.$emit('refresh-letters');
      } catch (error) {
        console.error('Error saving letter:', error);
        this.errors.submit = 'Failed to save letter. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },

    async handleQuickSave() {
      if (this.isSubmitting) return;
      
      // Validate required fields before showing template modal
      const requiredFields = ['title', 'type', 'subject', 'content', 'sender_name', 'sender_position', 'date'];
      const errors = {};
      
      requiredFields.forEach(field => {
        if (!this.letterForm[field]) {
          errors[field] = `The ${field.replace('_', ' ')} field is required.`;
        }
      });
    
      if (Object.keys(errors).length > 0) {
        this.errors = errors;
        return;
      }
    
      // Show template name input modal if validation passes
      this.showTemplateModal = true;
    },
    
    async confirmQuickSave() {
        if (!this.templateName) {
            this.errors.templateName = 'Template name is required';
            return;
        }
    
        // Validate required fields including title
        if (!this.letterForm.title) {
            this.errors.title = 'Title is required';
            return;
        }
    
        // Validate recipients exists and has at least one valid recipient
        if (!this.letterForm.recipients || this.letterForm.recipients.length === 0 || 
            !this.letterForm.recipients[0] || !this.letterForm.recipients[0].id) {
            this.errors.recipients = 'At least one valid recipient is required';
            return;
        }
    
        if (!this.letterForm.date) {
            this.errors.date = 'The date field is required';
            return;
        }
    
        try {
            this.isSubmitting = true;
            const payload = {
                name: this.templateName,
                title: this.letterForm.title,  // Make sure title is included
                type: this.letterForm.type,
                subject: this.letterForm.subject,
                content: this.letterForm.content,
                sender_name: this.letterForm.sender_name,
                sender_position: this.letterForm.sender_position,
                date: this.letterForm.date,    // Add date
                recipients: this.letterForm.recipients.map(recipient => ({
                    id: recipient.id,
                    name: recipient.name,
                    position: recipient.position
                }))
            };
    
            await apiClient.post('/templates', payload);
            this.showTemplateModal = false;
            this.showSuccess = true;
            setTimeout(() => {
                this.closeModal();
            }, 1200);
        } catch (error) {
            console.error('Error saving template:', error);
            if (error.response?.data?.errors) {
                this.errors = error.response.data.errors;
            } else {
                this.errors.submit = 'Failed to save template. Please try again.';
            }
        } finally {
            this.isSubmitting = false;
        }
    },
    clearError(field) {
      if (this.errors && this.errors[field]) {
        this.errors[field] = null;
        delete this.errors[field];
      }
    },
    onContentInput() {
      this.clearError('content');
    },
    showPdfPreviewButton(index) {
      this.pdfPreviewIndex = index;
    },
    previewRecipientPdf(recipient) {
      // Placeholder: Replace with your actual PDF preview logic
    }
  }, // End of methods

  watch: {
    selectedTemplate(newVal) {
      if (newVal) {
        this.handleTemplateChange(newVal);
      }
    }
  }
} // End of component export default

</script>

<style>
.prose {
  width: 100%;
}
</style>
