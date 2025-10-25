export interface FieldBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'checkbox' | 'select' | 'textarea';
  value: string | boolean;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  boundingBox: FieldBoundingBox;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

