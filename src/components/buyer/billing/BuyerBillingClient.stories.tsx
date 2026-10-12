import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerBillingClient from './BuyerBillingClient';

import { Toaster } from '@/components/ui/sonner';
import { BASE_MOCK_BILLING_SUMMARY } from '@/lib/storybook/mocks/billing.mock';
import { createPaginatedResponse, generateMockOrders } from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const PAGE_LIMIT = 12;
const PAGINATED_INVOICES_DATA = generateMockOrders(25);

const meta: Meta<typeof BuyerBillingClient> = {
  title: 'Buyer/Billing/BillingPage',
  component: BuyerBillingClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="bg-off-white min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerBillingClient>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => HttpResponse.json(BASE_MOCK_BILLING_SUMMARY)),
        http.get('*/api/orders', () => {
          return HttpResponse.json(createPaginatedResponse(PAGINATED_INVOICES_DATA, 1, 2));
        }),
      ],
    },
  },
};

/**
 * Pagination state for the invoice history table.
 */
export const PaginatedHistory: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => HttpResponse.json(BASE_MOCK_BILLING_SUMMARY)),
        http.get('*/api/orders', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          return HttpResponse.json(
            createPaginatedResponse(PAGINATED_INVOICES_DATA, page, PAGE_LIMIT),
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText(/#ORD-7000/i)).toBeInTheDocument();
    await expect(canvas.queryByText(`#ORD-${7000 + PAGE_LIMIT}`)).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    await expect(await canvas.findByText(`#ORD-${7000 + PAGE_LIMIT}`)).toBeInTheDocument();
    await expect(canvas.queryByText(/#ORD-7000/i)).not.toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        http.get('*/api/orders', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => {
          return HttpResponse.json({
            totalSpent: 0,
            totalProduceLbs: 0,
            avgCostPerLb: 0,
            localSourcingPercentage: 0,
          });
        }),
        http.get('*/api/orders', () => {
          return HttpResponse.json(createPaginatedResponse([], 1, PAGE_LIMIT));
        }),
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => new HttpResponse(null, { status: 500 })),
        http.get('*/api/orders', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    ...Default.parameters,
  },
};
