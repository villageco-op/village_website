import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';
import { useState } from 'react';

import { ListingBasicInfo } from './ListingBasicInfo';

import type { ListingFormData } from '@/components/seller/new-listing/AddNewListingClient';

const mockFullData: ListingFormData = {
  title: '',
  produceType: undefined,
  description: '',
  pricePerLb: '0.00',
  totalLbsInventory: '0',
  maxOrderLbs: '',
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
      description: 'Freshly picked early morning blossoms, perfect for stuffing with ricotta.',
      produceType: 'cucurbits',
      pricePerLb: '12.50',
      totalLbsInventory: '5',
    },
  },
};

/**
 * Verifies interaction for Title, Description, and Produce Type.
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

    const descriptionInput = canvas.getByLabelText(/Description/i);
    const testDescription = 'Sweet and tart berries.';
    await userEvent.type(descriptionInput, testDescription);

    await expect(args.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ description: testDescription }),
    );

    const counter = canvas.getByText(/23 \/ 500/i);
    await expect(counter).toBeInTheDocument();

    const selectTrigger = canvas.getByLabelText(/Produce Type/i);
    await userEvent.click(selectTrigger);

    const option = (await screen.findAllByText('Berries'))[0];
    await userEvent.click(option);

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
