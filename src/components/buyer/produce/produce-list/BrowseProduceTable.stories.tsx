import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { BrowseProduceTable } from './BrowseProduceTable';

const mockProduce = [
  {
    id: '1',
    name: 'Organic Honeycrisp Apples',
    sellerName: 'Green Valley Farm',
    sellerId: 'grower-1',
    thumbnail: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop',
    amount: '32', // 2 lbs
    price: '0.25', // $4.00/lb
    availableBy: new Date().toISOString(),
    distance: 4.2,
    isSubscribable: true,
    description: null,
  },
  {
    id: '2',
    name: 'Heirloom Carrots',
    sellerName: 'Sunken Garden',
    sellerId: 'grower-2',
    thumbnail: '',
    amount: '16', // 1 lb
    price: '0.15', // $2.40/lb
    availableBy: new Date(Date.now() + 86400000).toISOString(),
    distance: 12.8,
    isSubscribable: false,
    description: null,
  },
];

const meta: Meta<typeof BrowseProduceTable> = {
  title: 'Buyer/BrowseProduce/List/BrowseProduceTable',
  component: BrowseProduceTable,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceTable>;

export const Default: Story = {
  args: {
    produce: mockProduce,
    onOrderItem: fn(),
    onGrowerClick: fn(),
  },
};

export const Empty: Story = {
  args: {
    produce: [],
    onOrderItem: fn(),
    onGrowerClick: fn(),
  },
};
