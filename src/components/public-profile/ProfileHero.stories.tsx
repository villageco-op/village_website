import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ProfileHero } from './ProfileHero';

import { MOCK_SELLER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';

const meta: Meta<typeof ProfileHero> = {
  title: 'Profile/ProfileHero',
  component: ProfileHero,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileHero>;

export const Default: Story = {
  args: {
    name: MOCK_SELLER_PUBLIC_PROFILE.name,
    image: MOCK_SELLER_PUBLIC_PROFILE.image,
    joinedAt: MOCK_SELLER_PUBLIC_PROFILE.joinedAt as string | null,
    city: MOCK_SELLER_PUBLIC_PROFILE.city,
    state: MOCK_SELLER_PUBLIC_PROFILE.state,
    starRating: MOCK_SELLER_PUBLIC_PROFILE.starRating,
  },
};

export const Anonymous: Story = {
  args: {
    name: null,
    starRating: 0,
    joinedAt: null,
    image: MOCK_SELLER_PUBLIC_PROFILE.image,
    city: MOCK_SELLER_PUBLIC_PROFILE.city,
    state: MOCK_SELLER_PUBLIC_PROFILE.state,
  },
};
