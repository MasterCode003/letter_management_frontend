<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      <div class="relative bg-white rounded-lg max-w-sm w-full mx-4 p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-4">{{ title }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ message }}</p>
          <div class="flex justify-end gap-3">
            <button
              @click="$emit('update:modelValue', false)"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  props: {
    modelValue: Boolean,
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    }
  },
  emits: ['update:modelValue', 'confirm'],
  methods: {
    handleConfirm() {
      this.$emit('confirm')
      this.$emit('update:modelValue', false)
    }
  }
}
</script>