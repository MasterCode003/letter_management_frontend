<template>
  <div class="flex items-center space-x-2">
    <!-- Edit Button with new icon -->
    <ActionButton 
      variant="edit" 
      @click="$emit('edit', recipient)" 
      title="Edit Recipient"
      class="group relative hover:bg-blue-600 hover:text-white transition-colors duration-200 p-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 transform transition-transform group-hover:scale-110">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"></path>
          <path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3"></path>
          <path d="M16 5l3 3"></path>
        </g>
      </svg>
    </ActionButton>
    
    <!-- Delete Button with new trash icon -->
    <ActionButton 
      variant="delete" 
      @click="showDeleteConfirm = true"
      title="Delete Recipient"
      class="group relative hover:bg-red-600 hover:text-white transition-colors duration-200 p-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6 transform transition-transform group-hover:scale-110">
        <rect x="32" y="48" width="448" height="80" rx="32" ry="32" fill="currentColor"></rect>
        <path d="M74.45 160a8 8 0 0 0-8 8.83l26.31 252.56a1.5 1.5 0 0 0 0 .22A48 48 0 0 0 140.45 464h231.09a48 48 0 0 0 47.67-42.39v-.21l26.27-252.57a8 8 0 0 0-8-8.83zm248.86 180.69a16 16 0 1 1-22.63 22.62L256 318.63l-44.69 44.68a16 16 0 0 1-22.63-22.62L233.37 296l-44.69-44.69a16 16 0 0 1 22.63-22.62L256 273.37l44.68-44.68a16 16 0 0 1 22.63 22.62L278.62 296z" fill="currentColor"></path>
      </svg>
    </ActionButton>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Success Message Modal -->
    <SuccessMessageModal
      v-if="showSuccessMessage"
      message="Recipient deleted successfully!"
      @close="showSuccessMessage = false"
    />
  </div>
</template>

<script>
import ActionButton from '../letter-table/ActionButton.vue'
import ConfirmationModal from '../letter-table/modals/ConfirmationModal.vue'
import SuccessMessageModal from '../letter-table/modals/SuccessMessageModal.vue'

export default {
  name: 'RecipientActions',
  components: {
    ActionButton,
    ConfirmationModal,
    SuccessMessageModal
  },
  props: {
    recipient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDeleteConfirm: false,
      showSuccessMessage: false
    }
  },
  methods: {
    async handleDelete() {
      this.$emit('delete', this.recipient.id)
      this.showDeleteConfirm = false
      this.showSuccessMessage = true
      setTimeout(() => {
        this.showSuccessMessage = false
      }, 3000) // Hide success message after 3 seconds
    }
  }
}
</script>