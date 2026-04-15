import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import { ListingStatusActions } from './ListingStatusActions';

const meta: Meta<typeof ListingStatusActions> = {
  title: 'Seller/EditListing/ListingStatusActions',
  component: ListingStatusActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    status: 'active',
    onToggleStatus: fn(),
    onDelete: fn(),
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof ListingStatusActions>;

export const ActiveStatus: Story = {
  args: {
    status: 'active',
  },
};

export const PausedStatus: Story = {
  args: {
    status: 'paused',
  },
};

export const LoadingState: Story = {
  args: {
    isPending: true,
  },
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const pauseBtn = canvas.getByRole('button', { name: /Pause Listing/i });
    await userEvent.click(pauseBtn);
    await expect(args.onToggleStatus).toHaveBeenCalled();

    const deleteBtn = canvas.getByRole('button', { name: /Delete Listing/i });
    await userEvent.click(deleteBtn);
    await expect(args.onDelete).toHaveBeenCalled();
  },
};
