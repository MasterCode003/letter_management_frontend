<template>
  <div class="text-sm text-red-600 mt-1">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'ValidationWarning',
  props: {
    message: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    letter: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'refreshLetters', 'close'],
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleRefresh() {
      this.$emit('refreshLetters')
    }
  }
}
</script>