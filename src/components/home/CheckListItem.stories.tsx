import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CheckListItem } from './CheckListItem';

const meta: Meta<typeof CheckListItem> = {
  title: 'Home/Components/CheckListItem',
  component: CheckListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'impact'],
      description: 'Switches between standard and high-impact styles.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckListItem>;

/**
 * The standard version used on light backgrounds (like 'bg-cream' or 'bg-white').
 * Features a solid 'deep-forest' icon for high legibility.
 */
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Direct-to-consumer sales with automated weekly payouts.',
  },
};

/**
 * The Impact variant is designed for dark sections. It uses a semi-transparent
 * lime border and background with slightly larger text.
 */
export const Impact: Story = {
  args: {
    variant: 'impact',
    children: '92% reduction in food miles via local hub distribution.',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

/**
 * Comparing both variants side-by-side.
 */
export const Comparison: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <div className="p-6 bg-cream rounded-xl">
        <h4 className="mb-4 text-xs uppercase tracking-widest text-ink-3">Default (On Cream)</h4>
        <ul className="flex flex-col gap-3">
          <CheckListItem variant="default">Automated compliance labeling</CheckListItem>
          <CheckListItem variant="default">Real-time inventory management</CheckListItem>
        </ul>
      </div>

      <div className="p-6 bg-deep-forest rounded-xl">
        <h4 className="mb-4 text-xs uppercase tracking-widest text-lime/50">Impact (On Dark)</h4>
        <ul className="flex flex-col gap-3">
          <CheckListItem variant="impact">Zero-waste delivery routes</CheckListItem>
          <CheckListItem variant="impact">Carbon-neutral cold storage</CheckListItem>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Demonstrates how the 'impact' variant handles multiple lines of text
 * while maintaining the icon alignment.
 */
export const ImpactLongForm: Story = {
  args: {
    variant: 'impact',
    children:
      'Access to a distributed network of cold-storage lockers and neighborhood pick-up points, reducing the need for expensive last-mile delivery infrastructure.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-100 p-8 bg-stone-900 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
