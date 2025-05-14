
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
      
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Modal Header -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">Create New Letter</h2>
              
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <input
                    v-model="letterForm.title"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                  />
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="button"
                  @click="handleSaveTemplate"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save as Template
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
                  Create
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <form @submit.prevent="handleSubmit" class="space-y-8">
                <!-- Letter Type -->
                <div class="flex items-center gap-8">
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Type:</label>
                    <select
                      v-model="letterForm.type"
                      required
                      class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                    >
                      <option value="Memo">Memo</option>
                      <option value="Business Letter">Business Letter</option>
                    </select>
                  </div>

                  <!-- Template Selection -->
                  <div class="flex items-center gap-4 ml-8">
                    <label class="font-medium w-24 text-lg">Template:</label>
                    <div class="relative">
                      <select
                        v-model="selectedTemplate"
                        class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                        :disabled="isTemplateLoading"
                        @change="clearTemplateError"
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
                        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md"
                      >
                        <svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                  <!-- Recipients list would go here -->
                </div>

                <!-- Subject field -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Subject:</label>
                  <input
                    v-model="letterForm.subject"
                    type="text"
                    required
                    class="flex-1 border rounded-md px-4 py-2"
                  />
                </div>

                <!-- Date field -->
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Date:</label>
                  <input
                    v-model="letterForm.date"
                    type="date"
                    required
                    class="w-[200px] border rounded-md px-4 py-2"
                  />
                </div>

                <!-- Content Editor -->
                <div class="flex items-start gap-4 mt-6">
                  <label class="font-medium w-24 text-lg pt-2">Content:</label>
                  <div class="flex-1">
                    <QuillEditor
                      v-model:content="letterForm.content"
                      contentType="html"
                      :options="editorOptions"
                      class="h-[350px] min-h-[200px] border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <!-- Sender Information -->
                <div class="space-y-4 mt-8 pt-6 border-t">
                  <h3 class="font-medium text-lg">Sender Information</h3>
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Name:</label>
                    <input
                      v-model="letterForm.sender_name"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                    />
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Position:</label>
                    <input
                      v-model="letterForm.sender_position"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import apiClient from '../../utils/apiClient'

export default {
  name: 'LetterModal',
  components: { QuillEditor },
  props: {
    modelValue: { type: Boolean, required: true }
  },
  emits: ['update:modelValue', 'close'],
  
  data() {
    return {
      letterForm: {
        title: '',
        type: 'Memo',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [{ id: '', name: '', position: '' }],
        content: '',
        sender_name: '',
        sender_position: ''
      },
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Compose your letter...',
        theme: 'snow'
      },
      isSubmitting: false,
      isTemplateLoading: false,
      selectedTemplate: '',
      templates: []
    }
  },

  methods: {
    async handleSubmit() {
      this.isSubmitting = true;
      try {
        await apiClient.post('/letters', this.letterForm);
        this.closeModal();
        this.$emit('refresh-letters');
      } catch (error) {
        console.error('Error creating letter:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    addRecipient() {
      this.letterForm.recipients.push({ id: '', name: '', position: '' });
    },
    closeModal() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    clearTemplateError() {
      if (this.errors?.template) {
        this.errors = { ...this.errors, template: null };
      }
    }
  },

  async created() {
    try {
      this.isTemplateLoading = true;
      const response = await apiClient.get('/templates');
      this.templates = response.data.data || response.data;
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      this.isTemplateLoading = false;
    }
  },

  watch: {
    async selectedTemplate(newVal) {
      if (newVal) {
        try {
          this.isTemplateLoading = true;
          const response = await apiClient.get(`/templates/${newVal}`);
          const template = response.data.data || response.data;
          
          this.letterForm = {
            ...this.letterForm,
            type: template.type,
            content: template.content,
            subject: template.subject,
            recipients: template.recipients?.map(r => ({ 
              id: r.id, 
              name: r.name, 
              position: r.position 
            })) || []
          };
        } catch (error) {
          console.error('Error loading template:', error);
        } finally {
          this.isTemplateLoading = false;
        }
      }
    }
  },  // <-- Add comma here to separate component options

  methods: {
    async handleSaveTemplate() {
      try {
        this.isSubmitting = true;
        await apiClient.post('/templates', this.letterForm);
        this.showSuccess = true;
        this.$emit('refresh-templates');
      } catch (error) {
        console.error('Error saving template:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>