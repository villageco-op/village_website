import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import OrderConfirmationClient from './OrderConfirmationClient';

const meta: Meta<typeof OrderConfirmationClient> = {
  title: 'Buyer/CheckoutSuccess/OrderConfirmationClient',
  component: OrderConfirmationClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderConfirmationClient>;

/**
 * Default state representing a regular organic landing without a specific checkout query session.
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/checkout-success',
        query: {},
      },
    },
  },
};

/**
 * Preferred state with a valid active Stripe checkout session ID rendered into the DOM.
 */
export const WithOrderReference: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/checkout-success',
        query: {
          session_id: 'cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
      },
    },
  },
};
