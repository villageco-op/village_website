import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { BrowseProduceMap } from './BrowseProduceMap';

import { type ProduceType, Season } from '@/lib/api/generated/models';

const mockMapGroups = [
  {
    sellerId: 'seller-1',
    name: 'Jonah',
    lat: 30.2672,
    lng: -97.7431,
    produce: [
      {
        id: 'p1',
        name: 'Organic Kale',
        type: 'leafy_greens' as ProduceType,
        price: '0.20',
        availableInventory: '160', // 10 lbs
        thumbnail:
          'https://images.unsplash.com/photo-1524179524002-bb6405560941?w=100&h=100&fit=crop',
        availableBy: new Date().toISOString(),
        seasonStart: Season.spring,
        seasonEnd: Season.summer,
        isSubscribable: true,
      },
      {
        id: 'p2',
        name: 'Red Beets',
        type: 'stone_fruits' as ProduceType,
        price: '0.12',
        availableInventory: '80', // 5 lbs
        thumbnail: '',
        availableBy: new Date().toISOString(),
        seasonStart: Season.fall,
        seasonEnd: Season.winter,
        isSubscribable: false,
      },
    ],
  },
  {
    sellerId: 'seller-2',
    name: 'Sarah',
    lat: 30.2856,
    lng: -97.7341,
    produce: [
      {
        id: 'p3',
        name: 'Summer Squash',
        type: 'root_vegetables' as ProduceType,
        price: '0.15',
        availableInventory: '320', // 20 lbs
        thumbnail:
          'https://images.unsplash.com/photo-1506489422701-1779617f0ec6?w=100&h=100&fit=crop',
        availableBy: new Date().toISOString(),
        seasonStart: Season.summer,
        seasonEnd: Season.summer,
        isSubscribable: true,
      },
    ],
  },
];

const meta: Meta<typeof BrowseProduceMap> = {
  title: 'Buyer/BrowseProduce/Map/BrowseProduceMap',
  component: BrowseProduceMap,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceMap>;

export const Default: Story = {
  args: {
    baseLat: 30.2672,
    baseLng: -97.7431,
    mapGroups: mockMapGroups,
    onSelectGroup: fn(),
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px' }}>
      <BrowseProduceMap {...args} />
    </div>
  ),
};

export const NoSellersNearby: Story = {
  args: {
    baseLat: 30.2672,
    baseLng: -97.7431,
    mapGroups: [],
    onSelectGroup: fn(),
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px' }}>
      <BrowseProduceMap {...args} />
    </div>
  ),
};
