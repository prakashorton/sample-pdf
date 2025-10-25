# 📘 Usage Guide - AI PDF Form Reader

## Getting Started

### Step 1: Launch the Application

```bash
cd pdf-form-reader
npm run dev
```

Open your browser to `http://localhost:5173`

### Step 2: Understanding the Interface

The application has two main panels:

#### Left Panel - PDF Viewer
- Displays the PDF document
- Shows field bounding boxes
- Highlights focused fields
- Auto-scrolls to active fields

#### Right Panel - Dynamic Form
- Shows extracted form fields
- Allows data entry and editing
- Displays validation errors
- Provides submit functionality

## 🎯 Interactive Features

### 1. Focus Synchronization

**How it works:**
1. Click on any form field in the right panel
2. The corresponding field in the PDF will:
   - Highlight with a blue border
   - Display a label above it
   - Scroll into view automatically
   - Blur the surrounding area for emphasis

**Try it:**
- Click on "Full Name" field
- Watch the PDF scroll and highlight the name field
- Click on "Email Address"
- See the PDF update to show the email field

### 2. Form Validation

**Real-time validation includes:**

| Field | Validation Rule | Example Error |
|-------|----------------|---------------|
| Full Name | Letters and spaces only | "Name should only contain letters" |
| Account Number | 10 digits | "Account number must be 10 digits" |
| Email | Valid email format | "Please enter a valid email" |
| Initial Deposit | Minimum $100 | "Minimum deposit is $100" |
| Terms Checkbox | Must be checked | "Terms acceptance is required" |

**Try it:**
1. Clear the "Full Name" field
2. Try to submit - see the error message
3. Enter numbers in the name field
4. See the validation error appear

### 3. Field Types Demonstration

#### Text Input
- **Fields**: Full Name, Phone Number
- **Features**: Pattern validation, required checks

#### Number Input
- **Fields**: Account Number, Initial Deposit
- **Features**: Min/max validation, numeric only

#### Email Input
- **Field**: Email Address
- **Features**: Email format validation

#### Date Input
- **Field**: Date of Birth
- **Features**: Date picker, format validation

#### Select Dropdown
- **Field**: Account Type
- **Features**: Multiple options (Savings, Checking, Business, Student)

#### Checkbox
- **Fields**: Terms Acceptance, Marketing Consent
- **Features**: Boolean toggle, required validation

#### Textarea
- **Field**: Residential Address
- **Features**: Multi-line input, character limit

## 🎨 Visual Features

### Animations

**Field Highlighting:**
- Smooth scale animation when focused
- Blue border with shadow
- Label appears above field

**Form Fields:**
- Sequential fade-in on page load
- Smooth transitions on focus/blur
- Error messages slide in

**Background Blur:**
- Fades in when a field is focused
- Emphasizes the active field
- Fades out when focus is lost

### Color Coding

| Color | Meaning |
|-------|---------|
| Blue | Focused/Active field |
| Red | Validation error |
| Gray | Inactive/Default state |
| Green | Success (future feature) |

## 📝 Form Submission

### Steps to Submit

1. **Fill all required fields** (marked with *)
2. **Ensure all validations pass** (no red error messages)
3. **Click "Submit Application"** button
4. **Check console** for submitted data (in development)

### What Happens on Submit

```javascript
// Current behavior (development)
- Validates all fields
- Shows alert if errors exist
- Logs data to console if valid
- Displays success message

// Future behavior (production)
- Send data to backend API
- Generate filled PDF
- Save to database
- Send confirmation email
```

## 🔧 Customization Guide

### Changing Form Data

Edit `src/data/formSchema.ts`:

```typescript
export const bankFormSchema: FormSchema = {
  title: "Your Form Title",
  description: "Your description",
  fields: [
    {
      id: "customField",
      name: "customField",
      label: "Custom Field",
      type: "text",
      value: "Default value",
      boundingBox: { x: 120, y: 200, width: 300, height: 25, page: 1 }
    }
  ]
};
```

### Adding Validation Rules

```typescript
{
  id: "email",
  // ... other properties
  validation: {
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    message: "Please enter a valid email address"
  }
}
```

### Adjusting PDF Field Positions

The bounding box coordinates are relative to the PDF:

```typescript
boundingBox: {
  x: 120,      // Left position (pixels from left)
  y: 180,      // Top position (pixels from top)
  width: 300,  // Field width
  height: 25,  // Field height
  page: 1      // PDF page number
}
```

## 🐛 Troubleshooting

### PDF Not Loading

**Problem**: PDF doesn't appear in left panel

**Solutions**:
1. Check if `sample-form.pdf` exists in `public/` folder
2. Verify PDF URL in `App.tsx`
3. Check browser console for errors
4. Ensure pdf.js worker is loading correctly

### Fields Not Highlighting

**Problem**: Clicking form fields doesn't highlight PDF

**Solutions**:
1. Check bounding box coordinates in schema
2. Verify PDF page number matches
3. Ensure Zustand store is working
4. Check browser console for errors

### Validation Not Working

**Problem**: Form submits with invalid data

**Solutions**:
1. Check validation rules in schema
2. Verify Zod patterns are correct
3. Ensure `validateField` function is called
4. Check error state in Zustand store

## 💡 Tips & Tricks

### Best Practices

1. **Always fill required fields first** (marked with *)
2. **Watch for real-time validation** messages
3. **Use tab key** to navigate between fields
4. **Check PDF highlighting** to verify field locations
5. **Review all data** before submitting

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Enter | Submit form (when focused on submit button) |
| Esc | Clear focus (blur current field) |

### Performance Tips

1. **Close other browser tabs** for better performance
2. **Use latest browser version** for best compatibility
3. **Clear browser cache** if experiencing issues
4. **Disable browser extensions** if PDF doesn't load

## 📊 Understanding the Data Flow

```
User Action (Focus Field)
    ↓
Zustand Store Updates (setFocusedField)
    ↓
PDFViewer Reacts (useFormStore hook)
    ↓
PDF Field Highlights (Framer Motion animation)
    ↓
Smooth Scroll (scrollIntoView)
    ↓
Visual Feedback (blur overlay, label)
```

## 🎓 Learning Resources

### Understanding the Code

1. **React Hooks**: `useState`, `useEffect`, `useRef`
2. **Zustand**: Global state management
3. **Framer Motion**: Animation library
4. **React PDF**: PDF rendering
5. **Zod**: Schema validation

### Recommended Reading

- [React Documentation](https://react.dev)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com)

## 🚀 Next Steps

### For Users
1. Explore all field types
2. Test validation rules
3. Try different data inputs
4. Observe PDF synchronization

### For Developers
1. Review the codebase
2. Understand component structure
3. Explore state management
4. Customize for your needs

---

**Need Help?** Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for technical details or [README.md](./README.md) for quick reference.

