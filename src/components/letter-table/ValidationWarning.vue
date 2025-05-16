<template>
  <p v-if="displayMessage" class="mt-1 text-xs text-red-500">
    {{ displayMessage }}
  </p>
</template>

<script>
export default {
  name: 'ValidationWarning',
  props: {
    message: {
      type: [String, Array],
      required: true
    }
  },
  computed: {
    displayMessage() {
      return Array.isArray(this.message) ? this.message[0] : this.message;
    }
  }
}
</script>