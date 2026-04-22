import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerBillingClient from './BuyerBillingClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const PAGE_LIMIT = 12;

const generateMockInvoices = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `inv_${1000 + i}`,
    totalAmount: (Math.random() * 200 + 50).toFixed(2),
    fulfillmentType: i % 2 === 0 ? 'delivery' : 'pickup',
    scheduledTime: new Date(Date.now() - 86400000 * i).toISOString(),
    status: 'completed',
    paymentMethod: i % 3 === 0 ? 'card' : 'snap',
  }));
};

const PAGINATED_INVOICES_DATA = generateMockInvoices(25);

const MOCK_BILLING_SUMMARY = {
  totalSpent: 842.5,
  totalProduceLbs: 312,
  avgCostPerLb: 2.7,
  localSourcingPercentage: 92,
};

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
        http.get('*/api/buyer/billing-summary', () =>
          HttpResponse.json({ status: 200, data: MOCK_BILLING_SUMMARY }),
        ),
        http.get('*/api/orders', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              data: PAGINATED_INVOICES_DATA.slice(0, 2),
              meta: { total: 2, page: 1, limit: PAGE_LIMIT, totalPages: 1 },
            },
          });
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
        http.get('*/api/buyer/billing-summary', () =>
          HttpResponse.json({ status: 200, data: MOCK_BILLING_SUMMARY }),
        ),
        http.get('*/api/orders', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;
          const items = PAGINATED_INVOICES_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_INVOICES_DATA.length,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(PAGINATED_INVOICES_DATA.length / PAGE_LIMIT),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText(/#INV_1000/i)).toBeInTheDocument();
    await expect(canvas.queryByText(`#INV_${1000 + PAGE_LIMIT}`)).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    await expect(await canvas.findByText(`#INV_${1000 + PAGE_LIMIT}`)).toBeInTheDocument();
    await expect(canvas.queryByText(/#INV_1000/i)).not.toBeInTheDocument();
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
            status: 200,
            data: {
              totalSpent: 0,
              totalProduceLbs: 0,
              avgCostPerLb: 0,
              localSourcingPercentage: 0,
            },
          });
        }),
        http.get('*/api/orders', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 } },
          });
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
