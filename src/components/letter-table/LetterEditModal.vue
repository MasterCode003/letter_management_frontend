<template>
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
                  v-model="formData.title"
                  :class="{'border-red-500': errors && errors.title}"
                  type="text"
                  required
                  placeholder="Enter letter title"
                  class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                />
                <ValidationWarning v-if="errors && errors.title" :message="errors.title" />
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
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Update
              </button>
              <button
                type="button"
                @click="handleQuickSave"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all"
              >
                <!-- Changed icon to bookmark -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14l7-7 7 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/>
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
              <!-- Rest of your form fields remain the same but with updated styling -->
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
                      >
                        <option value="Memo">Memo</option>
                        <option value="Business Letter">Business Letter</option>
                      </select>
                      <ValidationWarning v-if="errors && errors.type" :message="errors.type" />
                      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
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
                      :disabled="isTemplateLoading"
                    >
                      <option value="">Select Template</option>
                      <option v-for="template in templates" :key="template.id" :value="template.id">
                        {{ template.name }}
                      </option>
                    </select>
                    <div 
                      v-if="isTemplateLoading" 
                      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                      <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="mt-2 text-gray-700 text-sm">Loading Template...</span>
                      </div>
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
              
                <div v-for="(recipient, index) in letter.recipients" :key="index" class="flex items-center gap-4 ml-24">
                  <div class="flex-1">
                    <select
                      v-model="recipient.id"
                      @change="updateRecipient(index, $event.target.value)"
                      class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                    >
                      <option value="">Select Recipient</option>
                      <option v-for="r in recipientsList" :key="r.id" :value="r.id">
                        {{ r.name }} - {{ r.position }}
                      </option>
                    </select>
                  </div>
                  <button
                    v-if="letter.recipients.length > 1"
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
              <!-- End Letter Type and Template row -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Subject:</label>
                <div class="flex flex-col flex-1">
                  <input
                    v-model="letter.subject"
                    type="text"
                    required
                    class="border rounded-md px-4 py-2"
                  />
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
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="flex items-start gap-4 mt-6">
                <label class="font-medium w-24 text-lg pt-2">Content:</label>
                <div class="flex-1">
                  <QuillEditor
                    v-model:content="letter.content"
                    contentType="html"
                    :options="{
                      modules: {
                        toolbar: [
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'font': [] }],
                          [{ 'align': [] }],
                          [{ 'size': ['small', false, 'large', 'huge'] }],
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['blockquote', 'code-block'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      },
                      theme: 'snow'
                    }"
                    theme="snow"
                    class="h-[300px]"
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
                      v-model="letter.sender_name"
                      placeholder="Enter sender's name"
                      class="w-full border rounded-md px-4 py-2"
                    />
                    <ValidationWarning v-if="errors && errors.sender_name" :message="errors.sender_name" />
                  </div>
                  <div class="flex flex-col space-y-2">
                    <label class="text-base font-medium">Position/Title</label>
                    <input
                      type="text"
                      v-model="letter.sender_position"
                      placeholder="Enter sender's position"
                      class="w-full border rounded-md px-4 py-2"
                    />
                    <ValidationWarning v-if="errors && errors.sender_position" :message="errors.sender_position" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
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
              Confirm Update
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Are you sure you want to update this letter?
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
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Save as Template Modal -->
    <div v-if="showTemplateModal" class="fixed inset-0 z-[60] overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6 text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Save as Template</h3>
            <input
              v-model="templateName"
              type="text"
              placeholder="Enter template name"
              class="w-full border rounded-md px-4 py-2 mb-4"
            />
            <div class="flex justify-center gap-3">
              <button
                @click="confirmQuickSave"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                @click="showTemplateModal = false"
                class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> <!-- This closes your root v-if="modelValue" div -->
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import { editorOptions } from './editorOptions';
import ValidationWarning from '@/components/common/ValidationWarning.vue';
import apiClient from '@/utils/apiClient';

