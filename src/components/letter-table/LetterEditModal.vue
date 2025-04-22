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
      
      <!-- Enhanced Recipients Section -->
      <div class="space-y-4 mt-4">
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">FOR:</label>
            <button
              @click="addRecipient"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Recipient
            </button>
          </div>
          
          <div class="space-y-2">
            <div 
              v-for="(recipient, index) in formData.recipients" 
              :key="index"
              class="relative flex items-center gap-2"
            >
              <div class="flex-1">
                <select
                  v-model="formData.recipients[index].id"
                  @change="updateRecipient(index, $event.target.value)"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="" disabled>Select Recipient</option>
                  <option
                    v-for="availableRecipient in availableRecipients"
                    :key="availableRecipient.id"
                    :value="availableRecipient.id"
                  >
                    {{ availableRecipient.name }} - {{ availableRecipient.position }}
                  </option>
                </select>
                
                <!-- Display selected recipient details -->
                <div v-if="formData.recipients[index].id" class="mt-2 text-sm text-gray-600">
                  <p class="font-medium">{{ formData.recipients[index].name }}</p>
                  <p class="text-gray-500">{{ formData.recipients[index].position }}</p>
                </div>
              </div>
              
              <button
                @click="removeRecipient(index)"
                class="inline-flex items-center p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                :disabled="formData.recipients.length === 1"
                :class="{ 'opacity-50 cursor-not-allowed': formData.recipients.length === 1 }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
  mounted() {
    // Initialize recipients data when component mounts
    this.initializeRecipients();
  },
  methods: {
    initializeRecipients() {
      if (this.letter?.recipients?.length) {
        this.formData.recipients = this.letter.recipients.map(r => ({
          id: r.id || '',
          name: r.name || '',
          position: r.position || ''
        }));
      } else {
        this.formData.recipients = [{ id: '', name: '', position: '' }];
      }
    },
    updateRecipient(index, recipientId) {
      const selectedRecipient = this.recipients.find(r => r.id.toString() === recipientId.toString());
      if (selectedRecipient) {
        // Use Vue.set to ensure reactivity
        this.$set(this.formData.recipients, index, {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        });
      }
    },
    addRecipient() {
      const availableCount = this.availableRecipients.length;
      const currentCount = this.formData.recipients.length;
      
      if (currentCount < availableCount) {
        this.formData.recipients.push({ id: '', name: '', position: '' });
      }
    },
    removeRecipient(index) {
      if (this.formData.recipients.length > 1) {
        this.formData.recipients.splice(index, 1);
      }
    },
    close() {
      this.$emit('update:show', false);
    },
    async handleSubmit() {
      try {
        if (!this.formData) {
          throw new Error('Form data is required');
        }
        
        const formattedData = {
          ...this.formData,
          recipients: this.formData.recipients.filter(r => r.id && r.name)
        };
        
        this.errors = [];
        await this.$emit('save', formattedData);
        this.close();
      } catch (error) {
        console.error('Submit error:', error);
        if (error.response?.data?.errors) {
          this.errors = Object.values(error.response.data.errors).flat();
        } else {
          this.errors = [error.message || 'An error occurred while saving the letter'];
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
  },
  computed: {
    availableRecipients() {
      const allRecipients = this.recipients || [];
      const selectedIds = this.formData.recipients
        .filter(r => r.id)
        .map(r => r.id.toString());

      return allRecipients.filter(recipient => {
        const recipientId = recipient.id.toString();
        return !selectedIds.includes(recipientId) || 
          this.formData.recipients.some(r => r.id.toString() === recipientId);
      });
    }
  },
  watch: {
    recipients: {
      immediate: true,
      handler(newRecipients) {
        if (newRecipients?.length && !this.letter?.id) {
          // Only initialize if this is a new letter
          this.initializeRecipients();
        }
      }
    },
    
    letter: {
      immediate: true,
      handler(newLetter) {
        if (newLetter) {
          const recipients = newLetter.recipients || [];
          this.formData = {
            ...newLetter,
            recipients: recipients.length > 0 
              ? recipients.map(r => ({
                  id: r.id || '',
                  name: r.name || '',
                  position: r.position || ''
                }))
              : [{ id: '', name: '', position: '' }]
          };
        }
      }
    }
  }
};
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

/* Add these new styles */
.recipient-select {
  transition: all 0.2s ease-in-out;
}

.recipient-select:hover {
  border-color: #60A5FA;
}

.recipient-remove-button {
  transition: all 0.2s ease-in-out;
}

.recipient-remove-button:hover {
  background-color: #FEE2E2;
}
</style>