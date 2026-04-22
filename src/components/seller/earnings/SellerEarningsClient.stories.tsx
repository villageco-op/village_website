import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerEarningsClient from './SellerEarningsClient';

import type { SellerEarningsResponse, PayoutHistoryResponse } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const PAGE_LIMIT = 12;

const MOCK_EARNINGS: SellerEarningsResponse = {
  earnedThisMonth: 850.5,
  earnedLastMonth: 720.0,
  remainingToGoal: 149.5,
  monthlyGoal: 1000.0,
  totalEarnedYTD: 4250.75,
  ytdStartDate: '2024-01-01T00:00:00Z',
  avgPerLbSold: 4.25,
  amountSoldDollarsPerProduceThisMonth: [
    { produceName: 'Lacinato Kale', amount: 350.5 },
    { produceName: 'Heirloom Tomatoes', amount: 300.0 },
    { produceName: 'Fresh Basil', amount: 200.0 },
  ],
};

const MOCK_PAYOUTS: PayoutHistoryResponse = {
  data: [
    {
      date: '2024-04-15T10:30:00Z',
      buyerName: 'The Daily Grind Coffee',
      productName: 'Fresh Basil',
      quantityLbs: 5,
      amountDollars: 45.0,
    },
    {
      date: '2024-04-12T14:20:00Z',
      buyerName: 'Green Sprout Kitchen',
      productName: 'Lacinato Kale',
      quantityLbs: 12,
      amountDollars: 72.0,
    },
    {
      date: '2024-04-10T09:00:00Z',
      buyerName: 'Local Roots Market',
      productName: 'Heirloom Tomatoes',
      quantityLbs: 20,
      amountDollars: 120.0,
    },
  ],
  meta: { total: 3, page: 1, limit: 50, totalPages: 1 },
};

const generateMockPayouts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(2026, 3, 20 - i).toISOString(),
    buyerName: `Buyer ${i + 1}`,
    productName: `Bulk Item ${i + 1}`,
    quantityLbs: 10,
    amountDollars: 50.0,
  }));
};

const PAGINATED_DATA = generateMockPayouts(25);

const meta: Meta<typeof SellerEarningsClient> = {
  title: 'Seller/Earnings/EarningsPage',
  component: SellerEarningsClient,
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
          <div className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-5xl">
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerEarningsClient>;

/**
 * Standard view showing active earnings progress, stats, and payout history.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/earnings', () => {
          return HttpResponse.json({ data: MOCK_EARNINGS, status: 200 });
        }),
        http.get('*/api/seller/payouts', () => {
          return HttpResponse.json({ data: MOCK_PAYOUTS, status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check main stats
    await expect(await canvas.findByText(/\$850\.50/i)).toBeInTheDocument();
    await expect(canvas.getByText(/\$1000\.00/i)).toBeInTheDocument();

    // Check produce breakdown
    await expect(canvas.getByText('Lacinato Kale')).toBeInTheDocument();

    // Check payout history
    await expect(canvas.getByText('The Daily Grind Coffee')).toBeInTheDocument();
  },
};

/**
 * Pagination state with multiple pages of payout history.
 */
export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/earnings', () => {
          return HttpResponse.json({ data: MOCK_EARNINGS, status: 200 });
        }),
        http.get('*/api/seller/payouts', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;
          const items = PAGINATED_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_DATA.length,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(PAGINATED_DATA.length / PAGE_LIMIT),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Buyer 1')).toBeInTheDocument();
    await expect(canvas.queryByText(`Buyer ${PAGE_LIMIT + 1}`)).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    nextButton.click();

    await expect(await canvas.findByText(`Buyer ${PAGE_LIMIT + 1}`)).toBeInTheDocument();
    await expect(canvas.queryByText('Buyer 1')).not.toBeInTheDocument();
  },
};

/**
 * View when the seller has exceeded their monthly goal.
 */
export const GoalExceeded: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/earnings', () => {
          return HttpResponse.json({
            data: {
              ...MOCK_EARNINGS,
              earnedThisMonth: 1200,
              remainingToGoal: 0,
            },
            status: 200,
          });
        }),
        http.get('*/api/seller/payouts', () => {
          return HttpResponse.json({ data: MOCK_PAYOUTS, status: 200 });
        }),
      ],
    },
  },
};

/**
 * Loading state utilizing the EarningsSkeleton.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/earnings', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        http.get('*/api/seller/payouts', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Empty state for a new seller with no historical data or sales.
 */
export const NewSeller: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/earnings', () => {
          return HttpResponse.json({
            data: {
              earnedThisMonth: 0,
              earnedLastMonth: 0,
              remainingToGoal: 500,
              monthlyGoal: 500,
              totalEarnedYTD: 0,
              ytdStartDate: new Date().toISOString(),
              avgPerLbSold: 0,
              amountSoldDollarsPerProduceThisMonth: [],
            },
            status: 200,
          });
        }),
        http.get('*/api/seller/payouts', () => {
          return HttpResponse.json({
            status: 200,
            data: [],
            meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
          });
        }),
      ],
    },
  },
};

/**
 * Error state when the API fails to fetch earnings or payouts.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/earnings', () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.get('*/api/seller/payouts', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load earnings data/i)).toBeInTheDocument();
  },
};
