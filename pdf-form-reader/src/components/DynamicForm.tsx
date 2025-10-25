import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFormStore } from '../store/formStore';
import { FormField } from '../types/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { z } from 'zod';

interface DynamicFormProps {
  fields: FormField[];
  title: string;
  description: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  title,
  description,
}) => {
  const {
    formData,
    setFieldValue,
    setFocusedField,
    errors,
    setError,
    clearError,
    initializeForm,
    validateField,
  } = useFormStore();

  useEffect(() => {
    initializeForm(fields);
  }, [fields, initializeForm]);

  const handleFieldChange = (field: FormField, value: string | boolean) => {
    setFieldValue(field.id, value);
    
    // Validate field
    const error = validateField(field, value);
    if (error) {
      setError(field.id, error);
    } else {
      clearError(field.id);
    }
  };

  const handleFieldFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  const handleFieldBlur = () => {
    // Delay clearing focus to allow for smooth transitions
    setTimeout(() => {
      setFocusedField(null);
    }, 200);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] ?? field.value;
    const error = errors[field.id];

    const commonProps = {
      id: field.id,
      name: field.name,
      onFocus: () => handleFieldFocus(field.id),
      onBlur: handleFieldBlur,
      required: field.required,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value as string}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={value as string}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            value={value as string}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={error ? 'border-red-500' : ''}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              {...commonProps}
              checked={value as boolean}
              onCheckedChange={(checked) => handleFieldChange(field, checked)}
            />
            <Label
              htmlFor={field.id}
              className="text-sm font-normal cursor-pointer"
            >
              {field.label}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    let hasErrors = false;
    fields.forEach((field) => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        setError(field.id, error);
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! Check console for data.');
    } else {
      alert('Please fix the errors before submitting.');
    }
  };

  return (
    <div className="h-full overflow-auto bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="space-y-2"
            >
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
              )}
              
              {renderField(field)}
              
              {errors[field.id] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors[field.id]}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Submit Application
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

