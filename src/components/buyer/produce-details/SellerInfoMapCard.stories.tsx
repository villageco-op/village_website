import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerInfoMapCard from './SellerInfoMapCard';

import { MOCK_PRODUCE_DETAILS } from '@/lib/storybook/mocks/produce.mock';

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

export const Default: Story = {
  args: {
    seller: MOCK_PRODUCE_DETAILS.seller,
  },
};

export const PickupOnly: Story = {
  args: {
    seller: {
      ...MOCK_PRODUCE_DETAILS.seller,
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
