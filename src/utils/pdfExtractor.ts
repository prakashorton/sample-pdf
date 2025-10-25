import { Packer, Document as PDFDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import { FormField } from '../types/form';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromPDF(
  pdfUrl: string,
  fields: FormField[]
): Promise<Record<string, string | boolean>> {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const extractedData: Record<string, string | boolean> = {};

    for (const field of fields) {
      try {
        const pageNum = field.boundingBox.page;
        const page = await pdf.getPage(pageNum);

        // Get page viewport
        const viewport = page.getViewport({ scale: 2 }); // Scale 2 for better OCR

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Extract region based on bounding box
        const scale = viewport.width / 612; // Standard PDF width
        const x = field.boundingBox.x * scale;
        const y = field.boundingBox.y * scale;
        const width = field.boundingBox.width * scale;
        const height = field.boundingBox.height * scale;

        // Create cropped canvas
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        const croppedContext = croppedCanvas.getContext('2d');
        if (!croppedContext) continue;

        croppedContext.drawImage(
          canvas,
          x,
          y,
          width,
          height,
          0,
          0,
          width,
          height
        );

        // Use Tesseract to extract text
        const result = await Tesseract.recognize(croppedCanvas, 'eng');
        const extractedText = result.data.text.trim();

        // Handle different field types
        if (field.type === 'checkbox') {
          // For checkboxes, check if text contains common indicators
          extractedData[field.id] = extractedText.toLowerCase().includes('✓') ||
            extractedText.toLowerCase().includes('x') ||
            extractedText.toLowerCase().includes('checked');
        } else if (field.type === 'number') {
          // Extract numbers only
          const numbers = extractedText.replace(/[^0-9.-]/g, '');
          extractedData[field.id] = numbers || field.value;
        } else {
          extractedData[field.id] = extractedText || field.value;
        }

        console.log(`Extracted ${field.label}: ${extractedData[field.id]}`);
      } catch (error) {
        console.error(`Error extracting ${field.label}:`, error);
        extractedData[field.id] = field.value;
      }
    }

    return extractedData;
  } catch (error) {
    console.error('Error extracting PDF:', error);
    // Return default values if extraction fails
    const defaultData: Record<string, string | boolean> = {};
    fields.forEach((field) => {
      defaultData[field.id] = field.value;
    });
    return defaultData;
  }
}

