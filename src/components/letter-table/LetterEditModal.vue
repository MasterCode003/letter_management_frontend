<template>
  <div>
    <!-- Add error display container -->
    <div v-if="errors.length" class="bg-red-50 text-red-700 p-4 mb-4 rounded-md">
      <div v-for="(error, index) in errors" :key="index" class="text-sm">
        {{ error }}
      </div>
    </div>
    
    <Transition name="modal">
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
        }
      },
      watch: {
        letter: {
          handler(newVal) {
            if (newVal) {
              console.log('Letter data:', newVal);
              
              // Parse recipients if they're in string format
              let recipientsArray = [];
              try {
                recipientsArray = typeof newVal.recipients === 'string' 
                  ? JSON.parse(newVal.recipients) 
                  : newVal.recipients || [];
              } catch (e) {
                console.error('Error parsing recipients:', e);
                recipientsArray = newVal.recipients || [];
              }
  
              // Map the recipients to include both ID and full recipient data
              const mappedRecipients = recipientsArray.map(recipient => {
                // Find the matching recipient from available recipients
                const matchedRecipient = this.recipients.find(r => 
                  r.id === recipient.id || 
                  r.name === recipient.name
                );
                
                return {
                  id: recipient.id || matchedRecipient?.id,
                  name: recipient.name || matchedRecipient?.name,
                  position: recipient.position || matchedRecipient?.position
                };
              });
  
              this.formData = {
                ...newVal,
                recipients: mappedRecipients.length > 0 ? mappedRecipients : []
              };
              
              console.log('Mapped recipients:', this.formData.recipients);
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
        updateRecipient(index, selectedRecipient) {
          // Remove this method
        },
        // Keep other methods
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
              // Transform error object to array of messages
              this.errors = Object.values(error.response.data.errors).flat();
            } else {
              this.errors = ['An error occurred while saving the letter'];
            }
          }
        }
      }
    </Transition>
  </div>
</template>

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