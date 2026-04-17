import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderDetailSkeleton } from './OrderDetailSkeleton';

const meta: Meta<typeof OrderDetailSkeleton> = {
  title: 'Orders/OrderDetails/OrderDetailSkeleton',
  component: OrderDetailSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderDetailSkeleton>;

export const Default: Story = {};
