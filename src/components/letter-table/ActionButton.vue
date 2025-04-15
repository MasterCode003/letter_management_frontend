<template>
  <button 
    :class="[
      'inline-flex items-center justify-center rounded',
      'w-8 h-8 mx-1',
      variantClasses[variant]
    ]"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    variant: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    variantClasses() {
      return {
        edit: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        preview: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        delete: 'bg-red-50 text-red-600 hover:bg-red-100',
        default: 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }
    }
  }
}
</script>

<style scoped>
/* Remove fixed width/height from CSS since we're using Tailwind classes */
</style>