import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import BuyerAboutTab from './BuyerAboutTab';

import { MOCK_BUYER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';

const meta: Meta<typeof BuyerAboutTab> = {
  title: 'Profile/BuyerAboutTab',
  component: BuyerAboutTab,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="container-custom max-w-5xl mx-auto py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerAboutTab>;

export const Complete: Story = {
  args: {
    profile: MOCK_BUYER_PUBLIC_PROFILE,
  },
};
