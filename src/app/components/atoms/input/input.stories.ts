import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Atoms/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    valueChange: { action: 'valueChange' },
    focus: { action: 'focus' },
    blur: { action: 'blur' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A themeable input field with label, error, and disabled states. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    value: '',
    disabled: false,
    error: null,
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: '',
    disabled: false,
    error: 'Invalid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    value: '',
    disabled: true,
    error: null,
  },
}; 