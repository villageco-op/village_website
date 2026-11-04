import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProduceHeaderCard from './ProduceHeaderCard';

import { ProduceProduceType } from '@/lib/api/generated/models';
import { MOCK_PRODUCE_DETAILS } from '@/lib/storybook/mocks/produce.mock';

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

export const Default: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_DETAILS,
      seller: {} as any,
    },
  },
};

export const MultipleImages: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_DETAILS,
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
      ...MOCK_PRODUCE_DETAILS,
      images: [],
      isSubscribable: false,
      seller: {} as any,
    },
  },
};

export const MinimalDetails: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_DETAILS,
      description: null,
      produceType: ProduceProduceType.fruit,
      isSubscribable: null,
      seller: {} as any,
    },
  },
};
