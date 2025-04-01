<template>
  <button
    :class="buttonClasses"
    :title="tooltip"
    @click="$emit('click')"
  >
    <!-- Edit Icon -->
    <svg v-if="icon === 'edit'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    
    <!-- Preview Icon -->
    <svg v-if="icon === 'preview'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>

    <!-- Download Icon -->
    <svg v-if="icon === 'download'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>

    <!-- Word Export Icon -->
    <svg v-if="icon === 'word'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>

    <!-- Delete Icon -->
    <svg v-if="icon === 'delete'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    icon: {
      type: String,
      required: true,
      validator: function(value) {
        return ['edit', 'preview', 'download', 'word', 'delete'].includes(value)
      }
    },
    tooltip: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    buttonClasses() {
      return [
        'p-2 rounded-full transition-colors duration-200',
        this.variant === 'danger' ? 'hover:bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
      ]
    }
  },
  emits: ['click']
}
</script>