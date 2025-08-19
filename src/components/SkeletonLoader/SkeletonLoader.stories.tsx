import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonLoader } from './SkeletonLoader';
import { Card } from '../Card/Card';

const meta: Meta<typeof SkeletonLoader> = {
  title: 'Components/SkeletonLoader',
  component: SkeletonLoader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Skeleton loaders provide a better user experience during loading states by maintaining the layout structure while content is being fetched.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'button', 'card', 'table'],
      description: 'Type of skeleton loader',
    },
    width: {
      control: 'text',
      description: 'Custom width (CSS value)',
    },
    height: {
      control: 'text',
      description: 'Custom height (CSS value)',
    },
    lines: {
      control: 'number',
      description: 'Number of lines for text variant',
    },
    animationDuration: {
      control: 'text',
      description: 'Animation duration (CSS time value)',
    },
  },
} satisfies Meta<typeof SkeletonLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: 'text',
    lines: 3,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: '64px',
    height: '64px',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '100px',
  },
};

export const Button: Story = {
  args: {
    variant: 'button',
  },
};

export const Card: Story = {
  args: {
    variant: 'card',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Table: Story = {
  args: {
    variant: 'table',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SkeletonLoader variant="button" width="80px" height="32px" />
      <SkeletonLoader variant="button" width="120px" height="40px" />
      <SkeletonLoader variant="button" width="140px" height="48px" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loaders with custom dimensions to match different button sizes.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', width: '800px' }}>
      <Card title="Text Loading" variant="outlined">
        <SkeletonLoader variant="text" lines={4} />
      </Card>
      <Card title="Card Loading" variant="outlined">
        <SkeletonLoader variant="card" />
      </Card>
      <Card title="Profile Loading" variant="outlined" noPadding>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <SkeletonLoader variant="circular" width="48px" height="48px" />
            <div style={{ flex: 1 }}>
              <SkeletonLoader variant="text" lines={2} />
            </div>
          </div>
          <SkeletonLoader variant="text" lines={3} />
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common loading state patterns using skeleton loaders in different contexts.',
      },
    },
  },
};