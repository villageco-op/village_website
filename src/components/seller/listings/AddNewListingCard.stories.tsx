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

/**
 * Shows how the card scales when placed inside a grid
 * (matching the typical 'My Listings' layout).
 */
export const InGrid: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Story />
        <div className="h-64 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
          Existing Listing Placeholder
        </div>
        <div className="h-64 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
          Existing Listing Placeholder
        </div>
      </div>
    ),
  ],
};

/**
 * Demonstration of the hover state (bg-lime-pale/20).
 * Note: Interaction must be performed manually in the preview.
 */
export const HoverState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hover over the card to see the transition to the light lime background.',
      },
    },
  },
};
