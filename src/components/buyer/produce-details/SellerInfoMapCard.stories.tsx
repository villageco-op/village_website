import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerInfoMapCard from './SellerInfoMapCard';

const meta: Meta<typeof SellerInfoMapCard> = {
  title: 'Buyer/ProduceDetails/SellerInfoMapCard',
  component: SellerInfoMapCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SellerInfoMapCard>;

const mockSeller = {
  id: 'seller-123',
  name: 'Green Valley Organics',
  image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop',
  canDeliver: true,
  deliveryRangeMiles: 15,
  location: {
    lat: 41.8781,
    lng: -87.6298,
    address: '123 Farm Road',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    zip: '60601',
  },
};

export const Default: Story = {
  args: {
    seller: mockSeller,
  },
};

export const PickupOnly: Story = {
  args: {
    seller: {
      ...mockSeller,
      name: 'Old Oak Farmstead',
      canDeliver: false,
      deliveryRangeMiles: null,
      image: '',
    },
  },
};

export const Anonymous: Story = {
  args: {
    seller: {
      id: 'anon-1',
      name: null,
      image: '',
      canDeliver: false,
      deliveryRangeMiles: null,
      location: {
        lat: null,
        lng: null,
        address: null,
        city: null,
        state: null,
        country: null,
        zip: null,
      },
    },
  },
};
