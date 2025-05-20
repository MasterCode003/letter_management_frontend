<template>
  <div class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'SuccessMessageModal',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>