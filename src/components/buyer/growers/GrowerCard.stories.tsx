import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GrowerCard } from './GrowerCard';

const meta: Meta<typeof GrowerCard> = {
  title: 'Buyer/Growers/GrowerCard',
  component: GrowerCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-sm bg-cream">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GrowerCard>;

/**
 * A standard grower card with multiple produce types and active stats.
 */
export const Default: Story = {
  args: {
    grower: {
      sellerId: 'user-1',
      name: 'Green Valley Farm',
      city: 'Austin',
      location: {
        lat: 30.2672,
        lng: -97.7431,
        address: '123 Sunshine Lane',
      },
      produceTypesOrdered: ['Leafy Greens', 'Root Vegetables', 'Herbs'],
      amountOrderedThisMonthLbs: 45.5,
      daysSinceFirstOrder: 120,
      firstOrderDate: '2023-12-15T00:00:00Z',
    },
    index: 3,
  },
};

/**
 * A grower with a long list of produce types to test badge wrapping.
 */
export const ManyProduceTypes: Story = {
  args: {
    grower: {
      ...Default.args?.grower!,
      name: 'Bountiful Harvest Co-op',
      produceTypesOrdered: [
        'Apples',
        'Berries',
        'Stone Fruit',
        'Melons',
        'Citrus',
        'Grapes',
        'Exotics',
      ],
    },
    index: 1,
  },
};

/**
 * State for a new grower relationship with no prior produce data.
 */
export const NewGrower: Story = {
  args: {
    grower: {
      ...Default.args?.grower!,
      name: 'New Sprout Farm',
      produceTypesOrdered: [],
      amountOrderedThisMonthLbs: 0,
      firstOrderDate: new Date().toISOString(),
    },
    index: 0,
  },
};

/**
 * Fallback state when name or address data is missing.
 */
export const MissingData: Story = {
  args: {
    grower: {
      ...Default.args?.grower!,
      name: null,
      location: {
        lat: null,
        lng: null,
        address: null as any,
      },
      city: null,
    },
    index: 2,
  },
};
