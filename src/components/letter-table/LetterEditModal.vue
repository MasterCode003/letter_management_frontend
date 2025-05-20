
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
              <!-- Change this in the title input -->
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <!-- Replace letter.title with localLetter.title -->
                  <input
                    v-model="localLetter.title"
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
                        <!-- In the type select element -->
                        <!-- Change this in the template section -->
                        <!-- Change the select element -->
                        <!-- Replace all other instances of letter. with localLetter. -->
                        <select
                          v-model="localLetter.type"
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

                  <!-- Change letter.recipients to localLetter.recipients -->
                  <div v-for="(recipient, index) in localLetter.recipients" :key="index" class="flex items-center gap-4 ml-24">
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
                      </div>

                      <!-- Remove this duplicate select element -->
                      <!-- Remove the merge conflict marker >>>>>>> parent of 2dd0a0e -->
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
                      v-model="localLetter.subject"
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
                      v-model="localLetter.date"
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
                        v-model:content="localLetter.content"
                        contentType="html"
                        :options="editorOptions"
                        class="h-[350px] min-h-[200px] border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
                        :class="{ 'border-red-500': errors.content }"
                        @update:content="onContentInput"
                      />
                      <div class="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-inset ring-gray-200"></div>
                    </div>
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
                        v-model="localLetter.sender_name"
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
                        v-model="localLetter.sender_position"
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
import ConfirmationModal from './modals/ConfirmationModal.vue'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import ValidationWarning from '@/components/common/ValidationWarning.vue'

export default {
  components: {
    ConfirmationModal,
    SuccessMessageModal,
    ValidationWarning
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
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
  emits: [
    'update:modelValue',
    'refreshLetters',
    'close',
    'update:editMode'
  ],
  data() {
    return {
      showConfirmModal: false,
      showSuccessMessage: false,
      localLetter: {
        title: '',
        subject: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        sender_name: '',
        sender_position: '',
        recipients: []
      },
      editMode: false,
      // ... rest of your data properties
    }
  },

  created() {
    // Initialize localLetter with props data if available
    if (this.letter) {
      this.localLetter = {
        ...this.letter,
        date: this.letter.date || new Date().toISOString().split('T')[0],
        recipients: this.letter.recipients || []
      }
    }
  },

  methods: {
    resetSelection() {
      this.selectedTemplate = '';
      this.templateName = '';
    },
    // Add method to sync changes back to parent
    updateParent() {
      this.$emit('update:letter', this.localLetter)
    },
    clearError(field) {
      if (this.errors && this.errors[field]) {
        delete this.errors[field]; // Changed from this.$delete to standard delete
      }
    },
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
    }
  },
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
<style scoped>
.type-memo {
  @apply text-blue-600;
}
.type-endorsement {
  @apply text-green-600;
}
.type-invitation_meeting {
  @apply text-purple-600;
}
.type-letter_to_admin {
  @apply text-orange-600;
}
</style>