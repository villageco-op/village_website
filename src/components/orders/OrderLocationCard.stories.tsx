import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Toaster } from '../ui/sonner';

import { OrderLocationCard } from './OrderLocationCard';

const meta: Meta<typeof OrderLocationCard> = {
  title: 'Orders/OrderDetails/OrderLocationCard',
  component: OrderLocationCard,
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
type Story = StoryObj<typeof OrderLocationCard>;

const mockLocation = {
  lat: 41.8781,
  lng: -87.6298,
  address: '233 S Wacker Dr, Chicago, IL 60606',
};

export const Pickup: Story = {
  args: {
    order: {
      id: 'ord-1',
      fulfillmentType: 'pickup',
      seller: {
        id: 'seller-1',
        name: 'Windy City Farm',
        location: mockLocation,
      },
      buyer: null,
      items: [],
      paymentMethod: 'card',
      status: 'pending',
      totalAmount: '20.00',
      scheduledTime: new Date().toISOString(),
    } as any,
  },
};

export const Delivery: Story = {
  args: {
    order: {
      id: 'ord-2',
      fulfillmentType: 'delivery',
      buyer: {
        id: 'buyer-1',
        name: 'John Doe',
        location: {
          ...mockLocation,
          address: '123 Delivery Lane, Chicago, IL 60601',
        },
      },
      seller: null,
      items: [],
      paymentMethod: 'card',
      status: 'pending',
      totalAmount: '45.00',
      scheduledTime: new Date().toISOString(),
    } as any,
  },
};

export const MissingLocation: Story = {
  args: {
    order: {
      id: 'ord-3',
      fulfillmentType: 'pickup',
      seller: {
        id: 'seller-2',
        location: null,
      },
    } as any,
  },
};
