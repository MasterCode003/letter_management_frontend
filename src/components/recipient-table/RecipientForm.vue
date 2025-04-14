<template>
  <div class="fixed inset-0 z-50 overflow-hidden">
    <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-xl" style="backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);"></div>
    
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white/95 rounded-lg shadow-xl p-6 backdrop-blur-lg border border-white/20 w-full max-w-md relative transform transition-all">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">{{ recipient ? 'Edit Recipient' : 'Add New Recipient' }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Message Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-[60] overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Success!
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ successMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="handleSuccessClose"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              OK
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
      })
    } else {
      // Create new recipient
      response = await apiClient.post('/recipients', {
        name: form.value.name,
        position: form.value.position
      })
    }
    
    emit('save', response.data)
    showSuccessModal.value = true
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
}, 500)

// Success message computed property
const successMessage = computed(() => 
  form.value.id ? 'Recipient has been successfully updated.' : 'New recipient has been successfully added.'
)
</script>
