import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BrowseProduceHeader } from './BrowseProduceHeader';

const meta: Meta<typeof BrowseProduceHeader> = {
  title: 'Buyer/BrowseProduce/BrowseProduceHeader',
  component: BrowseProduceHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceHeader>;

export const Default: Story = {};
