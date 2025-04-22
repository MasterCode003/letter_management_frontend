import * as pdfjs from 'pdfjs-dist';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const loadPDF = async (pdfData) => {
  try {
    const loadingTask = pdfjs.getDocument(pdfData);
    const pdf = await loadingTask.promise;
    return pdf;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw error;
  }
};

export const renderPage = async (pdf, pageNumber) => {
  try {
    const page = await pdf.getPage(pageNumber);
    return page;
  } catch (error) {
    console.error('Error rendering page:', error);
    throw error;
  }
};