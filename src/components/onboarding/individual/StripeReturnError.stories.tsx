import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { delay, http, HttpResponse } from 'msw';

import StripeReturnErrorPage from './StripeReturnError';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof StripeReturnErrorPage> = {
  title: 'Onboarding/Individual/StripeReturnErrorPage',
  component: StripeReturnErrorPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/onboarding/stripe-return/error',
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
type Story = StoryObj<typeof StripeReturnErrorPage>;

/**
 * Default initial view showing the connection status error card with action buttons.
 */
export const Default: Story = {};

/**
 * Tests the successful retry flow when generating a new onboarding link.
 */
export const RetrySuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const retryBtn = await canvas.findByRole('button', { name: /Try Connecting Again/i });
    const returnBtn = await canvas.findByRole('link', { name: /Return to Onboarding/i });

    await expect(retryBtn).toBeInTheDocument();
    await expect(returnBtn).toBeInTheDocument();

    await userEvent.click(retryBtn);

    // Verify loading state is triggered
    await expect(
      await canvas.findByRole('button', { name: /Preparing Link.../i }),
    ).toBeInTheDocument();
  },
};

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
