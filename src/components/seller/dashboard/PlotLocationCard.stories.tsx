import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlotLocationCard } from './PlotLocationCard';

const meta: Meta<typeof PlotLocationCard> = {
  title: 'Seller/Dashboard/PlotLocationCard',
  component: PlotLocationCard,
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
type Story = StoryObj<typeof PlotLocationCard>;

/**
 * Standard view with a valid address provided.
 */
export const Default: Story = {
  args: {
    location: {
      address: '123 Garden Lane',
      lat: 45.523062,
      lng: -122.676482,
      city: 'North Harvest',
      state: 'IN',
      country: 'United States',
      zip: '45678',
    },
  },
};

/**
 * State representing a location with a long address to test layout stability.
 */
export const LongAddress: Story = {
  args: {
    location: {
      address: 'Suite 402, Green Valley Community Garden Hub',
      lat: 39.7817,
      lng: -89.6501,
      city: 'West Springfield',
      state: 'IL',
      country: 'United States',
      zip: '62704',
    },
  },
};

/**
 * Fallback state when the location object is missing or the address is undefined.
 */
export const MissingAddress: Story = {
  args: {
    location: undefined,
  },
};
