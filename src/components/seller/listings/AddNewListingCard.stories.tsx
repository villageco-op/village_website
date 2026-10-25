import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AddNewListingCard } from './AddNewListingCard';

const meta: Meta<typeof AddNewListingCard> = {
  title: 'Seller/Listings/AddNewListingCard',
  component: AddNewListingCard,
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
type Story = StoryObj<typeof AddNewListingCard>;

/**
 * The standard empty state card used to prompt users to create a new listing.
 */
export const Default: Story = {};
