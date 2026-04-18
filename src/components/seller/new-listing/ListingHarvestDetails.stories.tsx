import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import { ListingHarvestDetails } from './ListingHarvestDetails';

import type { ListingFormData } from '@/components/seller/new-listing/AddNewListingClient';

const mockFullData: ListingFormData = {
  title: 'Summer Squash',
  produceType: 'Vegetable',
  pricePerLb: '2.50',
  totalLbsInventory: '20',
  availableBy: '2026-06-01T08:00',
  harvestFrequencyDays: '3',
  seasonStart: '2026-06-01',
  seasonEnd: '2026-09-01',
  isSubscribable: true,
  images: [],
};

const meta: Meta<typeof ListingHarvestDetails> = {
  title: 'Seller/NewListing/ListingHarvestDetails',
  component: ListingHarvestDetails,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    updateData: fn(),
    data: mockFullData,
  },
};

export default meta;
type Story = StoryObj<typeof ListingHarvestDetails>;

export const Default: Story = {};

/**
 * Verifies that checking the subscription toggle calls updateData with the boolean value.
 */
export const ToggleSubscription: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByLabelText(/Allow customers to set up recurring orders/i);

    await userEvent.click(checkbox);

    await expect(args.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ isSubscribable: false }),
    );
  },
};

/**
 * Demonstrates the responsive grid layout when screen size is reduced.
 */
export const MobileView: Story = {
  decorators: [
    (Story) => (
      <div className="w-87.5">
        <Story />
      </div>
    ),
  ],
};
