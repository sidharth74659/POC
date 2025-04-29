import type { Meta, StoryObj } from '@storybook/angular';
import { LabelComponent, LabelVariant, LabelSize } from './label.component';

const meta: Meta<LabelComponent> = {
  title: 'Atoms/Label',
  component: LabelComponent,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    variant: { 
      control: 'select', 
      options: ['default', 'primary', 'success', 'danger', 'warning', 'info'] 
    },
    size: { 
      control: 'select', 
      options: ['sm', 'md', 'lg'] 
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable label component with different variants and sizes. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<LabelComponent>;

export const Default: Story = {
  args: {
    text: 'Default Label',
    variant: 'default',
    size: 'md'
  },
};

export const Primary: Story = {
  args: {
    text: 'Primary Label',
    variant: 'primary',
    size: 'md'
  },
};

export const Success: Story = {
  args: {
    text: 'Success Label',
    variant: 'success',
    size: 'md'
  },
};

export const Danger: Story = {
  args: {
    text: 'Danger Label',
    variant: 'danger',
    size: 'md'
  },
};

export const Warning: Story = {
  args: {
    text: 'Warning Label',
    variant: 'warning',
    size: 'md'
  },
};

export const Info: Story = {
  args: {
    text: 'Info Label',
    variant: 'info',
    size: 'md'
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-label text="Small Label" size="sm"></app-label>
        <app-label text="Medium Label" size="md"></app-label>
        <app-label text="Large Label" size="lg"></app-label>
      </div>
    `,
  }),
}; 