import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerHero from './SellerHero';

import { MOCK_SELLER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';

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
    profile: MOCK_SELLER_PUBLIC_PROFILE,
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
