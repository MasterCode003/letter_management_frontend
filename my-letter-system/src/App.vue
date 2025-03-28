<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Navigation Tabs -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex space-x-4">
          <button
            @click="activeTab = 'letters'"
            :class="[
              'px-4 py-2 rounded-md',
              activeTab === 'letters'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            Letters
          </button>
          <button
            @click="activeTab = 'recipients'"
            :class="[
              'px-4 py-2 rounded-md',
              activeTab === 'recipients'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            Recipients
          </button>
        </div>
      </div>

      <!-- Letters Tab -->
      <div v-show="activeTab === 'letters'">
        <LetterTable
          @edit-letter="handleEditLetter"
          @delete-letter="handleDeleteLetter"
        />
      </div>

      <!-- Recipients Tab -->
      <div v-show="activeTab === 'recipients'" class="space-y-4">
        <div>
          <RecipientTable
            :recipients="recipients"
            @edit-recipient="handleEditRecipient"
            @delete-recipient="handleDeleteRecipient"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import LetterTable from './components/LetterTable.vue'
import RecipientTable from './components/RecipientTable.vue'

const activeTab = ref('letters')
const recipients = ref([])

// Add this to provide recipient data to LetterTable
provide('recipients', recipients.value)

// Define necessary methods
function handleEditLetter(letter) {
  // Logic for editing a letter
}

function handleDeleteLetter(letterId) {
  // Logic for deleting a letter
}

function handleEditRecipient(recipient) {
  // Logic for editing a recipient
}

function handleDeleteRecipient(recipientId) {
  // Logic for deleting a recipient
}
</script>
