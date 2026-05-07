import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerStatsRow from './SellerStatsRow';

const meta: Meta<typeof SellerStatsRow> = {
  title: 'Seller/Profile/SellerStatsRow',
  component: SellerStatsRow,
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
type Story = StoryObj<typeof SellerStatsRow>;

export const Default: Story = {
  args: {
    profile: {
      id: 'user-1',
      name: 'Sarah Greenfield',
      starRating: 4.8,
      joinedAt: '2022-06-10T00:00:00Z',
      activeBuyerCount: 24,
      image: '',
      aboutMe: null,
      specialties: null,
      country: 'USA',
      state: 'TX',
      city: 'Austin',
      totalReviews: 50,
      reviewBreakdown: { '1': 0, '2': 1, '3': 2, '4': 5, '5': 42 },
    },
  },
};

export const NewSeller: Story = {
  args: {
    profile: {
      ...Default.args?.profile!,
      starRating: 0,
      activeBuyerCount: 0,
      joinedAt: new Date().toISOString(),
    },
  },
};
