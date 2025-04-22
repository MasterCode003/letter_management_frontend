<template>
  <!-- Single root element wrapping all content -->
  <div>
    <!-- Main Letter Modal -->
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
              <!-- In your form element -->
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
                      :options="{
                        modules: {
                          toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'align': [] }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'size': ['small', 'normal', 'large', 'huge'] }], // Fixed size options
                            ['clean']
                          ]
                        },
                        placeholder: 'Write your content here...',
                        preserveWhitespace: true,
                        // Add these formats
                        formats: [
                          'bold', 'italic', 'underline', 'strike',
                          'header', 'list', 'indent', 'align',
                          'size' // Add size to allowed formats
                        ]
                      }"
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
  </div>

  <!-- Update the Save/Update Confirmation Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-[60] overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            Confirm {{ editMode ? 'Update' : 'Save' }}
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            Are you sure you want to {{ editMode ? 'update' : 'save' }} this letter?
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              type="button"
              @click="showConfirmModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmSubmit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {{ editMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Success Message Modal -->
  <SuccessMessageModal
    v-if="showSuccess"
    :message="editMode ? 'Letter Updated!' : 'Letter Saved!'"
    @close="showSuccess = false"
  />
</template>

<script>
import axios from 'axios';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { nextTick } from 'vue'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js'

const apiClient = axios.create({
  baseURL: 'http://192.168.5.71:8000/api',
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
    QuillEditor,
    SuccessMessageModal  // Register the component here
  },
  emits: ['close', 'save', 'save-letter', 'update-letter', 'refresh-letters'],
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
      showSuccess: false,  // Keep this for controlling visibility
      recipientsList: [],
      editMode: false,
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
  created() {
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
  },
  methods: {
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

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
        const response = await apiClient.get('/recipients/');
        console.log('Recipients response:', response.data);
        
        // More robust response data validation
        if (response && response.data) {
          if (Array.isArray(response.data.data)) {
            this.recipientsList = response.data.data;
          } else if (Array.isArray(response.data)) {
            this.recipientsList = response.data;
          } else {
            this.recipientsList = []; // Set empty array as fallback
            console.warn('Unexpected response format:', response.data);
          }
        } else {
          this.recipientsList = []; // Set empty array as fallback
          console.warn('Empty or invalid response');
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipientsList = []; // Set empty array on error
        // More user-friendly error message
        alert('Unable to load recipients. Please check your connection and try again.');
      }
    },
    updateRecipient(index, recipientId) {
      if (!recipientId || recipientId === '') {
        this.letterForm.recipients[index] = { id: '', name: '', position: '' };
        return;
      }
      
      const selectedRecipient = this.recipientsList.find(r => 
        r.id === (typeof recipientId === 'string' ? parseInt(recipientId) : recipientId)
      );
      
      if (!selectedRecipient) return;
    
      // Check for duplicates using ID instead of name and position
      const isDuplicate = this.letterForm.recipients.some((r, i) => 
        i !== index && r.id === selectedRecipient.id
      );
      
      if (isDuplicate) {
        alert('This recipient is already selected');
        this.letterForm.recipients[index] = { id: '', name: '', position: '' };
        return;
      }
    
      this.letterForm.recipients[index] = {
        id: selectedRecipient.id,
        name: selectedRecipient.name,
        position: selectedRecipient.position
      };
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
    handleSubmit() {
      // Reset errors
      this.errors = {};
      this.showConfirmModal = true;
    },

    async generatePDF() {
      const container = document.createElement('div');
      container.className = 'pdf-content';
      
      // Create letter structure with proper formatting
      const letterHTML = `
        <div class="letter-header">
          <h1 style="font-size: 18px; margin-bottom: 20px;">${this.letterForm.title}</h1>
          <div style="margin-bottom: 15px;">
            <strong>Type:</strong> ${this.letterForm.type}<br>
            <strong>Date:</strong> ${this.letterForm.date}<br>
            <strong>Subject:</strong> ${this.letterForm.subject}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>To:</strong><br>
            ${this.letterForm.recipients.map(r => 
              `${r.name}<br>${r.position}`
            ).join('<br>')}
          </div>
        </div>
        <div class="letter-content" style="margin: 30px 0;">
          ${this.letterForm.content}
        </div>
        <div class="letter-footer" style="margin-top: 40px;">
          <div style="text-align: left;">
            <strong>${this.letterForm.sender_name}</strong><br>
            ${this.letterForm.sender_position}
          </div>
        </div>
      `;
      
      container.innerHTML = letterHTML;

      const opt = {
        margin: [25, 25],
        filename: `${this.letterForm.title || 'letter'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
          scrollX: 0,
          windowWidth: 1024
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          putOnlyUsedFonts: true
        }
      };

      const style = document.createElement('style');
      style.textContent = `
        .pdf-content {
          font-family: Arial, sans-serif !important;
          /* Add these new rules */
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        /* Force all elements to inherit styles */
        .ql-editor, .ql-editor * {
          all: revert !important;
          font-family: inherit !important;
          line-height: inherit !important;
        }
        /* Explicitly define text decoration */
        u {
          text-decoration: underline !important;
        }
        strike {
          text-decoration: line-through !important;
        }
        
        /* Size classes */
        .ql-size-small { 
          font-size: 0.75em !important; 
        }
        .ql-size-normal { 
          font-size: 1em !important; 
        }
        .ql-size-large { 
          font-size: 1.5em !important; 
        }
        .ql-size-huge { 
          font-size: 2em !important; 
        }
      `;
      document.head.appendChild(style);

      try {
        await html2pdf().set(opt).from(container).save();
      } finally {
        style.remove();
      }
    }, // Add comma here

    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        
        // Format recipients data correctly
        const formData = {
          ...this.letterForm,
          recipients: this.letterForm.recipients.map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          })).filter(r => r.id), // Filter out empty recipients
          title: this.letterForm.title,
          type: this.letterForm.type,
          subject: this.letterForm.subject,
          date: this.letterForm.date,
          content: this.letterForm.content,
          sender_name: this.letterForm.sender_name,
          sender_position: this.letterForm.sender_position
        };

        console.log('Sending data:', formData);

        let response;
        if (this.editMode) {
          response = await apiClient.put(`/letters/${this.letter.id}/`, formData);
        } else {
          response = await apiClient.post('/letters/', formData);
        }

        // Remove the PDF generation line from here
        // await this.generatePDF();

        this.showConfirmModal = false;
        this.showSuccess = true;
        this.$emit('refresh-letters');

        setTimeout(() => {
          this.showSuccess = false;
          this.closeModal();
        }, 1500);

      } catch (error) {
        console.error('Error submitting letter:', error);
        // Handle Django-style validation errors
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors;
        } else if (error.response?.data) {
          this.errors = error.response.data;
        } else {
          alert('An error occurred while saving the letter. Please try again.');
        }
      } finally {
        this.isSubmitting = false;
      }
    },
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

<style>
/* Enhanced Quill editor styles */
.ql-editor {
  font-size: 1rem;
  line-height: 1.6;
  color: #000;
}

.ql-editor p {
  margin-bottom: 1em !important;
}

.ql-editor strong,
.ql-editor b {
  font-weight: 700 !important;
}

.ql-editor ul,
.ql-editor ol {
  padding-left: 20px !important;
  margin-bottom: 1em !important;
}

.ql-editor li {
  margin-bottom: 0.5em !important;
}
</style>

