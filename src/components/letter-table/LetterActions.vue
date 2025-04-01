<template>
  <div class="flex items-center space-x-2">
    <!-- Action Buttons -->
    <ActionButton variant="edit" @click="handleEdit" title="Edit Letter">
      <EditIcon />
    </ActionButton>

    <ActionButton 
      variant="preview" 
      @click="showPreviewOptions = true" 
      title="Preview & Download"
      :disabled="isLoading"
    >
      <PreviewDownloadIcon v-if="!isLoading" />
      <LoadingSpinner v-else />
    </ActionButton>

    <ActionButton variant="delete" @click="showDeleteConfirm = true" title="Delete Letter">
      <DeleteIcon />
    </ActionButton>

    <!-- Modals -->
    <Teleport to="body">
      <PreviewOptionsModal 
        v-if="showPreviewOptions"
        @close="showPreviewOptions = false"
        @preview="handlePreview"
        @download="handleDownload"
      />

      <DeleteConfirmationModal
        v-if="showDeleteConfirm"
        @confirm="handleDelete"
        @cancel="showDeleteConfirm = false"
      />

      <SuccessMessageModal
        v-if="showSuccess"
        :message="successMessage"
        @close="showSuccess = false"
      />
      
      <LetterModal
        v-if="showEditModal"
        :letter="props.letter"
        @close="showEditModal = false"
        @update-letter="handleUpdateLetter"
        @refresh-letters="handleRefreshLetters"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// Add this at the top of the script section
declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ActionButton: typeof import('./ActionButton.vue').default
    PreviewOptionsModal: typeof import('./modals/PreviewOptionsModal.vue').default
    DeleteConfirmationModal: typeof import('./modals/DeleteConfirmationModal.vue').default
    SuccessMessageModal: typeof import('./modals/SuccessMessageModal.vue').default
    LetterModal: typeof import('./LetterModal.vue').default
  }
}
import { ref, PropType, onMounted, onBeforeUnmount } from 'vue'  // <-- Add lifecycle hooks here
import ActionButton from './ActionButton.vue'
import PreviewOptionsModal from './modals/PreviewOptionsModal.vue'
import DeleteConfirmationModal from './modals/DeleteConfirmationModal.vue'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import LetterModal from './LetterModal.vue'
import {
  EditIcon,
  PreviewDownloadIcon,
  DeleteIcon
} from './icons'

// Type Definitions
interface Letter {
  id: number
  title: string
  content: string
  date?: string
  type?: string
  subject?: string
  recipients?: string | Array<{name: string, position?: string}>
}

type DownloadType = 'pdf' | 'word'

// Props
const props = defineProps({
  letter: {
    type: Object as PropType<Letter>,
    required: true,
    validator: (value: unknown): value is Letter => {
      const letter = value as Letter
      return typeof letter?.id === 'number' &&
             typeof letter?.title === 'string' &&
             typeof letter?.content === 'string'
    }
  }
})

// Emits
const emit = defineEmits<{
  (e: 'preview', letter: Letter): void
  (e: 'download', letter: Letter): void
  (e: 'export-word', letter: Letter): void
  (e: 'edit', letter: Letter): void
  (e: 'delete', id: number): void
  (e: 'update', letter: Letter): void
  (e: 'refresh'): void
}>()

// Reactive State
const showDeleteConfirm = ref(false)
const showPreviewOptions = ref(false)
const showSuccess = ref(false)
const showEditModal = ref(false)
const successMessage = ref('')

// Methods
const showSuccessMessage = (message: string, duration = 2000) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    successMessage.value = ''
  }, duration)
}

const handleEdit = () => {
  showEditModal.value = true
}

const handleUpdateLetter = (updatedLetter: Letter) => {
  emit('update', updatedLetter)
  showSuccessMessage('Letter updated successfully!')
}

const handleRefreshLetters = () => {
  emit('refresh')
}

const handlePreview = () => {
  emit('preview', props.letter)
  showPreviewOptions.value = false
}

const handleDelete = async () => {
  try {
    emit('delete', props.letter.id)
    showDeleteConfirm.value = false
    showSuccessMessage('Letter deleted successfully!')
  } catch (error) {
    console.error('Error deleting letter:', error)
    showSuccessMessage('Failed to delete letter. Please try again.', 3000)
  }
}

const handleDownload = async (type: DownloadType) => {
  try {
    if (type === 'pdf') {
      emit('download', props.letter)
    } else if (type === 'word') {
      await handleExport()
    }
    showPreviewOptions.value = false
    showSuccessMessage(`Letter exported as ${type.toUpperCase()} successfully!`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error downloading as ${type}:`, errorMessage)
    showSuccessMessage(`Failed to download as ${type}. Please try again.`, 3000)
  }
}

const createHtmlContent = (title: string, content: string): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .letter-content { 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background: white;
        }
      </style>
    </head>
    <body>
      <div class="letter-content">
        ${content}
      </div>
    </body>
  </html>
`

// Add to reactive state
const isLoading = ref(false)

// Update handleExport with loading state
const handleExport = async (): Promise<void> => {
  isLoading.value = true
  try {
    const { title, content } = props.letter
    if (!title || !content) {
      throw new Error('Letter title or content is missing')
    }
    
    const fullHtmlContent = createHtmlContent(title, content)
    const blob = new Blob([fullHtmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.replace(/[/\\?%*:|"<>]/g, '-')}.docx`
    
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error exporting to Word:', errorMessage)
    throw error
  } finally {
    isLoading.value = false
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      // Handle new nodes here
    }
  })
})

onMounted(() => {
  // Replace deprecated DOMNodeInserted with:
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})

onBeforeUnmount(() => {
  observer.disconnect()
})
</script>