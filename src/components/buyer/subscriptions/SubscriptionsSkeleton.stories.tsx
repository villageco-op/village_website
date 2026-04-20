import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionsSkeleton } from './SubscriptionsSkeleton';

const meta: Meta<typeof SubscriptionsSkeleton> = {
  title: 'Buyer/Subscriptions/SubscriptionsSkeleton',
  component: SubscriptionsSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SubscriptionsSkeleton>;

/**
 * Visual representation of the loading state for the subscriptions list.
 */
export const Default: Story = {};
