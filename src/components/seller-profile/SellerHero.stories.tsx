import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerHero from './SellerHero';

const meta: Meta<typeof SellerHero> = {
  title: 'Seller/Profile/SellerHero',
  component: SellerHero,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SellerHero>;

export const Default: Story = {
  args: {
    profile: {
      id: 'user-1',
      name: 'Sarah Greenfield',
      city: 'Austin',
      state: 'TX',
      starRating: 4.9,
      joinedAt: '2023-01-15T00:00:00Z',
      image: '',
      aboutMe: null,
      specialties: null,
      country: 'USA',
      totalReviews: 128,
      activeBuyerCount: 45,
      reviewBreakdown: { '1': 0, '2': 0, '3': 2, '4': 10, '5': 116 },
    },
  },
};

export const Anonymous: Story = {
  args: {
    profile: {
      ...Default.args?.profile!,
      name: null,
      starRating: 0,
      joinedAt: null,
    },
  },
};
