<template>
  <div class="fixed inset-0 z-50 overflow-hidden">
    <!-- Improved backdrop with more blur and opacity -->
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-2xl transition-opacity"></div>
    
    <div class="flex items-center justify-center min-h-screen p-4">
      <!-- Enhanced modal container with gradient border and glass effect -->
      <div class="bg-white/95 rounded-xl shadow-2xl p-8 backdrop-blur-xl border border-white/30 w-full max-w-md relative transform transition-all overflow-hidden">
        <!-- Decorative gradient background -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pointer-events-none"></div>
        
        <!-- Header with improved styling -->
        <div class="relative flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {{ recipient ? 'Edit Recipient' : 'Add New Recipient' }}
          </h2>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Enhanced form with better spacing and animations -->
        <form @submit.prevent="handleSubmit" class="space-y-6 relative">
          <!-- Name field with floating label -->
          <div class="relative group">
            <label 
              for="name" 
              class="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600"
            >
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter recipient's full name"
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white/50 backdrop-blur-sm"
            />
          </div>

          <!-- Position field with floating label -->
          <div class="relative group">
            <label 
              for="position" 
              class="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600"
            >
              Position
            </label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              required
              placeholder="Enter recipient's position"
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white/50 backdrop-blur-sm"
            />
          </div>

          <!-- Action buttons with improved styling -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ recipient ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal (now inside RecipientForm) -->
    <ConfirmationModal
      :show="showConfirmModal"
      :title="recipient ? 'Confirm Update' : 'Confirm Save'"
      :message="recipient ? 'Are you sure you want to update this recipient?' : 'Are you sure you want to save this new recipient?'"
      @confirm="handleConfirmSave"
      @cancel="handleCancelSave"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import apiClient from '@/utils/apiClient'
import ConfirmationModal from '../letter-table/modals/ConfirmationModal.vue' // Import ConfirmationModal

const props = defineProps({
  recipient: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  id: null,
  name: '',
  position: ''
})

// State for the internal confirmation modal
const showConfirmModal = ref(false)
const pendingFormData = ref(null)

watch(() => props.recipient, (newRecipient) => {
  if (newRecipient) {
    form.value = {
      id: newRecipient.id,
      name: newRecipient.name || '',
      position: newRecipient.position || ''
    }
  } else {
    form.value = {
      id: null,
      name: '',
      position: ''
    }
  }
}, { immediate: true })

const handleSubmit = debounce(async () => {
  // Always show confirmation modal before emitting save
  pendingFormData.value = { ...form.value } // Store current form data
  showConfirmModal.value = true
  // Do NOT emit 'save' yet
}, 300)

// Handle confirmation from the internal modal
const handleConfirmSave = () => {
  if (pendingFormData.value) {
    emit('save', pendingFormData.value) // Emit save after confirmation
    // Parent (RecipientTable) will handle API call, refresh, success, and closing the form
  }
  // Reset confirmation state
  showConfirmModal.value = false
  pendingFormData.value = null
}

// Handle cancellation from the internal modal
const handleCancelSave = () => {
  // Reset confirmation state
  showConfirmModal.value = false
  pendingFormData.value = null
  // Form remains open
}

</script>

<style scoped>
/* Your styles here */
</style>
