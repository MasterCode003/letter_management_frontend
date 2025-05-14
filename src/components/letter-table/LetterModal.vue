<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Main modal content -->
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" />
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          
          <!-- Header Section -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">Edit Letter</h2>
              
              <!-- Title Input -->
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <input
                    v-model="letterForm.title"
                    :class="{'border-red-500': errors.title}"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                    @input="clearError('title')"
                  />
                  <ValidationWarning v-if="errors.title" :message="errors.title" />
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  @click="handleBack"
                  class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2 transition-all"
                >
                  <ArrowLeftIcon />
                  Back
                </button>
                <button
                  type="submit"
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <CheckIcon />
                  Update
                </button>
                <button
                  type="button"
                  @click="handleQuickSave"
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <BookmarkIcon />
                  {{ editMode ? 'Update Template' : 'Save as Template' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Content Section -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <form @submit.prevent="handleSubmit" class="space-y-8">
                <!-- Form fields remain the same -->
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Modals -->
  <SuccessMessageModal 
    v-if="showSuccess"
    message="Letter saved successfully!"
    @close="closeModal"
  />
  
  <ConfirmationModal
    v-if="showConfirmModal"
    title="Confirm Update"
    message="Are you sure you want to update this letter?"
    confirm-text="Update"
    @confirm="confirmSubmit"
    @cancel="showConfirmModal = false"
  />
  
  <TemplateModal
    v-if="showTemplateModal"
    v-model="templateName"
    @confirm="confirmQuickSave"
    @cancel="showTemplateModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import apiClient from '../../utils/apiClient.js'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import ValidationWarning from '../common/ValidationWarning.vue'
import ConfirmationModal from './modals/ConfirmationModal.vue'
import {
  ArrowLeftIcon,
  CheckIcon,
  BookmarkIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

// Interfaces
interface Person {
  id: string
  name: string
  position: string
}

interface Template {
  id: string
  name: string
  content: string
}

interface LetterForm {
  title: string
  type: string
  subject: string
  date: string
  recipients: Person[]
  content: string
  sender_name: string
  sender_position: string
}

// Props and Emits
const props = defineProps<{
  modelValue: boolean
  letter?: LetterForm
  editMode?: boolean
}>()

const emit = defineEmits([
  'update:modelValue',
  'close',
  'save-letter',
  'update-letter',
  'refresh-letters',
  'update:editMode'
])

// Reactive State
const letterForm = ref<LetterForm>(initializeForm())
const errors = ref<Record<string, string>>({})
const recipientsList = ref<Person[]>([])
const templates = ref<Template[]>([])
const selectedTemplate = ref('')
const templateName = ref('')
const isSubmitting = ref(false)
const isTemplateLoading = ref(false)
const showSuccess = ref(false)
const showConfirmModal = ref(false)
const showTemplateModal = ref(false)
const pdfPreviewIndex = ref<number | null>(null)

// Editor Configuration
const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean']
    ]
  },
  theme: 'snow'
}

// Computed Properties
const filteredRecipientsList = computed(() => {
  const selectedIds = letterForm.value.recipients
    .filter(r => r.id)
    .map(r => r.id)
  return recipientsList.value.filter(r => !selectedIds.includes(r.id))
})

// Lifecycle Hooks
onMounted(async () => {
  await Promise.all([fetchCSRFToken(), fetchRecipients(), fetchTemplates()])
})

// Methods
function initializeForm(): LetterForm {
  return props.letter ? {
    ...props.letter,
    date: formatDate(props.letter.date),
    recipients: normalizeRecipients(props.letter.recipients)
  } : { ...defaultForm() }
}

function defaultForm(): LetterForm {
  return {
    title: '',
    type: 'Memo',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    recipients: [{ id: '', name: '', position: '' }],
    content: '',
    sender_name: '',
    sender_position: ''
  }
}

function normalizeRecipients(recipients: Person[] | Person): Person[] {
  if (!recipients) return [defaultRecipient()]
  return Array.isArray(recipients) 
    ? recipients.map(normalizeRecipient)
    : [normalizeRecipient(recipients)]
}

function normalizeRecipient(recipient?: Person | string): Person {
  if (!recipient) return defaultRecipient()
  return typeof recipient === 'string' 
    ? { id: recipient, name: '', position: '' }
    : recipient
}

function defaultRecipient(): Person {
  return { id: '', name: '', position: '' }
}

