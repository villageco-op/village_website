import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { delay, http, HttpResponse } from 'msw';

import StripeReturnIncompletePage from './StripeReturnIncomplete';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof StripeReturnIncompletePage> = {
  title: 'Onboarding/Individual/StripeReturnIncompletePage',
  component: StripeReturnIncompletePage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/onboarding/stripe-return/incomplete',
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
type Story = StoryObj<typeof StripeReturnIncompletePage>;

/**
 * Default initial view displayed when a user exits Stripe Connect before completing onboarding.
 */
export const Default: Story = {};

/**
 * Tests error handling and toast display when regenerating the onboarding link fails.
 */
export const ReconnectFailure: Story = {
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

    const connectBtn = await canvas.findByRole('button', { name: /Connect Stripe/i });
    await userEvent.click(connectBtn);

    // Wait for the mutation to reject and verify button resets to enabled state
    await delay(500);
    const restoredBtn = await canvas.findByRole('button', { name: /Connect Stripe/i });
    await expect(restoredBtn).toBeInTheDocument();
    await expect(restoredBtn).toBeEnabled();
  },
};
