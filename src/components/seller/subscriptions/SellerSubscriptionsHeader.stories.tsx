import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SellerSubscriptionsHeader } from './SellerSubscriptionsHeader';

const meta: Meta<typeof SellerSubscriptionsHeader> = {
  title: 'Seller/Subscriptions/SellerSubscriptionsHeader',
  component: SellerSubscriptionsHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SellerSubscriptionsHeader>;

export const Default: Story = {
  args: {
    activeCount: 12,
  },
};

export const SingleCustomer: Story = {
  args: {
    activeCount: 1,
  },
};

export const NoActiveSubscriptions: Story = {
  args: {
    activeCount: 0,
  },
};
