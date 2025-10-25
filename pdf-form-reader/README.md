# 🚀 AI PDF Form Reader

An interactive React application that reads filled PDF forms and provides a synchronized viewing and editing experience with AI-powered field extraction.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Vite](https://img.shields.io/badge/Vite-7-646cff)

## ✨ Features

### Core Functionality
- **📄 PDF Display**: Renders PDF documents with field highlighting
- **📝 Dynamic Form**: AI-extracted fields as interactive inputs
- **🔄 Focus Sync**: Real-time PDF highlighting when form fields are focused
- **🎯 10+ Field Types**: Text, number, email, date, select, checkbox, textarea, and more
- **💾 State Management**: Zustand for efficient global state
- **✅ Validation**: Zod-based real-time form validation

### Bonus Features
- **🎨 Smooth Animations**: Framer Motion for polished transitions
- **🎯 Visual Emphasis**: Blur overlay on non-focused areas
- **📱 Responsive Design**: Adapts to different screen sizes
- **⚡ Real-time Feedback**: Instant validation and error messages
- **🎭 Modern UI**: Clean interface with TailwindCSS

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| PDF Rendering | react-pdf + pdfjs-dist |
| State Management | Zustand |
| Styling | TailwindCSS v4 |
| Animations | Framer Motion |
| Validation | Zod |
| Icons | Lucide React |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd pdf-form-reader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:5173
   ```

## 📖 Usage

### Interacting with the Application

1. **View the PDF**: The left panel displays the PDF document with field overlays
2. **Fill the Form**: The right panel shows dynamically generated form fields
3. **Focus Sync**: Click on any form field to see it highlighted in the PDF
4. **Validation**: Real-time validation with error messages
5. **Submit**: Click "Submit Application" to validate and submit the form

### Supported Field Types

| Type | Example | Validation |
|------|---------|------------|
| Text | Full Name | Pattern matching |
| Number | Account Number | Min/max values |
| Email | Email Address | Email format |
| Date | Date of Birth | Date format |
| Select | Account Type | Required selection |
| Checkbox | Terms Acceptance | Boolean |
| Textarea | Address | Multi-line text |

## 🏗️ Project Structure

```
pdf-form-reader/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── PDFViewer.tsx    # PDF display with highlighting
│   │   └── DynamicForm.tsx  # Form generator
│   ├── data/
│   │   └── formSchema.ts    # AI-generated schema
│   ├── store/
│   │   └── formStore.ts     # Zustand store
│   ├── types/
│   │   └── form.ts          # TypeScript types
│   └── App.tsx              # Main component
├── public/
│   └── sample-form.pdf      # Sample PDF
└── package.json
```

## 🎯 Key Features Explained

### 1. PDF Viewer with Highlighting
```typescript
// Automatically highlights and scrolls to focused fields
<PDFViewer pdfUrl="/sample-form.pdf" fields={formSchema.fields} />
```

### 2. Dynamic Form Generation
```typescript
// Renders form based on JSON schema
<DynamicForm 
  fields={formSchema.fields}
  title="Bank Account Application"
  description="Complete this form..."
/>
```

### 3. State Management
```typescript
// Zustand store for form state
const { formData, setFieldValue, focusedFieldId } = useFormStore();
```

### 4. Validation
```typescript
// Zod-based validation
validateField: (field, value) => {
  if (field.required && !value) return "Required";
  if (field.validation?.pattern) { /* validate pattern */ }
  return null;
}
```

## 🎨 Customization

### Adding New Fields

Edit `src/data/formSchema.ts`:

```typescript
{
  id: "newField",
  name: "newField",
  label: "New Field Label",
  type: "text",
  value: "",
  boundingBox: { x: 120, y: 700, width: 300, height: 25, page: 1 },
  validation: { pattern: "...", message: "..." }
}
```

### Changing the PDF

Replace `public/sample-form.pdf` with your PDF and update bounding boxes in the schema.

### Styling

Modify `tailwind.config.js` or component styles to customize the appearance.

## 📊 Performance

- ⚡ Fast initial load with Vite
- 🔄 Efficient re-renders with Zustand
- 🎨 Optimized animations with Framer Motion
- 📦 Code splitting and lazy loading

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please check the [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for detailed documentation.

## 🎉 Acknowledgments

- React PDF for PDF rendering
- Zustand for state management
- Framer Motion for animations
- TailwindCSS for styling
- Lucide for icons

---

**Made with ❤️ using React + TypeScript + Vite**

