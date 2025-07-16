export interface FormFieldConfig {
  type: 'input' | 'textarea' | 'select';
  label: string;
  name: string;
  options?: string[];
}

export interface FormOutputData {
  [key: string]: any;
}
