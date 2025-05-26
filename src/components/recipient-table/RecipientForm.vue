<template>
  <div class="fixed inset-0 z-50 overflow-hidden">
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-2xl transition-opacity"></div>
    
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white/95 rounded-xl shadow-2xl p-8 backdrop-blur-xl border border-white/30 w-full max-w-md relative transform transition-all overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pointer-events-none"></div>
        
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

        <form @submit.prevent="handleSubmit" class="space-y-6 relative">
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
              :class="{'border-red-500': errors.name}"
              placeholder="Enter recipient's full name"
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white/50 backdrop-blur-sm"
              @input="clearError('name')"
            />
            <ValidationWarning v-if="errors.name" :message="errors.name" />
          </div>

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
              :class="{'border-red-500': errors.position}"
              placeholder="Enter recipient's position"
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white/50 backdrop-blur-sm"
              @input="clearError('position')"
            />
            <ValidationWarning v-if="errors.position" :message="errors.position" />
          </div>

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
import ConfirmationModal from '../letter-table/modals/ConfirmationModal.vue'
import ValidationWarning from '@/components/common/ValidationWarning.vue'  // Add this import

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

// Add errors state
const errors = ref({})

// Update handleSubmit to include validation
const handleSubmit = debounce(async () => {
  errors.value = {}
  
  // Validate fields
  if (!form.value.name) {
    errors.value.name = 'Name is required'
    return
  }
  if (!form.value.position) {
    errors.value.position = 'Position is required'
    return
  }

  pendingFormData.value = { ...form.value }
  showConfirmModal.value = true
}, 300)

// Add clearError function
const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// Add these two functions after the clearError function
const handleConfirmSave = () => {
  if (pendingFormData.value) {
    emit('save', pendingFormData.value)
  }
  showConfirmModal.value = false
  pendingFormData.value = null
}

const handleCancelSave = () => {
  showConfirmModal.value = false
  pendingFormData.value = null
}
</script>

<style scoped>
/* Your styles here */
</style>
