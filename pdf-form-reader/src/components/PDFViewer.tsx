import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '../store/formStore';
import { FormField } from '../types/form';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  fields: FormField[];
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, fields }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);
  const focusedFieldId = useFormStore((state) => state.focusedFieldId);
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const pageRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 40;
        setPageWidth(Math.min(width, 800));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (focusedFieldId && fieldRefs.current.has(focusedFieldId)) {
      const fieldElement = fieldRefs.current.get(focusedFieldId);
      if (fieldElement) {
        fieldElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [focusedFieldId]);

  const getFocusedField = () => {
    return fields.find((field) => field.id === focusedFieldId);
  };

  const focusedField = getFocusedField();

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!debugMode || !pageRef.current) return;

    const rect = pageRef.current.getBoundingClientRect();
    const scale = pageWidth / 612;
    const x = Math.round((e.clientX - rect.left) / scale);
    const y = Math.round((e.clientY - rect.top) / scale);

    setClickCoords({ x, y });
    console.log(`Clicked coordinates: x=${x}, y=${y}`);
    console.log(`Bounding box: { x: ${x}, y: ${y}, width: 300, height: 25, page: 1 }`);
  };

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto bg-gray-100 p-4 relative"
    >
      {/* Debug Mode Toggle */}
      <button
        onClick={() => setDebugMode(!debugMode)}
        className={`absolute top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg font-medium transition-colors ${
          debugMode
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {debugMode ? '🔧 Debug ON' : '🔧 Debug OFF'}
      </button>

      {/* Coordinates Display */}
      {debugMode && clickCoords && (
        <div className="absolute top-20 right-6 z-50 bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500">
          <div className="text-sm font-mono">
            <div className="font-bold text-blue-600 mb-2">Click Coordinates:</div>
            <div>x: {clickCoords.x}</div>
            <div>y: {clickCoords.y}</div>
            <div className="mt-2 text-xs text-gray-600">
              Copy this to formSchema.ts:
            </div>
            <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
              {`{ x: ${clickCoords.x}, y: ${clickCoords.y}, width: 300, height: 25, page: 1 }`}
            </div>
          </div>
        </div>
      )}

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center gap-4"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`page_${index + 1}`}
            className={`relative shadow-lg ${debugMode ? 'cursor-crosshair' : ''}`}
            ref={index === 0 ? pageRef : null}
            onClick={handlePageClick}
          >
            <Page
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
            
            {/* Render field bounding boxes */}
            {fields
              .filter((field) => field.boundingBox.page === index + 1)
              .map((field) => {
                const isFocused = field.id === focusedFieldId;
                const scale = pageWidth / 612; // Assuming standard PDF width of 612 points
                
                return (
                  <motion.div
                    key={field.id}
                    ref={(el) => {
                      if (el) fieldRefs.current.set(field.id, el);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isFocused ? 1 : 0.3,
                      scale: isFocused ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`absolute border-2 rounded pointer-events-none ${
                      isFocused
                        ? 'border-blue-500 bg-blue-100 bg-opacity-30 shadow-lg z-10'
                        : 'border-gray-400 bg-gray-200 bg-opacity-20'
                    }`}
                    style={{
                      left: `${field.boundingBox.x * scale}px`,
                      top: `${field.boundingBox.y * scale}px`,
                      width: `${field.boundingBox.width * scale}px`,
                      height: `${field.boundingBox.height * scale}px`,
                    }}
                  >
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap"
                      >
                        {field.label}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
          </div>
        ))}
      </Document>

      {/* Blur overlay for non-focused areas */}
      <AnimatePresence>
        {focusedField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black pointer-events-none"
            style={{ zIndex: 5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

