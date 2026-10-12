import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SubscriptionDetailClient from './SubscriptionDetailsClient';

import { Toaster } from '@/components/ui/sonner';
import { SubscriptionStatus } from '@/lib/api/generated/models';
import { BASE_MOCK_SUBSCRIPTION } from '@/lib/storybook/mocks/subscription.mock';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof SubscriptionDetailClient> = {
  title: 'Buyer/Subscriptions/Details/SubscriptionDetailClient',
  component: SubscriptionDetailClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    id: BASE_MOCK_SUBSCRIPTION.id,
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SubscriptionDetailClient>;

/**
 * Standard active subscription view displaying all action buttons and child cards.
 */
export const Active: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${BASE_MOCK_SUBSCRIPTION.id}`, () => {
          return HttpResponse.json(BASE_MOCK_SUBSCRIPTION);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify main components rendered
    await expect(await canvas.findByText(/Subscription Details/i)).toBeInTheDocument();
    await expect(canvas.getByText(BASE_MOCK_SUBSCRIPTION.seller.name!)).toBeInTheDocument();
    await expect(canvas.getByText(/Fresh Organic Microgreens/i)).toBeInTheDocument();

    // Verify action buttons are present
    await expect(canvas.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /Pause/i })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /Edit Subscription/i })).toBeInTheDocument();
  },
};

/**
 * Paused subscription state. The primary action changes from "Pause" to "Resume".
 */
export const Paused: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${BASE_MOCK_SUBSCRIPTION.id}`, () => {
          return HttpResponse.json({
            ...BASE_MOCK_SUBSCRIPTION,
            status: SubscriptionStatus.paused,
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('button', { name: /Resume/i })).toBeInTheDocument();
  },
};

/**
 * Canceled subscription state. The action buttons are hidden.
 */
export const Canceled: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${BASE_MOCK_SUBSCRIPTION.id}`, () => {
          return HttpResponse.json({
            ...BASE_MOCK_SUBSCRIPTION,
            status: SubscriptionStatus.canceled,
            cancelReason: 'Slow harvests, can no longer meet demand.',
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Subscription Details/i)).toBeInTheDocument();

    // Ensure action buttons are gone
    await expect(
      canvas.queryByRole('button', { name: /Edit Subscription/i }),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /Pause/i })).not.toBeInTheDocument();
  },
};

/**
 * Loading state while fetching the subscription data.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${BASE_MOCK_SUBSCRIPTION.id}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Error state shown when the API fails or the subscription ID does not exist.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${BASE_MOCK_SUBSCRIPTION.id}`, () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Subscription not found/i)).toBeInTheDocument();
  },
};

/**
 * Demonstrates the Edit dialog opening.
 */
export const EditInteraction: Story = {
  parameters: { ...Active.parameters },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await canvas.findByText(/Subscription Details/i);

    // Click edit
    const editBtn = canvas.getByRole('button', { name: /Edit Subscription/i });
    await userEvent.click(editBtn);

    // Verify dialog opened
    await expect(await body.findByRole('dialog')).toBeInTheDocument();
    await expect(body.getByText(/Adjust your recurring order details/i)).toBeInTheDocument();
  },
};
