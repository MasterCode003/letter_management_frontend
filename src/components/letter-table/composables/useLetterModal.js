
import { ref, reactive } from 'vue';
import { Quill } from '@vueup/vue-quill';
import '@/assets/styles/quill-fonts.css';  // Add this import
import apiClient from '@/utils/apiClient';

export default function useLetterModal(props, emit) {
  const defaultForm = {
    title: '',
    type: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    recipients: [{ id: '', name: '', position: '' }],
    content: '',
    sender_name: '',
    sender_position: ''
  };

  const letterForm = reactive(props.letter ? {
    title: props.letter.title || '',
    type: props.letter.type || '',
    subject: props.letter.subject || '',
    date: props.letter.date ? formatDateForInput(props.letter.date) : defaultForm.date,
    recipients: formatRecipients(props.letter.recipients),
    content: props.letter.content || '',
    sender_name: props.letter.sender_name || '',
    sender_position: props.letter.sender_position || ''
  } : { ...defaultForm });

  const errors = reactive({});
  const showConfirmModal = ref(false);
  const showTemplateModal = ref(false);
  const showSuccess = ref(false);
  const recipientsList = ref([]);
  const templateName = ref('');
  const isSubmitting = ref(false);
  const templates = ref([]);
  const selectedTemplate = ref('');
  const isTemplateLoading = ref(false);
  const pdfPreviewIndex = ref(null);

  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [
          '',                  // Default sans-serif
          'arial',             // Sans-serif
          'times-new-roman',   // Serif
          'georgia',           // Serif
          'verdana',          // Sans-serif
          'helvetica'         // Sans-serif
        ] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
      ]
    },
    placeholder: 'Compose your letter...',
    theme: 'snow'
  };

  const initQuill = () => {
    if (Quill) {
      const Font = Quill.import('formats/font');
      Font.whitelist = [
        '',                  // Default sans-serif
        'arial',             // Sans-serif
        'times-new-roman',   // Serif
        'georgia',           // Serif
        'verdana',          // Sans-serif
        'helvetica'         // Sans-serif
      ];
      Quill.register(Font, true);
    }
  };

  // Helper functions
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  function formatRecipients(recipients) {
    if (!recipients) return defaultForm.recipients;
    return Array.isArray(recipients) 
      ? recipients.map(r => ({
          id: r.id || r || '',
          name: r.name || '',
          position: r.position || ''
        }))
      : [{
          id: recipients?.id || recipients || '',
          name: recipients?.name || '',
          position: recipients?.position || ''
        }];
  }

  // Methods
  const clearError = (field) => {
    if (errors[field]) {
      delete errors[field];
    }
  };

  const validateForm = () => {
    Object.keys(errors).forEach(key => delete errors[key]);
    let isValid = true;

    const validTypes = ['Memo', 'Endorsement', 'Invitation Meeting', 'Letter to Admin'];
    if (!letterForm.type || !validTypes.includes(letterForm.type)) {
      errors.type = 'Please select a valid type';
      isValid = false;
    }

    if (!letterForm.title) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!letterForm.subject) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    if (!letterForm.content) {
      errors.content = 'Content is required';
      isValid = false;
    }

    if (!letterForm.sender_name) {
      errors.sender_name = 'Sender name is required';
      isValid = false;
    }

    if (!letterForm.sender_position) {
      errors.sender_position = 'Sender position is required';
      isValid = false;
    }

    if (!letterForm.recipients.some(r => r.id)) {
      errors.recipients = 'At least one recipient is required';
      isValid = false;
    }

    return isValid;
  };

  const fetchRecipients = async () => {
    try {
      const response = await apiClient.get('/recipients');
      recipientsList.value = response.data.data || response.data || [];
      
      if (letterForm.recipients.length > 0) {
        letterForm.recipients = letterForm.recipients.map(recipient => {
          if (!recipient.id) return recipient;
          const foundRecipient = recipientsList.value.find(r => r.id === recipient.id);
          return foundRecipient ? {
            id: foundRecipient.id,
            name: foundRecipient.name,
            position: foundRecipient.position
          } : recipient;
        });
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
      recipientsList.value = [];
      errors.recipients = 'Failed to fetch recipients. Please try again.';
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.get('/templates');
      templates.value = response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      templates.value = [];
    }
  };

  const handleBack = () => {
    Object.keys(errors).forEach(key => delete errors[key]);
    Object.assign(letterForm, defaultForm);
    emit('update:modelValue', false);
    emit('close');
  };

  const handleSubmit = async () => {
    if (isSubmitting.value) return;
    
    if (!validateForm()) return;

    showConfirmModal.value = true;
  };

  const confirmSubmit = async () => {
    try {
      isSubmitting.value = true;
      const payload = {
        ...letterForm,
        recipients: letterForm.recipients
          .map(r => parseInt(r.id, 10))
          .filter(id => !isNaN(id))
      };
      
      const endpoint = props.editMode ? `/letters/${props.letter.id}` : '/letters';
      const method = props.editMode ? 'put' : 'post';
      const response = await apiClient[method](endpoint, payload);
      
      showConfirmModal.value = false;
      
      // Show success message
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        emit('update:modelValue', false);
        emit('close');
      }, 2000); // Show success message for 2 seconds
      
      if (props.editMode) {
        emit('update-letter', response.data);
      } else {
        emit('save-letter', response.data);
      }
      emit('refresh-letters');
    } catch (error) {
      console.error('Error saving letter:', error);
      errors.submit = 'Failed to save letter. Please try again.';
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleQuickSave = () => {
    if (isSubmitting.value) return;
    
    const requiredFields = ['title', 'type', 'subject', 'content', 'sender_name', 'sender_position', 'date'];
    
    requiredFields.forEach(field => {
      if (!letterForm[field]) {
        errors[field] = `The ${field.replace('_', ' ')} field is required.`;
      }
    });
    
    if (Object.keys(errors).length > 0) return;
    
    showTemplateModal.value = true;
  };

  const confirmQuickSave = async () => {
    if (!templateName.value) {
      errors.templateName = 'Template name is required';
      return;
    }

    try {
      isSubmitting.value = true;
      const payload = {
        name: templateName.value,
        ...letterForm,
        recipients: letterForm.recipients
          .filter(r => r && r.id)
          .map(r => ({
            id: r.id,
            name: r.name,
            position: r.position
          }))
      };

      const response = await apiClient.post('/templates', payload);
      await fetchTemplates();
      
      emit('template-saved', response.data);
      
      showTemplateModal.value = false;
      // Show success message
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        emit('update:modelValue', false);
        emit('close');
      }, 2000); // Show success message for 2 seconds
    } catch (error) {
      console.error('Error saving template:', error);
      errors.submit = error.response?.data?.errors || error.response?.data?.error || 'Failed to save template. Please try again.';
    } finally {
      isSubmitting.value = false;
    }
  };

  const updateRecipient = (index, recipientId) => {
    if (!recipientId) return;
    
    // Check if recipient is already selected in another index
    const isDuplicate = letterForm.recipients.some((recipient, idx) => 
      idx !== index && recipient.id === (typeof recipientId === 'string' ? parseInt(recipientId) : recipientId)
    );

    if (isDuplicate) {
      // Optionally, you can set an error message or handle it as needed
      errors.recipients = 'This recipient is already selected';
      return;
    }
    
    const selectedRecipient = recipientsList.value.find(r => 
      r.id === (typeof recipientId === 'string' ? parseInt(recipientId) : recipientId)
    );
    
    if (selectedRecipient) {
      letterForm.recipients[index] = {
        id: selectedRecipient.id,
        name: selectedRecipient.name || '',
        position: selectedRecipient.position || ''
      };
      clearError('recipients');
    }
  };

  const addRecipient = () => {
    letterForm.recipients.push({ id: '', name: '', position: '' });
  };

  const removeRecipient = (index) => {
    if (letterForm.recipients.length > 1) {
      letterForm.recipients.splice(index, 1);
    }
  };

  // Add this new computed property to get filtered recipients list
  const getAvailableRecipients = () => {
    const selectedIds = letterForm.recipients.map(r => r.id).filter(id => id);
    return recipientsList.value.filter(r => !selectedIds.includes(r.id));
  };

  const handleTemplateChange = async (templateId) => {
    if (!templateId) return;
    
    try {
      isTemplateLoading.value = true;
      const response = await apiClient.get(`/templates/${templateId}`);
      const template = response.data.data || response.data;
      
      // Pre-fill all form fields with template data
      letterForm.title = template.title || '';
      letterForm.type = template.type || '';
      letterForm.subject = template.subject || '';
      letterForm.content = template.content || '';
      letterForm.date = template.date ? formatDateForInput(template.date) : defaultForm.date;
      letterForm.sender_name = template.sender_name || '';
      letterForm.sender_position = template.sender_position || '';
      
      // Handle recipients
      if (template.recipients && template.recipients.length > 0) {
        letterForm.recipients = template.recipients.map(r => ({
          id: r.id || '',
          name: r.name || '',
          position: r.position || ''
        }));
      }
      
      // Clear any existing errors
      Object.keys(errors).forEach(key => delete errors[key]);
      
    } catch (error) {
      console.error('Error loading template:', error);
      errors.template = 'Failed to load template. Please try again.';
    } finally {
      isTemplateLoading.value = false;
    }
  };

  return {
    letterForm,
    errors,
    showConfirmModal,
    showTemplateModal,
    showSuccess,
    recipientsList,
    templateName,
    isSubmitting,
    templates,
    selectedTemplate,
    isTemplateLoading,
    pdfPreviewIndex,
    editorOptions,
    clearError,
    validateForm,
    initQuill,
    fetchRecipients,
    fetchTemplates,
    handleBack,
    handleSubmit,
    confirmSubmit,
    handleQuickSave,
    confirmQuickSave,
    updateRecipient,
    addRecipient,
    removeRecipient,
    getAvailableRecipients,
    handleTemplateChange,  // Add this line
  };
}
    