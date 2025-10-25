import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import { FormField } from '../types/form';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Helper function to enhance image quality for better OCR
function enhanceImageQuality(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply contrast enhancement and convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply contrast enhancement (increase difference between light and dark)
    const enhanced = gray < 128 ? Math.max(0, gray - 30) : Math.min(255, gray + 30);

    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Helper function to clean OCR artifacts
function cleanOCRText(text: string, fieldType: string): string {
  // Remove common OCR artifacts
  let cleaned = text
    .replace(/[|!]/g, 'l') // Replace pipes and exclamation marks with 'l'
    .replace(/[0O]/g, 'O') // Normalize O and 0
    .replace(/[1l]/g, 'l') // Normalize 1 and l
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Remove special characters that are likely OCR errors
  if (fieldType === 'text' || fieldType === 'email') {
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s@.\-_]/g, '');
  }

  return cleaned;
}

// Debug function to log extraction progress
export async function debugPDFText(pdfUrl: string) {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);

    // Render page to canvas
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    console.log('PDF rendered to canvas for OCR');
    return canvas;
  } catch (error) {
    console.error('Error debugging PDF:', error);
    return null;
  }
}

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

        // Render page to canvas with higher scale for better OCR
        const scale = 3; // Higher scale for better OCR accuracy
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Calculate scaled coordinates
        const scaledX = field.boundingBox.x * scale;
        const scaledY = field.boundingBox.y * scale;
        const scaledWidth = field.boundingBox.width * scale;
        const scaledHeight = field.boundingBox.height * scale;

        // Create cropped canvas for the field region
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = scaledWidth;
        croppedCanvas.height = scaledHeight;
        const croppedContext = croppedCanvas.getContext('2d');
        if (!croppedContext) continue;

        croppedContext.drawImage(
          canvas,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight,
          0,
          0,
          scaledWidth,
          scaledHeight
        );

        // Enhance image quality before OCR
        const enhancedCanvas = enhanceImageQuality(croppedCanvas);

        // Use Tesseract OCR to extract text with optimized settings
        console.log(`Extracting ${field.label} using OCR...`);
        const result = await Tesseract.recognize(enhancedCanvas, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing') {
              console.log(`  OCR progress: ${(m.progress * 100).toFixed(0)}%`);
            }
          },
          config: {
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
          },
        });

        let extractedText = result.data.text.trim();
        const confidence = result.data.confidence;

        console.log(`  OCR Result: "${extractedText}" (confidence: ${confidence}%)`);

        // Clean up OCR artifacts
        extractedText = cleanOCRText(extractedText, field.type);

        // Handle different field types
        if (field.type === 'checkbox') {
          // For checkboxes, check if text contains common indicators
          extractedData[field.id] = extractedText.toLowerCase().includes('✓') ||
            extractedText.toLowerCase().includes('x') ||
            extractedText.toLowerCase().includes('checked') ||
            extractedText.toLowerCase().includes('yes') ||
            confidence > 50;
        } else if (field.type === 'number') {
          // Extract numbers only
          const numbers = extractedText.replace(/[^0-9.-]/g, '');
          extractedData[field.id] = numbers || field.value;
        } else if (field.type === 'date') {
          // Clean up date format - try to parse common date formats
          const cleanedDate = extractedText.replace(/[^0-9/-]/g, '');
          extractedData[field.id] = cleanedDate || field.value;
        } else {
          // For text fields, use the extracted text if confidence is reasonable
          extractedData[field.id] = extractedText || field.value;
        }

        console.log(`✓ Extracted ${field.label}: "${extractedData[field.id]}"`);
      } catch (error) {
        console.error(`✗ Error extracting ${field.label}:`, error);
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

