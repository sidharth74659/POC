export interface IFormFieldConfig {
  type: 'input' | 'textarea' | 'select';
  label: string;
  name: string;
  options?: string[];
}

export interface IFormOutputData {
  [key: string]: any;
}
