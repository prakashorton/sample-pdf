import { create } from 'zustand';
import { FormField } from '../types/form';

interface FormStore {
  formData: Record<string, string | boolean>;
  focusedFieldId: string | null;
  errors: Record<string, string>;
  
  setFieldValue: (fieldId: string, value: string | boolean) => void;
  setFocusedField: (fieldId: string | null) => void;
  setError: (fieldId: string, error: string) => void;
  clearError: (fieldId: string) => void;
  initializeForm: (fields: FormField[]) => void;
  validateField: (field: FormField, value: string | boolean) => string | null;
}

export const useFormStore = create<FormStore>((set, get) => ({
  formData: {},
  focusedFieldId: null,
  errors: {},

  setFieldValue: (fieldId, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [fieldId]: value,
      },
    }));
  },

  setFocusedField: (fieldId) => {
    set({ focusedFieldId: fieldId });
  },

  setError: (fieldId, error) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [fieldId]: error,
      },
    }));
  },

  clearError: (fieldId) => {
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[fieldId];
      return { errors: newErrors };
    });
  },

  initializeForm: (fields) => {
    const initialData: Record<string, string | boolean> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.value;
    });
    set({ formData: initialData, errors: {} });
  },

  validateField: (field, value) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation;

      if (field.type === 'number' && typeof value === 'string') {
        const numValue = parseFloat(value);
        if (min !== undefined && numValue < min) {
          return message || `Minimum value is ${min}`;
        }
        if (max !== undefined && numValue > max) {
          return message || `Maximum value is ${max}`;
        }
      }

      if (pattern && typeof value === 'string') {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return message || 'Invalid format';
        }
      }
    }

    return null;
  },
}));

