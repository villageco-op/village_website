import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { delay, http, HttpResponse } from 'msw';

import StripeRefreshErrorPage from './StripeRefreshError';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof StripeRefreshErrorPage> = {
  title: 'Onboarding/Individual/StripeRefreshErrorPage',
  component: StripeRefreshErrorPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/onboarding/stripe-refresh/error',
      },
    },
    msw: {
      handlers: [
        http.post('*/api/stripe/connect/onboard', async () => {
          await delay(300);
          return HttpResponse.json({
            url: 'https://connect.stripe.com/setup/s/mock_retry_session',
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <div className="p-6 min-h-screen flex items-center justify-center bg-background">
          <Story />
        </div>
        <Toaster />
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StripeRefreshErrorPage>;

/**
 * Default initial view showing the expired session card with the retry action button.
 */
export const Default: Story = {};

/**
 * Tests error handling when the backend fails to regenerate the Stripe onboarding link.
 */
export const RetryFailure: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/stripe/connect/onboard', async () => {
          await delay(300);
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const retryBtn = await canvas.findByRole('button', { name: /Try Connecting Again/i });
    await userEvent.click(retryBtn);

    // Wait for network failure state to finish and verify button reverts to enabled state
    await delay(500);
    const restoredBtn = await canvas.findByRole('button', { name: /Try Connecting Again/i });
    await expect(restoredBtn).toBeInTheDocument();
    await expect(restoredBtn).toBeEnabled();
  },
};
