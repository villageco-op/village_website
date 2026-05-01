import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BrowseProduceSkeleton } from './BrowseProduceSkeleton';

const meta: Meta<typeof BrowseProduceSkeleton> = {
  title: 'Buyer/BrowseProduce/List/BrowseProduceSkeleton',
  component: BrowseProduceSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceSkeleton>;

export const Default: Story = {};
