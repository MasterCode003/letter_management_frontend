<template>
  <div>
    <!-- Add error display container -->
    <div v-if="errors.length" class="bg-red-50 text-red-700 p-4 mb-4 rounded-md">
      <div v-for="(error, index) in errors" :key="index" class="text-sm">
        {{ error }}
      </div>
    </div>
    
    <div class="modal">
      <!-- Add the back button inside the template -->
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
      
      <!-- Add recipient fields -->
      <div class="space-y-4 mt-4">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">FOR:</label>
          <button
            type="button"
            @click="addRecipient"
            class="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Add Recipient
          </button>
        </div>

        <div v-for="(recipient, index) in formData.recipients" :key="index" class="flex gap-2">
          <div class="flex-1">
            <div v-if="recipient.name" class="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <span class="text-sm text-gray-700">
                {{ recipient.name }} - {{ recipient.position }}
              </span>
              <button
                type="button"
                @click="removeRecipient(index)"
                class="text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
            <select
              v-else
              v-model="recipient.id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              @change="updateRecipient(index, recipient.id)"
            >
              <option value="">Select Recipient</option>
              <option 
                v-for="availableRecipient in availableRecipients" 
                :key="availableRecipient.id"
                :value="availableRecipient.id"
              >
                {{ availableRecipient.name }} - {{ availableRecipient.position }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Rest of your modal content -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'LetterEditModal',
  props: {
    show: Boolean,
    letter: {
      type: Object,
      default: () => ({})
    },
    recipients: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      errors: [], // Add errors array
      formData: {
        title: '',
        type: '',
        recipients: [{ id: '', name: '', position: '' }],
        subject: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        sender_name: '',
        sender_position: ''
      }
    }
  },
  computed: {
    editMode() {
      return !!this.letter?.id
    },
    availableRecipients() {
      // Get all recipients from props and log for debugging
      console.log('All recipients from props:', this.recipients);
      console.log('Current formData recipients:', this.formData.recipients);

      const allRecipients = this.recipients || [];
      const selectedIds = this.formData.recipients
        .filter(r => r.id)
        .map(r => r.id);

      // Return all recipients that are either not selected or currently being edited
      return allRecipients.filter(recipient => {
        const isSelected = selectedIds.includes(recipient.id);
        const isBeingEdited = this.formData.recipients.some(r => r.id === recipient.id);
        return !isSelected || isBeingEdited;
      });
    }
  },
  watch: {
    letter: {
      handler(newVal) {
        if (newVal) {
          let recipients = newVal.recipients || [];
          
          // Ensure recipients is an array and has the correct structure
          recipients = Array.isArray(recipients) ? recipients : [recipients];
          
          this.formData = {
            ...newVal,
            recipients: recipients.length > 0 
              ? recipients.map(r => ({
                  id: r.id,
                  name: r.name || '',
                  position: r.position || ''
                }))
              : [{ id: '', name: '', position: '' }]
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    addRecipient() {
      this.formData.recipients.push({ id: '', name: '', position: '' });
    },
    removeRecipient(index) {
      this.formData.recipients.splice(index, 1);
      if (this.formData.recipients.length === 0) {
        this.formData.recipients.push({ id: '', name: '', position: '' });
      }
    },
    updateRecipient(index, recipientId) {
      const selectedRecipient = this.recipients.find(r => r.id === recipientId);
      if (selectedRecipient) {
        this.formData.recipients[index] = {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        };
      }
    },
    close() {
      this.$emit('update:show', false);
    },
    async handleSubmit() {
      try {
        const formattedData = {
          ...this.formData,
          recipients: this.formData.recipients
        };
        
        // Clear previous errors
        this.errors = [];
        const response = await this.$emit('save', formattedData);
        
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = Object.values(error.response.data.errors).flat();
        } else {
          this.errors = ['An error occurred while saving the letter'];
        }
      }
    },
    handleBack() {
      this.errors = [];
      this.formData = {
        title: '',
        type: '',
        recipients: [{ id: '', name: '', position: '' }],
        subject: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        sender_name: '',
        sender_position: ''
      };
      this.close();
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>