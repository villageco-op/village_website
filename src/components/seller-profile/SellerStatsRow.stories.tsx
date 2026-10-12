import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerStatsRow from './SellerStatsRow';

import { MOCK_SELLER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';

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
    profile: MOCK_SELLER_PUBLIC_PROFILE,
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
