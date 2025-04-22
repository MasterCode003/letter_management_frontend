<template>
  <div class="pdf-viewer">
    <div ref="pdfContainer" class="pdf-container"></div>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist';

export default {
  name: 'PDFViewer',
  props: {
    pdfUrl: {
      type: String,
      required: true
    },
    scale: {
      type: Number,
      default: 1.5
    }
  },
  async mounted() {
    try {
      // Set worker path
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
      const pdf = await loadingTask.promise;
      
      // Get all pages
      const numPages = pdf.numPages;
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: this.scale });

        // Create canvas for each page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Add canvas to container
        this.$refs.pdfContainer.appendChild(canvas);

        // Get text content
        const textContent = await page.getTextContent();
        
        // Render page
        await page.render({
          canvasContext: context,
          viewport: viewport,
          textLayer: {
            textContent,
            viewport
          }
        }).promise;
      }
    } catch (error) {
      console.error('Error displaying PDF:', error);
    }
  }
}
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  overflow: auto;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

canvas {
  max-width: 100%;
  height: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>