export default {
  name: 'LetterEditModal',
  components: {
    QuillEditor,
    SuccessMessageModal,
    ValidationWarning
  },
  props: {
    modelValue: { type: Boolean, default: false },
    letter: { type: Object, default: () => ({}) },
    recipients: { type: Array, default: () => [] },
    editMode: { type: Boolean, default: false }
  },
  data() {
    return {
      showConfirmModal: false,
      showSuccess: false,
      isSubmitting: false,
      isTemplateLoading: false,
      showTemplateModal: false,
      templateName: '',
      templates: [],
      selectedTemplate: '',
      isTemplateLoading: false,
      errors: [],
      editorOptions: editorOptions,
      formData: {
        title: '',
        type: '',
        recipients: [],
        subject: '',
        date: '',
        content: '',
        sender_name: '',
        sender_position: ''
      },
      recipientsList: []
    }
  },
  async created() {
    try {
      // Fetch recipients
      const response = await apiClient.get('/recipients');
      this.recipientsList = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || [];
      // Fetch templates
      const templatesResponse = await apiClient.get('/templates');
      this.templates = templatesResponse.data.data || templatesResponse.data;
    } catch (error) {
      console.error('Error initializing component:', error);
      this.recipientsList = [];
    }
  },
  computed: {
    availableRecipients() {
      return Array.isArray(this.recipientsList) 
        ? this.recipientsList.map(recipient => ({
            ...recipient,
            id: recipient.id.toString() || ''
          }))
        : [];
    }
  },
  watch: {
    letter: {
      immediate: true,
      handler(newLetter) {
        if (newLetter) {
          this.formData = {
            ...newLetter,
            date: newLetter.date ? new Date(newLetter.date).toISOString().split('T')[0] : '',
            recipients: newLetter.recipients && newLetter.recipients.length 
              ? newLetter.recipients.map(r => ({
                  id: r.id || '',
                  name: r.name || '',
                  position: r.position || ''
                }))
              : [{ id: '', name: '', position: '' }]
          };
        }
      }
    }
  },
  methods: {
    addRecipient() {
      this.formData.recipients.push({ id: '', name: '', position: '' });
    },
    removeRecipient(index) {
      if (this.formData.recipients.length > 1) {
        this.formData.recipients.splice(index, 1);
      }
    },
    updateRecipient(index, recipientId) {
      const selectedRecipient = this.availableRecipients.find(r => 
        r.id.toString() === recipientId.toString()
      );
      if (selectedRecipient) {
        this.formData.recipients[index] = {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        };
      }
    },
    handleBack() {
      this.$emit('update:modelValue', false);
    },
    handleSubmit() {
      this.showConfirmModal = true;
    },
    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        this.showConfirmModal = false;
        const formData = {
          ...this.formData,
          recipients: this.formData.recipients.map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          })).filter(r => r.id)
        };
        const response = await axios.put(
          `http://192.168.5.34:8000/api/letters/${this.letter.id}`, 
          formData,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        this.$emit('refresh-letters');
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.$emit('update:modelValue', false);
        }, 1500);
      } catch (error) {
        console.error('Error updating letter:', error);
        this.errors = error.response?.data?.errors || ['Failed to update letter'];
      } finally {
        this.isSubmitting = false;
      }
    },
    async loadTemplate(templateId) {
      try {
        this.isTemplateLoading = true;
        const response = await apiClient.get(`/api/templates/${templateId}`);
        const template = response.data.data || response.data;
        
        // Update letter data with template data
        this.letter = {
          ...this.letter,
          type: template.type,
          subject: template.subject,
          content: template.content,
          sender_name: template.sender_name,
          sender_position: template.sender_position,
          recipients: template.recipients.map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          }))
        };
        
        // Also update formData to keep it in sync
        this.formData = {
          ...this.formData,
          type: template.type,
          subject: template.subject,
          content: template.content,
          sender_name: template.sender_name,
          sender_position: template.sender_position,
          recipients: template.recipients.map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          }))
        };
        
        this.errors = {};
      } catch (error) {
        console.error('Error loading template:', error);
        this.errors.template = 'Failed to load template';
      } finally {
        this.isTemplateLoading = false;
      }
    },
    handleQuickSave() {
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
          type: this.formData.type,
          subject: this.formData.subject,
          date: this.formData.date,
          content: this.formData.content,
          sender_name: this.formData.sender_name,
          sender_position: this.formData.sender_position,
          recipients: this.formData.recipients
            .filter(r => r.id)
            .map(r => ({
              id: r.id,
              name: r.name,
              position: r.position
            }))
        };
    
        const response = await apiClient.post('/templates', formData);
        const newTemplate = response.data?.data || response.data;
        this.templates = [
          ...this.templates,
          {
            id: newTemplate.id,
            name: newTemplate.name,
          }
        ];
    
        this.selectedTemplate = newTemplate.id;
        this.templateName = '';
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.$emit('update:modelValue', false);
        }, 1500);
      } catch (error) {
        console.error('Template save error:', error);
        this.errors.submit = error.response?.data?.message || 'Template save failed';
      } finally {
        this.isSubmitting = false;
      }
    },
    async loadTemplate(templateId) {
      try {
        this.isTemplateLoading = true;
        const response = await apiClient.get(`/templates/${templateId}`);
        const template = response.data.data || response.data;
        
        this.formData = {
          ...this.formData,
          title: template.name,
          type: template.type,
          subject: template.subject,
          date: this.formatDateForInput(template.date),
          content: template.content,
          sender_name: template.sender_name,
          sender_position: template.sender_position,
          recipients: template.recipients.map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          }))
        };
        
        this.errors = {};
      } catch (error) {
        console.error('Error loading template:', error);
        this.errors.submit = 'Failed to load template';
      } finally {
        this.isTemplateLoading = false;
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;
    
      if (!this.formData.title?.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }
    
      if (!this.formData.type?.trim()) {
        this.errors.type = 'Type is required';
        isValid = false;
      }
    
      if (!this.formData.subject?.trim()) {
        this.errors.subject = 'Subject is required';
        isValid = false;
      }
    
      if (!this.formData.date) {
        this.errors.date = 'Date is required';
        isValid = false;
      }
    
      if (!this.formData.content?.trim()) {
        this.errors.content = 'Content is required';
        isValid = false;
      }
    
      if (!this.formData.sender_name?.trim()) {
        this.errors.sender_name = 'Sender name is required';
        isValid = false;
      }
    
      if (!this.formData.sender_position?.trim()) {
        this.errors.sender_position = 'Sender position is required';
        isValid = false;
      }
    
      const hasEmptyRecipients = this.formData.recipients.some(r => !r.id);
      if (hasEmptyRecipients) {
        this.errors.recipients = 'All recipients must be selected';
        isValid = false;
      }
    
      return isValid;
    },
    
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }
  },
  watch: {
    selectedTemplate(newVal) {
      if (newVal) {
        this.loadTemplate(newVal);
      }
    }
  },
}
</script>