import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { SellerUpdateStatusDialog } from './SellerUpdateStatusDialog';

const meta: Meta<typeof SellerUpdateStatusDialog> = {
  title: 'Seller/Subscriptions/Details/SellerUpdateStatusDialog',
  component: SellerUpdateStatusDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SellerUpdateStatusDialog>;

export const PauseAction: Story = {
  args: {
    isOpen: true,
    action: 'paused',
    isPending: false,
  },
};

export const CancelAction: Story = {
  args: {
    isOpen: true,
    action: 'canceled',
    isPending: false,
  },
};

export const PendingState: Story = {
  args: {
    isOpen: true,
    action: 'canceled',
    isPending: true,
  },
};
