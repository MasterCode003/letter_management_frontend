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

    <!-- Enhanced Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-[60] overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
        <div class="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-auto transform transition-all">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Success!</h3>
              <p class="mt-1 text-sm text-gray-500">{{ successMessage }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              type="button"
              @click="handleSuccessClose"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'  // Add computed import
import debounce from 'lodash/debounce'
import apiClient from '@/utils/apiClient'

const props = defineProps({
  recipient: {
    type: Object,
    default: () => null  // Change to function
  }
})

const emit = defineEmits(['close', 'save'])

// Initialize form with default values and include id for updates
const form = ref({
  id: null,
  name: '',
  position: ''
})

// Update watch to handle id and null cases
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

const showSuccessModal = ref(false)

const handleSubmit = debounce(async () => {
  try {
    let response;
    if (form.value.id) {
      // Update existing recipient
      response = await apiClient.put(`/recipients/${form.value.id}`, {
        name: form.value.name,
        position: form.value.position
      });
    } else {
      // Create new recipient
      response = await apiClient.post('/recipients', {
        name: form.value.name,
        position: form.value.position
      });
    }
    emit('save', response.data);
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Save failed:', error)
    let errorMessage = props.recipient ? 'Error updating recipient. ' : 'Error creating recipient. '
    
    if (error.code === 'ECONNABORTED') {
      errorMessage += 'Request timed out. Please try again.'
    } else if (error.response?.status === 422) {
      errorMessage += 'Please check your input data.'
    } else if (error.response?.status === 500) {
      errorMessage += 'Server error. Please try again later.'
    } else {
      errorMessage += 'Please check your network connection and try again.'
    }
    
    alert(errorMessage)
  }
}, 300);

// Success message computed property
const successMessage = computed(() => 
  form.value.id ? 'Recipient has been successfully updated.' : 'New recipient has been successfully added.'
)
</script>
