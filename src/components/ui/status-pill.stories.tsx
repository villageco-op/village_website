import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatusPill } from './status-pill';

const meta: Meta<typeof StatusPill> = {
  title: 'UI/StatusPill',
  component: StatusPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['lime', 'sun', 'clay', 'forest', 'red', undefined],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

/**
 * Default state using automatic color detection based on status text.
 */
export const Pending: Story = {
  args: {
    status: 'Pending',
  },
};

export const Delivered: Story = {
  args: {
    status: 'Delivered',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'Cancelled',
  },
};

/**
 * Explicitly setting a variant to override text-based logic.
 */
export const ForestVariant: Story = {
  args: {
    status: 'In Transit',
    variant: 'forest',
  },
};

/**
 * Fallback state when status is null or unknown.
 */
export const Unknown: Story = {
  args: {
    status: null,
  },
};

/**
 * A collection of all common statuses to visualize the palette.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <StatusPill status="Pending" />
      <StatusPill status="Processing" />
      <StatusPill status="Delivered" />
      <StatusPill status="Ready" />
      <StatusPill status="Cancelled" />
      <StatusPill status="Failed" />
      <StatusPill status="Custom Forest" variant="forest" />
    </div>
  ),
};