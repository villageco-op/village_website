import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PendingOrdersCard } from './PendingOrdersCard';

const meta: Meta<typeof PendingOrdersCard> = {
  title: 'Seller/Orders/PendingOrdersCard',
  component: PendingOrdersCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PendingOrdersCard>;

/**
 * A standard view showing a mix of pickup and delivery orders
 * that are currently pending.
 */
export const Default: Story = {
  args: {
    pendingCount: 2,
    orders: [
      {
        id: 'ord_pnd12345',
        totalAmount: '42.00',
        fulfillmentType: 'delivery',
        scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        sellerId: 's1',
        buyerId: 'b1',
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
        stripeInvoiceId: 'invoice_id',
      },
      {
        id: 'ord_pnd67890',
        totalAmount: '18.50',
        fulfillmentType: 'pickup',
        scheduledTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        status: 'pending',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        sellerId: 's1',
        buyerId: 'b2',
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
        stripeInvoiceId: 'invoice_id',
      },
    ],
  },
};

/**
 * State when there are no active pending orders.
 */
export const Empty: Story = {
  args: {
    pendingCount: 0,
    orders: [],
  },
};

/**
 * View showing a single order with a long "time ago" string
 * to test the layout of the right-hand timestamp.
 */
export const LongWaitTime: Story = {
  args: {
    pendingCount: 1,
    orders: [
      {
        id: 'ord_delayed',
        totalAmount: '150.00',
        fulfillmentType: 'delivery',
        scheduledTime: '',
        status: 'pending',
        createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        sellerId: 's1',
        buyerId: 'b1',
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
        stripeInvoiceId: 'invoice_id',
      },
    ],
  },
};

/**
 * Mobile view to ensure the emoji icons and status pills
 * wrap or align correctly on small screens.
 */
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
