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
              <div class="flex flex-col w-[600px] bg-white rounded-lg shadow-sm">
                <input
                  v-model="formData.title"
                  :class="{'border-red-500': errors && errors.includes('title')}"
                  type="text"
                  required
                  placeholder="Enter letter title"
                  class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                />
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
            </div>
          </div>
        </div>

        <!-- Content with updated styling -->
        <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
          <div class="bg-white rounded-xl shadow-sm p-8">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <!-- Rest of your form fields remain the same but with updated styling -->
              <!-- Letter Type -->
              <div class="flex items-center gap-4">
                <label class="font-medium w-24 text-lg">Type:</label>
                <div class="flex flex-col">
                  <div class="relative">
                    <select
                      v-model="formData.type"
                      required
                      class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                    >
                      <option value="Memo">Memo</option>
                      <option value="Business Letter">Business Letter</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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

                <!-- Recipients Section -->
                <div v-for="(recipient, index) in formData.recipients" :key="index" class="flex items-center gap-4 ml-24">
                  <div class="flex-1">
                    <select
                      v-model="recipient.id"
                      class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                      @change="updateRecipient(index, $event.target?.value)"
                    >
                      <option value="">Select Recipient</option>
                      <option 
                        v-for="r in availableRecipients" 
                        :key="r.id" 
                        :value="r.id"
                      >
                        {{ r.name }} - {{ r.position }}
                      </option>
                    </select>
                    <!-- Display selected recipient info -->
                    <div v-if="recipient.name && recipient.position" class="mt-1 text-sm text-gray-600">
                      Selected: {{ recipient.name }} - {{ recipient.position }}
                    </div>
                  </div>
                  <button
                    v-if="formData.recipients.length > 1"
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
                    v-model="formData.subject"
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
                    v-model="formData.date"
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
                    v-model:content="formData.content"
                    contentType="html"
                    theme="snow"
                    :options="editorOptions"
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
                      v-model="formData.sender_name"
                      placeholder="Enter sender's name"
                      class="w-full border rounded-md px-4 py-2"
                    />
                  </div>
                  <div class="flex flex-col space-y-2">
                    <label class="text-base font-medium">Position/Title</label>
                    <input
                      type="text"
                      v-model="formData.sender_position"
                      placeholder="Enter sender's position"
                      class="w-full border rounded-md px-4 py-2"
                    />
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
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import axios from 'axios'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import { editorOptions } from './editorOptions';

export default {
  name: 'LetterEditModal',
  components: {
    QuillEditor,
    SuccessMessageModal
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
    recipients: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showConfirmModal: false,
      showSuccess: false,
      isSubmitting: false,
      errors: [], // Initialize errors array
      editorOptions: editorOptions, // Add this line
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
      const response = await axios.get('http://192.168.5.68:8000/api/recipients', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      // Handle both direct array response and nested data property
      this.recipientsList = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || [];
        
    } catch (error) {
      console.error('Error fetching recipients:', error);
      this.recipientsList = [];
    }
  },

  computed: {
    availableRecipients() {
      // Ensure we always return an array
      return Array.isArray(this.recipientsList) 
        ? this.recipientsList.map(recipient => ({
            ...recipient,
            id: recipient.id?.toString() || ''
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
            // Format date for date picker
            date: newLetter.date ? new Date(newLetter.date).toISOString().split('T')[0] : '',
            // Ensure recipients are properly formatted
            recipients: newLetter.recipients?.length 
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
    // Add these methods for recipient management
    addRecipient() {
      this.formData.recipients.push({ id: '', name: '', position: '' });
    },

    removeRecipient(index) {
      if (this.formData.recipients.length > 1) {
        this.formData.recipients.splice(index, 1);
      }
    },

    updateRecipient(index, recipientId) {
      // Fix recipient lookup to use availableRecipients instead of props.recipients
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

        let response;
        if (this.editMode) {
          response = await axios.put(`/letters/${this.letter.id}/`, formData);
        } else {
          response = await axios.post('/letters/', formData);
        }

        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.$emit('update:modelValue', false);
        }, 1500);

      } catch (error) {
        console.error('Error submitting letter:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
/* CSS content only - no HTML */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Add smooth transitions */
button {
  transition: all 0.2s ease-in-out;
}

input, select, textarea {
  transition: border-color 0.2s ease-in-out;
}

.recipient-select:hover {
  border-color: #3B82F6;
}

.recipient-remove-button:hover {
  background-color: #FEE2E2;
}
</style>