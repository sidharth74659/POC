import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Settings } from 'lucide-react';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component for displaying content in a contained, elevated surface. Perfect for grouping related information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      description: 'Visual style variant of the card',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the entire card is clickable',
    },
    noPadding: {
      control: 'boolean',
      description: 'Whether to remove default padding from card content',
    },
    onClick: { action: 'card-clicked' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <p>This is a basic card with default styling. It uses subtle shadows to create depth and separation from the background.</p>
        <p>Cards are perfect for organizing related content and actions.</p>
      </div>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'This is a subtitle that provides additional context',
    children: (
      <div>
        <p>This card includes a header with title and subtitle.</p>
        <p>Headers help users quickly understand the card's purpose.</p>
      </div>
    ),
  },
};

export const WithHeaderAction: Story = {
  args: {
    title: 'Settings',
    subtitle: 'Manage your preferences',
    headerAction: (
      <Button variant="ghost" size="small" icon={<Settings />}>
        Configure
      </Button>
    ),
    children: (
      <div>
        <p>This card includes a header action button.</p>
        <p>Use header actions for quick access to card-specific functionality.</p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Confirmation Required',
    children: (
      <p>Are you sure you want to delete this item? This action cannot be undone.</p>
    ),
    footer: (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="tertiary" size="small">
          Cancel
        </Button>
        <Button variant="danger" size="small">
          Delete
        </Button>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Elevated Card',
    children: (
      <div>
        <p>This card uses elevated styling with enhanced shadows.</p>
        <p>Perfect for important content that needs more visual prominence.</p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    title: 'Outlined Card',
    children: (
      <div>
        <p>This card uses a border instead of shadows for definition.</p>
        <p>Great for interfaces where you want less visual depth.</p>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    clickable: true,
    onClick: action('card-clicked'),
    children: (
      <div>
        <p>This entire card is clickable and will show hover effects.</p>
        <p>Click anywhere on the card to trigger the action.</p>
      </div>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    title: 'No Padding Card',
    noPadding: true,
    children: (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Custom Content</h3>
        <p style={{ margin: 0 }}>This card has no default padding, allowing for custom layouts.</p>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      <Card variant="default" title="Default Card">
        <p>Default variant with subtle shadows</p>
      </Card>
      <Card variant="elevated" title="Elevated Card">
        <p>Elevated variant with enhanced shadows</p>
      </Card>
      <Card variant="outlined" title="Outlined Card">
        <p>Outlined variant with border styling</p>
      </Card>
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};