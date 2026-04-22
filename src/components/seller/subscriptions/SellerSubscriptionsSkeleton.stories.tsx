import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SellerSubscriptionsSkeleton } from './SellerSubscriptionsSkeleton';

const meta: Meta<typeof SellerSubscriptionsSkeleton> = {
  title: 'Seller/Subscriptions/SellerSubscriptionsSkeleton',
  component: SellerSubscriptionsSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SellerSubscriptionsSkeleton>;

export const LoadingState: Story = {};
