<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Header with buttons -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">{{ editMode ? 'Edit Letter' : 'New Letter' }}</h2>
              
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <input
                    v-model="letterForm.title"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                    @input="clearError('title')"
                  />
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  @click="handleQuickSave"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save as Template
                </button>
                <button
                  type="button"
                  @click="handleBack"
                  class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  @click="handleSubmit"  
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <!-- Type and Template Selection -->
              <div class="flex items-center gap-8 mb-6">
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Type:</label>
                  <select
                    v-model="letterForm.type"
                    required
                    class="w-[200px] border rounded-md px-4 py-2"
                    @change="clearError('type')"
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Memo">Memo</option>
                    <option value="Endorsement">Endorsement</option>
                    <option value="Invitation Meeting">Invitation Meeting</option>
                    <option value="Letter to Admin">Letter to Admin</option>
                  </select>
                </div>
                
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">Template:</label>
                  <select
                    v-model="selectedTemplate"
                    class="w-[200px] border rounded-md px-4 py-2"
                    @change="handleTemplateChange"
                  >
                    <option value="">Select Template</option>
                    <option v-for="template in templates" :key="template.id" :value="template.id">
                      {{ template.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Recipients Section -->
              <div class="mb-6">
                <div class="flex items-center gap-4">
                  <label class="font-medium w-24 text-lg">FOR:</label>
                  <div class="flex-1">
                    <div v-for="(recipient, index) in letterForm.recipients" :key="index" class="relative flex items-center mb-2">
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
                          :disabled="letterForm.recipients.some(existing => existing.id === r.id && existing !== recipient)"
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
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addRecipient"
                      class="mt-2 border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Recipient
                    </button>
                    <span v-if="errors.recipients" class="text-red-500 text-sm mt-1 block">
                      {{ errors.recipients }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Subject Field -->
              <div class="flex items-center gap-4 mb-6">
                <label class="font-medium w-24 text-lg">Subject:</label>
                <input
                  v-model="letterForm.subject"
                  type="text"
                  required
                  class="flex-1 border rounded-md px-4 py-2"
                  @input="clearError('subject')"
                />
                <span v-if="errors.subject" class="text-red-500 text-sm mt-1 block">
                  {{ errors.subject }}
                </span>
              </div>

              <!-- Editor -->
              <div class="mb-6">
                <label class="font-medium text-lg mb-2 block">Content:</label>
                <QuillEditor
                  v-model:content="letterForm.content"
                  :options="editorOptions"
                  :toolbar="editorOptions.modules.toolbar"
                  theme="snow"
                  class="min-h-[400px]"
                  @input="clearError('content')"
                />
              </div>

              <!-- Sender Information -->
              <div class="border-t pt-6">
                <h3 class="font-medium text-lg mb-4">Sender Information</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Name:</label>
                    <input
                      v-model="letterForm.sender_name"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                      @input="clearError('sender_name')"
                    />
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Position:</label>
                    <input
                      v-model="letterForm.sender_position"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                      @input="clearError('sender_position')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save as Template Modal -->
          <div v-if="showTemplateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-[400px]">
              <h3 class="text-lg font-medium mb-4">Save as Template</h3>
              <input
                v-model="templateName"
                type="text"
                placeholder="Enter template name"
                class="w-full border rounded-md px-4 py-2 mb-4"
                :class="{ 'border-red-500': errors.templateName }"
              />
              <div class="flex justify-end gap-4">
                <button
                  @click="showTemplateModal = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  @click="confirmQuickSave"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  :disabled="isSubmitting"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <!-- Confirmation Modal -->
          <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-[400px]">
              <h3 class="text-lg font-medium mb-4">Confirm Save</h3>
              <p class="text-gray-600 mb-6">Are you sure you want to save this letter?</p>
              <div class="flex justify-end gap-4">
                <button
                  @click="showConfirmModal = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <!-- In confirmation modal section -->
                <button
                  @click="confirmSubmit"  
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : 'Confirm' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Rest of your form content -->
          <!-- ... -->
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.prose {
  width: 100%;
}
</style>


<script>
import { onMounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import ValidationWarning from '@/components/common/ValidationWarning.vue'
import useLetterModal from './composables/useLetterModal'

export default {
  name: 'LetterEditModal',
  components: {
    QuillEditor,
    SuccessMessageModal,
    ValidationWarning
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
  emits: ['update:modelValue', 'close', 'save-letter', 'update-letter', 'refresh-letters', 'update:editMode', 'template-saved'],

  setup(props, { emit }) {
    const letterModal = useLetterModal(props, emit)
    
    watch(() => letterModal.selectedTemplate.value, (newVal) => {
      if (newVal) {
        letterModal.handleTemplateChange(newVal)
      }
    })

    onMounted(() => {
      letterModal.initQuill()
      letterModal.fetchRecipients()
      letterModal.fetchTemplates()
    })

    return {
      ...letterModal
    }
  }
}
</script>


