<template>
  <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">{{ editMode ? 'Edit Letter' : 'Create New Letter' }}</h2>
      
      <div class="flex-1 flex justify-center mx-6">
        <div class="flex flex-col w-[600px] bg-white rounded-lg shadow-sm">
          <input
            v-model="letterForm.title"
            :class="{'border-red-500': errors.title}"
            type="text"
            required
            placeholder="Enter letter title"
            class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
          />
          <span v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button
          type="button"
          @click="handleBack"
          class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button
          type="button"
          @click="handleQuickSave"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Quick Save
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ editMode ? 'Update' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LetterHeader',
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['back', 'submit', 'quick-save']
}
</script>