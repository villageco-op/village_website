import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionLocationCard } from './SubscriptionLocationCard';

import { Toaster } from '@/components/ui/sonner';
import { SubscriptionStatus } from '@/lib/api/generated/models';

const meta: Meta<typeof SubscriptionLocationCard> = {
  title: 'Buyer/Subscriptions/Details/SubscriptionLocationCard',
  component: SubscriptionLocationCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Toaster />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubscriptionLocationCard>;

const mockLocation = {
  lat: 30.2672,
  lng: -97.7431,
  address: '1100 Congress Ave, Austin, TX 78701',
  city: 'Austin',
  state: 'TX',
  country: 'USA',
  zip: '78701',
};

/**
 * Pickup state: Displays the seller's location information.
 */
export const Pickup: Story = {
  args: {
    subscription: {
      id: 'sub-pickup-1',
      fulfillmentType: 'pickup',
      status: SubscriptionStatus.active,
      quantityOz: '10',
      seller: {
        id: 'seller-1',
        name: 'Hill Country Greens',
        location: mockLocation,
      },
      buyer: null,
      product: { title: 'Fresh Kale' },
    } as any,
  },
};

/**
 * Delivery state: Displays the buyer's destination location.
 */
export const Delivery: Story = {
  args: {
    subscription: {
      id: 'sub-delivery-1',
      fulfillmentType: 'delivery',
      status: SubscriptionStatus.active,
      quantityOz: '16',
      buyer: {
        id: 'buyer-1',
        name: 'Jane Smith',
        location: {
          ...mockLocation,
          address: '456 Residential Lane, Austin, TX 78704',
        },
      },
      seller: null,
      product: { title: 'Organic Spinach' },
    } as any,
  },
};

/**
 * State where the user or location object is missing/incomplete.
 * The component provides fallbacks for the map coordinates and address text.
 */
export const MissingLocation: Story = {
  args: {
    subscription: {
      id: 'sub-missing-1',
      fulfillmentType: 'pickup',
      seller: {
        id: 'seller-2',
        location: null,
      },
    } as any,
  },
};
