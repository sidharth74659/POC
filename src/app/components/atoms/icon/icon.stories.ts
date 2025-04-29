import type { Meta, StoryObj } from '@storybook/angular';
import { IconComponent, IconName, IconSize } from './icon.component';

const meta: Meta<IconComponent> = {
  title: 'Atoms/Icon',
  component: IconComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { 
      control: 'select', 
      options: [
        'arrow-down', 
        'arrow-up', 
        'check', 
        'close', 
        'info', 
        'warning', 
        'success', 
        'error', 
        'user', 
        'settings'
      ]
    },
    size: { 
      control: 'select', 
      options: ['sm', 'md', 'lg'] 
    },
    color: { control: 'color' }
  },
  parameters: {
    docs: {
      description: {
        component: 'An icon component supporting various SVG icons, sizes, and colors.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<IconComponent>;

export const Default: Story = {
  args: {
    name: 'check',
    size: 'md',
    color: undefined,
  },
};

export const Colored: Story = {
  args: {
    name: 'check',
    size: 'md',
    color: '#3b82f6',
  },
};

export const AllIcons: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; text-align: center;">
        <div>
          <app-icon name="arrow-down"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">arrow-down</p>
        </div>
        <div>
          <app-icon name="arrow-up"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">arrow-up</p>
        </div>
        <div>
          <app-icon name="check"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">check</p>
        </div>
        <div>
          <app-icon name="close"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">close</p>
        </div>
        <div>
          <app-icon name="info"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">info</p>
        </div>
        <div>
          <app-icon name="warning"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">warning</p>
        </div>
        <div>
          <app-icon name="success"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">success</p>
        </div>
        <div>
          <app-icon name="error"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">error</p>
        </div>
        <div>
          <app-icon name="user"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">user</p>
        </div>
        <div>
          <app-icon name="settings"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">settings</p>
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="text-align: center;">
          <app-icon name="check" size="sm"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">Small</p>
        </div>
        <div style="text-align: center;">
          <app-icon name="check" size="md"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">Medium</p>
        </div>
        <div style="text-align: center;">
          <app-icon name="check" size="lg"></app-icon>
          <p style="font-size: 12px; margin-top: 4px;">Large</p>
        </div>
      </div>
    `,
  }),
}; 