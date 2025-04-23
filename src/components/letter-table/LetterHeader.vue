<template>
  <div class="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
    <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
    <div v-if="showBackButton" class="flex items-center gap-4">
      <button
        @click="$emit('back')"
        class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2 transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>
  </div>
</template>

<script>
import apiClient from '../../utils/apiClient'  // Changed from '../../../utils/apiClient'

export default {
  name: 'LetterHeader',
  props: {
    title: {
      type: String,
      default: 'Letter Header'
    },
    showBackButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['back']
}
</script>