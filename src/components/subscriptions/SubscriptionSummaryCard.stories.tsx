import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionSummaryCard } from './SubscriptionSummaryCard';

import {
  type ProduceType,
  type SubscriptionDetailResponseProductStatus,
  SubscriptionStatus,
} from '@/lib/api/generated/models';

const meta: Meta<typeof SubscriptionSummaryCard> = {
  title: 'Subscriptions/SubscriptionSummaryCard',
  component: SubscriptionSummaryCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubscriptionSummaryCard>;

const mockSubscription = {
  id: 'sub-123',
  buyerId: 'user-1',
  productId: 'prod-1',
  sellerId: 'seller-1',
  quantityOz: '16',
  status: SubscriptionStatus.active,
  fulfillmentType: 'delivery',
  nextDeliveryDate: '2026-06-15T10:00:00Z',
  cancelReason: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  product: {
    id: 'prod-1',
    sellerId: 'seller-1',
    title: 'Gourmet Spring Mix',
    produceType: 'leafy_greens' as ProduceType,
    pricePerOz: '1.25',
    harvestFrequencyDays: 14,
    totalOzInventory: '500',
    maxOrderQuantityOz: '',
    availableBy: '2026-01-01',
    seasonStart: '2026-01-01',
    seasonEnd: '2026-12-31',
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

export const Default: Story = {
  args: {
    subscription: mockSubscription,
  },
};

export const PendingDelivery: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      nextDeliveryDate: null,
    },
  },
};

export const CustomFrequency: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      product: {
        ...mockSubscription.product,
        title: 'Microgreens Subscription',
        harvestFrequencyDays: 3,
        pricePerOz: '4.50',
      },
      quantityOz: '4',
    },
  },
};
