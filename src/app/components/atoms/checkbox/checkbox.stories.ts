import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Atoms/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    checkedChange: { action: 'checkedChange' }
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable checkbox component with label, checked, and disabled states. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'Remember me',
    checked: true,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable option',
    checked: false,
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: 'Selected but unavailable',
    checked: true,
    disabled: true,
  },
};

export const GroupExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-checkbox label="Option 1" [checked]="false"></app-checkbox>
        <app-checkbox label="Option 2" [checked]="true"></app-checkbox>
        <app-checkbox label="Option 3" [checked]="false"></app-checkbox>
      </div>
    `,
  }),
}; 