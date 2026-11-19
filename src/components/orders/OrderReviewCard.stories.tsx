import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderReviewCard } from './OrderReviewCard';

import { Toaster } from '@/components/ui/sonner';

const meta: Meta<typeof OrderReviewCard> = {
  title: 'Orders/OrderDetails/OrderReviewCard',
  component: OrderReviewCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Toaster />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderReviewCard>;

export const Default: Story = {
  args: {
    review: {
      id: 'rev_123',
      rating: 5,
      comment: 'Amazing quality microgreens! Super quick pickup and very friendly seller.',
      createdAt: '2026-05-15T14:30:00Z',
    },
  },
};

export const WithoutComment: Story = {
  args: {
    review: {
      id: 'rev_124',
      rating: 4,
      comment: null,
      createdAt: '2026-05-14T10:15:00Z',
    },
  },
};

export const LowRating: Story = {
  args: {
    review: {
      id: 'rev_125',
      rating: 2,
      comment: 'The items were wilted upon arrival and pickup was delayed.',
      createdAt: '2026-05-12T09:00:00Z',
    },
  },
};
