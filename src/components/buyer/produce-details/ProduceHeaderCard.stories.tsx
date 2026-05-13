import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProduceHeaderCard from './ProduceHeaderCard';

import type { ProduceProduceType, ProduceStatusProperty } from '@/lib/api/generated/models';

const meta: Meta<typeof ProduceHeaderCard> = {
  title: 'Buyer/ProduceDetails/ProduceHeaderCard',
  component: ProduceHeaderCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProduceHeaderCard>;

const mockProduce = {
  id: 'prod-1',
  sellerId: 'seller-1',
  title: 'Heirloom Beefsteak Tomatoes',
  description:
    'Freshly picked heirloom tomatoes. These are vine-ripened and grown without synthetic pesticides. Perfect for sandwiches, salads, or making your own fresh salsa.\n\nNote: Please handle with care as these are very ripe!',
  produceType: 'vegetables' as ProduceProduceType,
  pricePerOz: '0.25', // $4.00 per lb
  totalOzInventory: '320', // 20 lbs
  maxOrderQuantityOz: '80',
  availableBy: '2026-05-15T00:00:00Z',
  harvestFrequencyDays: 7,
  seasonStart: '2026-05-01T00:00:00Z',
  seasonEnd: '2026-09-30T00:00:00Z',
  images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&q=80'],
  isSubscribable: true,
  status: 'active' as ProduceStatusProperty,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

export const Default: Story = {
  args: {
    produce: {
      ...mockProduce,
      seller: {} as any,
    },
  },
};

export const MultipleImages: Story = {
  args: {
    produce: {
      ...mockProduce,
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&q=80',
        'https://images.unsplash.com/photo-1561131245-c9e7c76a1ec3?w=1200&q=80',
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=1200&q=80',
      ],
      seller: {} as any,
    },
  },
};

export const NoImage: Story = {
  args: {
    produce: {
      ...mockProduce,
      images: [],
      isSubscribable: false,
      seller: {} as any,
    },
  },
};

export const MinimalDetails: Story = {
  args: {
    produce: {
      ...mockProduce,
      description: null,
      produceType: 'fruit' as ProduceProduceType,
      isSubscribable: null,
      seller: {} as any,
    },
  },
};
