<template>
  <div class="fixed inset-0 z-50 overflow-hidden">
    <!-- Enhanced blur background -->
    <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-xl" style="backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);"></div>
    
    <!-- Modal container -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white/95 rounded-lg shadow-xl p-6 backdrop-blur-lg border border-white/20 w-full max-w-md relative transform transition-all">
        <!-- Existing form content remains unchanged -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Add New Recipient</h2>
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
              v-model="recipientForm.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Removed email field -->

          <div>
            <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
            <input
              id="department"
              v-model="recipientForm.department"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')" <!-- Ensure this line emits the close event -->
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
  </div>
</template>

<script>
import axios from 'axios';
import { debounce } from 'lodash';

export default {
  data() {
    return {
      recipientForm: {
        name: '',
        department: ''
      }
    };
  },
  methods: {
    handleSubmit: debounce(async function() {
      try {
        const response = await axios.post('http://192.168.5.15:8000/api/recipients', this.recipientForm, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        });
        this.$emit('save-recipient', response.data);
        this.recipientForm = { name: '', department: '' };
        this.$emit('close');
      } catch (error) {
        console.error('Save failed:', error);
        let errorMessage = 'Error saving recipient. ';
        if (error.code === 'ERR_NETWORK') {
          errorMessage += 'Cannot connect to the server. Please verify:\n' +
            '1. The server is running at 192.168.5.15:8000\n' +
            '2. Your network connection is stable\n' +
            '3. No firewall is blocking the connection';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage += 'Request timed out. Server is taking too long to respond.';
        } else if (error.response) {
          errorMessage += error.response.data.message || 'Please try again.';
        }
        alert(errorMessage);
      }
    }, 1000)
  }
};
</script>
