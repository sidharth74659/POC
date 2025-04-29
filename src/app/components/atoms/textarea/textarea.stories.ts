import type { Meta, StoryObj } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';

const meta: Meta<TextareaComponent> = {
  title: 'Atoms/Textarea',
  component: TextareaComponent,
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
        component: 'A themeable textarea field with label, error, and disabled states. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<TextareaComponent>;

export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    value: '',
    disabled: false,
    error: null,
  },
};

export const Error: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Enter your feedback',
    value: '',
    disabled: false,
    error: 'Feedback is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter your notes',
    value: '',
    disabled: true,
    error: null,
  },
}; 