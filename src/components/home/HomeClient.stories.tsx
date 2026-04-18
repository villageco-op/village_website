import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StoryBookHomeClient } from './StoryBookHomeClient';

const meta: Meta<typeof StoryBookHomeClient> = {
  title: 'Home/HomePage',
  component: StoryBookHomeClient,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StoryBookHomeClient>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
