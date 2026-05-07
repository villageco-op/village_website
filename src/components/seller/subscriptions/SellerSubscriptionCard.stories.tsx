import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SellerSubscriptionCard } from './SellerSubscriptionCard';

import { Toaster } from '@/components/ui/sonner';
import type {
  ProduceType,
  SubscriptionDetailResponseProductStatus,
  SubscriptionStatus,
} from '@/lib/api/generated/models';

const meta: Meta<typeof SellerSubscriptionCard> = {
  title: 'Seller/Subscriptions/SellerSubscriptionCard',
  component: SellerSubscriptionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-120 bg-slate-50 p-4">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SellerSubscriptionCard>;

const mockSubscription = {
  id: 'sub-789',
  buyerId: 'user-buyer-1',
  productId: 'prod-001',
  sellerId: 'user-seller-pro',
  quantityOz: '32',
  status: 'active' as SubscriptionStatus,
  fulfillmentType: 'pickup',
  nextDeliveryDate: '2026-06-12T09:00:00Z',
  cancelReason: null,
  createdAt: '2026-02-15T00:00:00Z',
  updatedAt: '2026-02-15T00:00:00Z',
  product: {
    id: 'prod-001',
    sellerId: 'user-seller-pro',
    title: 'Red Bourbon Coffee Beans',
    description: 'Hand crafted coffee beans made with love.',
    produceType: 'legumes' as ProduceType,
    pricePerOz: '1.25',
    totalOzInventory: '500',
    maxOrderQuantityOz: null,
    availableBy: '2026-01-01',
    harvestFrequencyDays: 14,
    seasonStart: '2026-01-01',
    seasonEnd: '2026-12-31',
    images: [],
    isSubscribable: true,
    status: 'active' as SubscriptionDetailResponseProductStatus,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  buyer: {
    id: 'user-buyer-1',
    name: 'Alice Henderson',
    email: 'alice@example.com',
  },
  seller: null, // From seller perspective, we usually focus on the buyer
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

export const PickupPending: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      fulfillmentType: 'pickup',
      nextDeliveryDate: null,
    },
    index: 2,
  },
};

export const AnonymousBuyer: Story = {
  args: {
    subscription: {
      ...mockSubscription,
      buyer: null,
    },
    index: 3,
  },
};
