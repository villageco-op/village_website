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

const productOne = {
  id: 'prod_1',
  title: 'Organic Sourdough Bread',
  type: 'Bakery',
  images: ['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200'],
};

const productTwo = {
  id: 'prod_2',
  title: 'Artisanal Cheese Box',
  type: 'Dairy',
  images: ['https://images.unsplash.com/photo-1552767059-ce182ead8c1b?w=200'],
};

const mockSingleItem = {
  id: 'item_1',
  productId: 'prod_1',
  quantityOz: '15',
  pricePerOz: '1.5',
  product: productOne,
};

const mockMultipleItems = [
  {
    id: 'item_1',
    productId: 'prod_2',
    quantityOz: '15',
    pricePerOz: '1.5',
    product: productTwo,
  },
  {
    id: 'item_2',
    productId: 'prod_1',
    quantityOz: '15',
    pricePerOz: '1.5',
    product: productOne,
  },
];

const mockLocation = {
  address: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  country: 'USA',
  zip: '12345',
  lat: 0.5,
  lng: 0.9,
};

const mockBuyer = {
  id: 'b1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  location: mockLocation,
};

const mockBuyer2 = {
  id: 'b2',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  location: mockLocation,
};

const mockSeller = {
  id: 's1',
  name: 'Green Valley Organics',
  email: 'orders@greenvalley.com',
  image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=100',
  location: mockLocation,
};

const mockCounterparty = {
  ...mockBuyer,
};

/**
 * A standard view showing a mix of single and multi-item orders with pickup and delivery.
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
        items: [mockSingleItem],
        buyer: mockBuyer,
        seller: mockSeller,
        counterparty: mockCounterparty,
      },
      {
        id: 'ord_pnd67890',
        totalAmount: '68.50',
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
        items: mockMultipleItems,
        buyer: mockBuyer2,
        seller: mockSeller,
        counterparty: mockBuyer2,
      },
    ],
  },
};

/**
 * Explicitly tests orders containing multiple items (+x more badge).
 */
export const MultipleOrderItems: Story = {
  args: {
    pendingCount: 1,
    orders: [
      {
        id: 'ord_multi123',
        totalAmount: '89.00',
        fulfillmentType: 'delivery',
        scheduledTime: new Date(Date.now() + 43200000).toISOString(),
        status: 'pending',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        sellerId: 's1',
        buyerId: 'b1',
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
        stripeInvoiceId: 'invoice_id',
        items: mockMultipleItems, // 2 items -> displays "+1 more" badge
        buyer: mockBuyer,
        seller: mockSeller,
        counterparty: mockCounterparty,
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
 * to test the layout of the timestamps and missing date state.
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
        items: [mockSingleItem],
        buyer: mockBuyer,
        seller: mockSeller,
        counterparty: mockCounterparty,
      },
    ],
  },
};

/**
 * Mobile view to ensure badges, product details, and status elements wrap properly.
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