function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toISOString().split('T')[0]
  const date = new Date(dateString)
  return isNaN(date.getTime()) 
    ? new Date().toISOString().split('T')[0]
    : date.toISOString().split('T')[0]
}

async function fetchCSRFToken() {
  await apiClient.get('/sanctum/csrf-cookie')
}

async function fetchRecipients() {
  try {
    const { data } = await apiClient.get('/api/recipients')
    recipientsList.value = data.data
  } catch (error) {
    console.error('Error fetching recipients:', error)
  }
}

async function fetchTemplates() {
  try {
    const { data } = await apiClient.get('/templates')
    templates.value = data.data || []
  } catch (error) {
    console.error('Error fetching templates:', error)
  }
}

// Methods
async function confirmSubmit() {
  try {
    isSubmitting.value = true;
    showConfirmModal.value = false;
    
    const formData = {
      title: letterForm.value.title,
      type: letterForm.value.type,
      subject: letterForm.value.subject,
      date: letterForm.value.date,
      content: letterForm.value.content,
      sender_name: letterForm.value.sender_name,
      sender_position: letterForm.value.sender_position,
      recipients: letterForm.value.recipients
        .filter(r => r.id)
        .map(r => ({
          id: r.id,
          name: r.name,
          position: r.position
        }))
    };

    // Always use POST method for LetterModal
    const response = await apiClient.post('/letters', formData);

    emit('refresh-letters');
    showSuccess.value = true;
    setTimeout(() => {
      closeModal();
    }, 1500);
    
  } catch (error) {
    console.error('Error submitting letter:', error);
    errors.value = error.response?.data?.errors || {};
    errors.value.submit = error.response?.data?.message || 'Failed to save letter';
  } finally {
    isSubmitting.value = false;
  }
}

async function confirmQuickSave() {
  try {
    isSubmitting.value = true;
    showTemplateModal.value = false;

    const formData = {
      name: templateName.value,
      type: letterForm.value.type,
      subject: letterForm.value.subject,
      date: letterForm.value.date,
      content: letterForm.value.content,
      sender_name: letterForm.value.sender_name,
      sender_position: letterForm.value.sender_position,
      recipients: letterForm.value.recipients
        .filter(r => r.id)
        .map(r => ({
          id: r.id,
          name: r.name,
          position: r.position
        }))
    };

    // Use POST for template creation
    const response = await apiClient.post('/templates', formData);
    
    const newTemplate = response.data?.data || response.data;
    templates.value = [
      ...templates.value,
      {
        id: newTemplate.id,
        name: newTemplate.name,
        content: newTemplate.content
      }
    ];

    templateName.value = '';
    showSuccess.value = true;
    setTimeout(() => closeModal(), 1500);
  } catch (error) {
    console.error('Template save error:', error);
    errors.value.submit = error.response?.data?.message || 'Template save failed';
  } finally {
    isSubmitting.value = false;
  }
}

function defaultForm(): LetterForm {
  return {
    title: '',
    type: 'Memo',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    recipients: [{ id: '', name: '', position: '' }],
    content: '',
    sender_name: '',
    sender_position: ''
  }
}

function normalizeRecipients(recipients: Person[] | Person): Person[] {
  if (!recipients) return [defaultRecipient()]
  return Array.isArray(recipients) 
    ? recipients.map(normalizeRecipient)
    : [normalizeRecipient(recipients)]
}

function normalizeRecipient(recipient?: Person | string): Person {
  if (!recipient) return defaultRecipient()
  return typeof recipient === 'string' 
    ? { id: recipient, name: '', position: '' }
    : recipient
}

function defaultRecipient(): Person {
  return { id: '', name: '', position: '' }
}

function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toISOString().split('T')[0]
  const date = new Date(dateString)
  return isNaN(date.getTime()) 
    ? new Date().toISOString().split('T')[0]
    : date.toISOString().split('T')[0]
}

async function fetchCSRFToken() {
  await apiClient.get('/sanctum/csrf-cookie')
}

async function fetchRecipients() {
  try {
    const { data } = await apiClient.get('/api/recipients')
    recipientsList.value = data.data
  } catch (error) {
    console.error('Error fetching recipients:', error)
  }
}

async function fetchTemplates() {
  try {
    const { data } = await apiClient.get('/templates')
    templates.value = data.data || []
  } catch (error) {
    console.error('Error fetching templates:', error)
  }
}
</script>