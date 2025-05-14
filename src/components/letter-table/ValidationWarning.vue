<template>
  <div class="text-sm text-red-600 mt-1">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'ValidationWarning',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>