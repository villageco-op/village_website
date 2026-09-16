import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import StripeReturnSuccessPage from './StripeConnectionSuccess';

const meta: Meta<typeof StripeReturnSuccessPage> = {
  title: 'Onboarding/Individual/StripeReturnSuccessPage',
  component: StripeReturnSuccessPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 min-h-screen flex items-center justify-center bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StripeReturnSuccessPage>;

/**
 * Default view presented to the user upon returning from a successful Stripe onboarding flow.
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/seller/onboarding/success',
        query: {},
      },
    },
  },
};
