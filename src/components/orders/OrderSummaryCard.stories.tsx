import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderSummaryCard } from './OrderSummaryCard';

import { BASE_MOCK_ORDER_DETAIL } from '@/lib/storybook/mocks/order.mock';

const meta: Meta<typeof OrderSummaryCard> = {
  title: 'Orders/OrderDetails/OrderSummaryCard',
  component: OrderSummaryCard,
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
type Story = StoryObj<typeof OrderSummaryCard>;

export const Delivery: Story = {
  args: {
    order: {
      ...BASE_MOCK_ORDER_DETAIL,
      status: 'pending',
      fulfillmentType: 'delivery',
      paymentMethod: 'card',
      totalAmount: '45.50',
      scheduledTime: new Date().toISOString(),
      cancelReason: null,
      stripeReceiptUrl: 'https://stripe.com/receipt',
      stripeInvoiceId: 'invoice_id',
    },
    fromUser: BASE_MOCK_ORDER_DETAIL.buyer,
  },
};

export const Pickup: Story = {
  args: {
    order: {
      ...BASE_MOCK_ORDER_DETAIL,
      status: 'completed',
      fulfillmentType: 'pickup',
      paymentMethod: 'snap',
      totalAmount: '12.00',
      scheduledTime: new Date().toISOString(),
      cancelReason: null,
      stripeReceiptUrl: 'https://stripe.com/receipt',
      stripeInvoiceId: 'invoice_id',
    },
    fromUser: BASE_MOCK_ORDER_DETAIL.buyer,
  },
};

export const Canceled: Story = {
  args: {
    order: {
      ...BASE_MOCK_ORDER_DETAIL,
      status: 'canceled',
      fulfillmentType: 'delivery',
      paymentMethod: 'card',
      totalAmount: '89.99',
      cancelReason: 'The delivery route is currently blocked by local road construction.',
      scheduledTime: new Date().toISOString(),
      stripeReceiptUrl: 'https://stripe.com/receipt',
      stripeInvoiceId: 'invoice_id',
    },
    fromUser: BASE_MOCK_ORDER_DETAIL.buyer,
  },
};
