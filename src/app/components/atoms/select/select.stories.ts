import type { Meta, StoryObj } from '@storybook/angular';
import { SelectComponent, SelectOption } from './select.component';

const meta: Meta<SelectComponent> = {
  title: 'Atoms/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    options: { control: 'object' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    valueChange: { action: 'valueChange' }
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable select dropdown component with label, options, error, and disabled states. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<SelectComponent>;

const demoOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Disabled Option', value: 'option4', disabled: true }
];

export const Default: Story = {
  args: {
    label: 'Select Field',
    placeholder: 'Choose an option',
    options: demoOptions,
    value: '',
    disabled: false,
    error: null
  },
};

export const WithValue: Story = {
  args: {
    label: 'Select Field',
    placeholder: 'Choose an option',
    options: demoOptions,
    value: 'option2',
    disabled: false,
    error: null
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select your country',
    options: demoOptions,
    value: '',
    disabled: false,
    error: 'This field is required'
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select your country',
    options: demoOptions,
    value: '',
    disabled: true,
    error: null
  },
}; 