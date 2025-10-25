import React from 'react';
import { PDFViewer } from './components/PDFViewer';
import { DynamicForm } from './components/DynamicForm';
import { bankFormSchema } from './data/formSchema';
import { FileText } from 'lucide-react';

function App() {
  const pdfUrl = '/sample-form.pdf';

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI PDF Form Reader
            </h1>
            <p className="text-sm text-gray-600">
              Interactive form extraction and validation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - PDF Viewer */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-gray-800">
                PDF Document
              </h2>
              <p className="text-sm text-gray-600">
                Fields will highlight as you interact with the form
              </p>
            </div>
            <PDFViewer pdfUrl={pdfUrl} fields={bankFormSchema.fields} />
          </div>
        </div>

        {/* Right Panel - Dynamic Form */}
        <div className="w-1/2">
          <div className="h-full flex flex-col">
            <div className="bg-white px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Form Fields
              </h2>
              <p className="text-sm text-gray-600">
                Focus on a field to see its location in the PDF
              </p>
            </div>
            <DynamicForm
              fields={bankFormSchema.fields}
              title={bankFormSchema.title}
              description={bankFormSchema.description}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
