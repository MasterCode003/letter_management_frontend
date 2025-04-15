<template>
  <div>
    <i :class="iconClass"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IconComponent',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['edit', 'preview-download', 'delete'].includes(value)
    }
  },
  computed: {
    iconClass() {
      switch (this.type) {
        case 'edit':
          return 'fas fa-edit text-lg'
        case 'preview-download':
          return 'fas fa-eye text-lg'
        case 'delete':
          return 'fas fa-trash text-lg'
        default:
          return ''
      }
    }
  }
})
</script>