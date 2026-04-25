import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';
import { useState } from 'react';

import { ListingBasicInfo } from './ListingBasicInfo';

import type { ListingFormData } from '@/components/seller/new-listing/AddNewListingClient';

const mockFullData: ListingFormData = {
  title: '',
  produceType: undefined,
  pricePerLb: '0.00',
  totalLbsInventory: '0',
  availableBy: '',
  harvestFrequencyDays: '7',
  seasonStart: '',
  seasonEnd: '',
  isSubscribable: false,
  images: [],
};

const meta: Meta<typeof ListingBasicInfo> = {
  title: 'Seller/NewListing/ListingBasicInfo',
  component: ListingBasicInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    updateData: fn(),
    data: mockFullData,
  },
};

export default meta;
type Story = StoryObj<typeof ListingBasicInfo>;

/**
 * The initial state with a complete, empty data object.
 */
export const Default: Story = {};

/**
 * Demonstrates the component when it receives a partially or fully
 * populated data object.
 */
export const Prepopulated: Story = {
  args: {
    data: {
      ...mockFullData,
      title: 'Zucchini Blossoms',
      produceType: 'cucurbits',
      pricePerLb: '12.50',
      totalLbsInventory: '5',
    },
  },
};

/**
 * Verifies the interaction: typing in the Title and Produce Type
 * inputs should trigger the updateData callback with the correct keys.
 */
export const InteractionTest: Story = {
  render: (args) => {
    const [data, setData] = useState(args.data);

    const handleUpdate = (newData: Partial<ListingFormData>) => {
      setData((prev) => ({ ...prev, ...newData }));
      args.updateData(newData);
    };

    return <ListingBasicInfo {...args} data={data} updateData={handleUpdate} />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const screen = within(canvasElement.ownerDocument.body);

    const titleInput = canvas.getByLabelText(/Title/i);
    await userEvent.type(titleInput, 'Red Currants');

    await expect(args.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Red Currants' }),
    );

    const selectTrigger = canvas.getByLabelText(/Produce Type/i);
    await userEvent.click(selectTrigger);

    const option = (await screen.findAllByText('Berries'))[0];
    await userEvent.click(option);

    // Check that updateData was called with produceType updates
    await expect(args.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ produceType: 'berries' }),
    );
  },
};

/**
 * Displays the component in a mobile-width container to ensure
 * the shadcn Card and Inputs scale correctly.
 */
export const MobileView: Story = {
  decorators: [
    (Story) => (
      <div className="w-93.75 p-4 mx-auto">
        <Story />
      </div>
    ),
  ],
};
