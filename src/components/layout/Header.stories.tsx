import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * The default state of the header on the homepage.
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
  },
};

/**
 * Shows the "Producer" tab as the active link.
 */
export const ProducerActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/producer',
      },
    },
  },
};

/**
 * Shows the "Buyer" tab as the active link.
 */
export const BuyerActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer',
      },
    },
  },
};

/**
 * Shows the delivery link as active.
 */
export const DeliverActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/deliver',
      },
    },
  },
};
