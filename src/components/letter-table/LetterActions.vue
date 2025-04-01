<template>
  <div class="flex space-x-3">
    <ActionButton 
      icon="edit" 
      tooltip="Edit"
      @click="$emit('edit', letter)" 
    />
    <ActionButton 
      icon="preview" 
      tooltip="Preview PDF"
      @click="$emit('preview', letter)" 
    />
    <ActionButton 
      icon="download" 
      tooltip="Download PDF"
      @click="$emit('download', letter)" 
    />
    <ActionButton 
      icon="word" 
      tooltip="Export to Word"
      @click="$emit('export-word', letter)" 
    />
    <ActionButton 
      icon="delete" 
      tooltip="Delete"
      @click="$emit('delete', letter.id)"
      variant="danger" 
    />
  </div>
</template>

<script>
import ActionButton from './ActionButton.vue'

export default {
  name: 'LetterActions',
  components: {
    ActionButton
  },
  props: {
    letter: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'preview', 'download', 'export-word', 'delete']  // Add this line to declare emitted events
}
</script>