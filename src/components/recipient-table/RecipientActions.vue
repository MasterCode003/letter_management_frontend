<template>
  <div class="flex items-center space-x-2">
    <ActionButton 
      variant="edit" 
      @click="$emit('edit', recipient)" 
      title="Edit Recipient"
      class="p-2 hover:bg-blue-50 rounded-md"
    >
      <PencilIcon class="w-5 h-5 text-blue-600" />
    </ActionButton>
    
    <ActionButton 
      variant="delete" 
      @click="$emit('delete', recipient.id)" 
      title="Delete Recipient"
      class="p-2 hover:bg-red-50 rounded-md"
    >
      <TrashIcon class="w-5 h-5 text-red-600" />
    </ActionButton>
  </div>
</template>

<script>
import ActionButton from '../letter-table/ActionButton.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'RecipientActions',
  components: {
    ActionButton,
    PencilIcon,
    TrashIcon
  },
  props: {
    recipient: {
      type: Object,
      required: true
    }
  }
}
</script>