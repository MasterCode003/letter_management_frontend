import html2pdf from 'html2pdf.js';

export const generatePDF = async (content) => {
  // Create a container and apply content with proper styling
  const container = document.createElement('div');
  container.className = 'pdf-content';
  
  // Create an inner wrapper for the content
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'content-wrapper';
  contentWrapper.innerHTML = content;
  container.appendChild(contentWrapper);
  
  const opt = {
    margin: [20, 20],
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      windowWidth: 1024,
      scrollY: 0,
      scrollX: 0,
      logging: true,
      allowTaint: true,
      foreignObjectRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      putOnlyUsedFonts: true,
      compress: false
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    .pdf-content {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .content-wrapper {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .content-wrapper p {
      margin-bottom: 1em;
      page-break-inside: avoid;
    }
    .content-wrapper strong, 
    .content-wrapper b {
      font-weight: 700;
      display: inline-block;
    }
    .content-wrapper * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  `;
  document.head.appendChild(style);

  try {
    // Ensure content is fully rendered before generating PDF
    await new Promise(resolve => setTimeout(resolve, 100));
    await html2pdf().set(opt).from(container).save();
  } finally {
    style.remove();
  }
};