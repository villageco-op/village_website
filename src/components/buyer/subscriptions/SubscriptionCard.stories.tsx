import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionCard } from './SubscriptionCard';

import type {
  SubscriptionDetailResponseProductStatus,
  SubscriptionStatus,
} from '@/lib/api/generated/models';

const meta: Meta<typeof SubscriptionCard> = {
  title: 'Buyer/Subscriptions/SubscriptionCard',
  component: SubscriptionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-87.5 bg-slate-50 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubscriptionCard>;

const mockSubscription = {
  id: 'sub-123',
  buyerId: 'user-buyer',
  productId: 'prod-456',
  sellerId: 'user-seller',
  quantityOz: '16',
  status: 'active' as SubscriptionStatus,
  fulfillmentType: 'delivery',
  nextDeliveryDate: '2026-05-15T10:00:00Z',
  cancelReason: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  product: {
    id: 'prod-456',
    sellerId: 'user-seller',
    title: 'Organic Heirloom Kale',
    produceType: 'Leafy Greens',
    pricePerOz: '0.75',
    totalOzInventory: '100',
    availableBy: '2026-04-20',
    harvestFrequencyDays: 7,
    seasonStart: '2026-03-01',
    seasonEnd: '2026-11-01',
    images: [],
    isSubscribable: true,
    status: 'active' as SubscriptionDetailResponseProductStatus,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  seller: {
    id: 'user-seller',
    name: 'Sun-Kissed Acres',
    email: 'contact@sunkissed.com',
  },
  buyer: null,
};

export const Active: Story = {
  args: {
    subscription: { ...mockSubscription },
    index: 0,
  },
};

export const Paused: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      status: 'paused',
    },
    index: 1,
  },
};

export const PendingDelivery: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      nextDeliveryDate: null,
    },
    index: 2,
  },
};

export const MissingData: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      product: { ...mockSubscription.product, title: '' },
      seller: null,
    },
    index: 3,
  },
};
