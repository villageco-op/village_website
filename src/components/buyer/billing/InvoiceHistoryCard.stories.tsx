import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { InvoiceHistoryCard } from './InvoiceHistoryCard';

import { Toaster } from '@/components/ui/sonner';

const meta: Meta<typeof InvoiceHistoryCard> = {
  title: 'Buyer/Billing/InvoiceHistoryCard',
  component: InvoiceHistoryCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto">
        <Story />
        <Toaster></Toaster>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InvoiceHistoryCard>;

export const Default: Story = {
  args: {
    orders: [
      {
        id: 'inv_8f2d9e1a',
        buyerId: 'b-1',
        sellerId: 's-1',
        paymentMethod: 'card',
        stripeReceiptUrl: 'https://stripe.com/receipt',
        stripeInvoiceId: 'invoice_id',
        fulfillmentType: 'delivery',
        scheduledTime: new Date().toISOString(),
        status: 'completed',
        cancelReason: null,
        totalAmount: '142.50',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_3c4b5a6d',
        buyerId: 'b-1',
        sellerId: 's-2',
        paymentMethod: 'snap',
        stripeReceiptUrl: null,
        stripeInvoiceId: null,
        fulfillmentType: 'pickup',
        scheduledTime: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'completed',
        cancelReason: null,
        totalAmount: '64.20',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    orders: [],
  },
};

export const LongHistory: Story = {
  args: {
    orders: Array.from({ length: 10 }).map((_, i) => ({
      id: `inv_long_${i}`,
      buyerId: 'b-1',
      sellerId: `s-${i}`,
      paymentMethod: i % 2 === 0 ? 'card' : 'snap',
      stripeReceiptUrl: 'https://stripe.com/receipt',
      stripeInvoiceId: 'invoice_id',
      fulfillmentType: i % 3 === 0 ? 'delivery' : 'pickup',
      scheduledTime: new Date(Date.now() - i * 86400000).toISOString(),
      status: 'completed',
      cancelReason: null,
      totalAmount: (Math.random() * 200 + 20).toFixed(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};
