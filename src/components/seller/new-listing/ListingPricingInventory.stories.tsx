import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import { ListingPricingInventory } from './ListingPricingInventory';

import type { ListingFormData } from '@/components/pages/AddNewListingClient';

const mockFullData: ListingFormData = {
  title: 'Honeycrisp Apples',
  produceType: 'Fruit',
  pricePerLb: '',
  totalLbsInventory: '',
  availableBy: '',
  harvestFrequencyDays: '7',
  seasonStart: '',
  seasonEnd: '',
  isSubscribable: false,
  images: [],
};

const meta: Meta<typeof ListingPricingInventory> = {
  title: 'Seller/NewListing/ListingPricingInventory',
  component: ListingPricingInventory,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    updateData: fn(),
    data: mockFullData,
  },
};

export default meta;
type Story = StoryObj<typeof ListingPricingInventory>;

/**
 * Empty state for initial data entry.
 */
export const Empty: Story = {};

/**
 * Populated state showing numerical values for price and weight.
 */
export const Populated: Story = {
  args: {
    data: {
      ...mockFullData,
      pricePerLb: '4.99',
      totalLbsInventory: '150',
    },
  },
};

/**
 * Interaction test to ensure numeric inputs correctly trigger updates.
 */
export const PriceUpdateTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const priceInput = canvas.getByLabelText(/Price per lb/i);
    const inventoryInput = canvas.getByLabelText(/Total Inventory/i);

    await userEvent.type(priceInput, '5.50');
    await userEvent.type(inventoryInput, '25');

    await expect(args.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ pricePerLb: expect.stringContaining('5') }),
    );
    await expect(args.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ totalLbsInventory: expect.stringContaining('2') }),
    );
  },
};
