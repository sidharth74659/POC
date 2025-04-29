import type { Meta, StoryObj } from '@storybook/angular';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Atoms/Radio',
  component: RadioComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    checkedChange: { action: 'checkedChange' }
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable radio component with label, checked, and disabled states. Uses design system tokens and BEM classes.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<RadioComponent>;

export const Default: Story = {
  args: {
    label: 'Select option',
    checked: false,
    disabled: false,
    name: 'default-radio',
    value: 'option1'
  },
};

export const Checked: Story = {
  args: {
    label: 'Selected option',
    checked: true,
    disabled: false,
    name: 'checked-radio',
    value: 'option1'
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable option',
    checked: false,
    disabled: true,
    name: 'disabled-radio',
    value: 'option1'
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: 'Selected but unavailable',
    checked: true,
    disabled: true,
    name: 'checked-disabled-radio',
    value: 'option1'
  },
};

export const RadioGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-radio label="Option 1" name="radio-group" value="option1" [checked]="true"></app-radio>
        <app-radio label="Option 2" name="radio-group" value="option2" [checked]="false"></app-radio>
        <app-radio label="Option 3" name="radio-group" value="option3" [checked]="false"></app-radio>
      </div>
    `,
  }),
}; 