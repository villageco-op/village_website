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
      organization: null,
      city: 'Austin',
      location: {
        lat: 30.2672,
        lng: -97.7431,
        address: '123 Sunshine Lane',
        city: 'Austin',
        state: 'TX',
        country: 'United States',
        zip: '92921',
      },
      produceTypesOrdered: ['leafy_greens', 'root_vegetables', 'fresh_herbs'],
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
        'stone_fruits',
        'berries',
        'tropical_fruits',
        'melons',
        'stalks_stems',
        'tubers',
        'microgreens',
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
        city: null,
        state: null,
        country: null,
        zip: null,
      },
      city: null,
    },
    index: 2,
  },
};
