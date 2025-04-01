<template>
  <button
    :class="[
      'px-2 py-1 rounded-md text-sm font-medium',
      variant === 'edit' ? 'text-blue-600 hover:bg-blue-50' : '',
      variant === 'preview' ? 'text-gray-600 hover:bg-gray-50' : '',
      variant === 'download' ? 'text-green-600 hover:bg-green-50' : '',
      variant === 'export' ? 'text-indigo-600 hover:bg-indigo-50' : '',
      variant === 'delete' ? 'text-red-600 hover:bg-red-50' : ''
    ]"
    @click="$emit('click')"
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
      default: 'edit',
      validator: function(value) {
        return ['edit', 'preview', 'download', 'export', 'delete'].includes(value)
      }
    }
  }
}
</script>