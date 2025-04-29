import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Atoms/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'orange'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A flexible, themeable button supporting primary, secondary, and orange variants, three sizes, and disabled state. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
    disabled: false,
  },
};

export const Orange: Story = {
  args: {
    label: 'Orange Button',
    variant: 'orange',
    size: 'md',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-button label="Small" size="sm"></app-button>
      <app-button label="Medium" size="md" class="ml-2"></app-button>
      <app-button label="Large" size="lg" class="ml-2"></app-button>
    `,
  }),
}; 