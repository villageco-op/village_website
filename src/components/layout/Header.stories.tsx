import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Header } from './Header';

import { CartProvider } from '@/hooks/useCartUI';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <CartProvider>
            <Story />
          </CartProvider>
        </QueryClientProvider>
      );
    },
  ],
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
