<template>
  <div class="editor-container">
    <QuillEditor
      v-model:content="content"
      contentType="html"
      :toolbar="toolbarOptions"
      theme="snow"
      @update:content="handleContentChange"
      ref="quillEditor"
    />
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: this.modelValue,
      toolbarOptions: [
        ['bold', 'italic', 'underline'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue !== this.content) {
        this.content = newValue;
      }
    }
  },
  methods: {
    handleContentChange(content) {
      this.$emit('update:modelValue', content);
      this.$emit('content-change', content);
    },
    setContent(content) {
      this.content = content;
    },
    getContent() {
      return this.content;
    }
  }
}
</script>

<style>
.editor-container {
  width: 100%;
  margin-bottom: 20px;
}

.ql-editor {
  min-height: 200px;
}

/* Ensure editor content matches PDF output */
.ql-editor p {
  margin-bottom: 1em;
}

.ql-editor strong {
  font-weight: bold;
}
</style>