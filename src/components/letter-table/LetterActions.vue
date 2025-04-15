<template>
  <div class="flex items-center space-x-2">
    <button
      @click="$emit('edit', letter)"
      class="p-1 text-blue-600 hover:text-blue-800"
    >
      <i class="fas fa-edit w-5 h-5"></i>
    </button>

    <button
      @click="showPreviewModal = true"
      class="p-1 text-gray-600 hover:text-gray-800"
    >
      <i class="fas fa-eye w-5 h-5"></i>
    </button>

    <button
      @click="$emit('delete', letter.id)"
      class="p-1 text-red-600 hover:text-red-800"
    >
      <i class="fas fa-trash w-5 h-5"></i>
    </button>

    <!-- Loading Modal -->
    <div v-if="isConverting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center">
        <i class="fas fa-spinner fa-spin text-blue-500 mr-3"></i>
        <span>Converting to Word...</span>
      </div>
    </div>

    <!-- Keep only one set of action buttons -->
    <button
      @click="$emit('edit', letter)"
      class="p-2 text-blue-600 hover:text-blue-800 transition-colors"
      title="Edit"
    >
      <i class="fas fa-pen"></i>
    </button>

    <button
      @click="showPreviewModal = true"
      class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
      title="Preview & Export"
    >
      <i class="fas fa-eye"></i>
    </button>

    <button
      @click="$emit('delete', letter.id)"
      class="p-2 text-red-600 hover:text-red-800 transition-colors"
      title="Delete"
    >
      <i class="fas fa-trash"></i>
    </button>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm" @click="showPreviewModal = false"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Preview Options</h3>
            <div class="space-y-3">
              <button
                @click="handlePreviewPDF"
                class="w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <i class="fas fa-file-pdf text-red-500 mr-3 text-lg"></i>
                <span>Preview as PDF</span>
              </button>
              <button
                @click="handleExportWord"
                class="w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <i class="fas fa-file-word text-blue-500 mr-3 text-lg"></i>
                <span>Export to Word</span>
              </button>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
            <button
              @click="showPreviewModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LetterActions',
  props: {
    letter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showPreviewModal: false,
      isConverting: false
    };
  },
  methods: {
    handlePreviewPDF() {
      this.$emit('preview-pdf', this.letter);
      this.showPreviewModal = false;
    },
    handleExportWord() {
      this.isConverting = true;
      this.$emit('convert-pdf-to-word', this.letter);
      this.showPreviewModal = false;
      
      setTimeout(() => {
        this.isConverting = false;
      }, 10000);
    }
  }
};
</script>