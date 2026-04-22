'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerSubscriptionsClient from './SellerSubscriptionsClient';

import { Toaster } from '@/components/ui/sonner';
import { SubscriptionStatus } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_SELLER_SUBSCRIPTIONS = {
  status: 200,
  data: {
    data: [
      {
        id: 'sub-seller-1',
        quantityOz: '16',
        status: SubscriptionStatus.active,
        fulfillmentType: 'delivery',
        nextDeliveryDate: '2026-05-20T10:00:00Z',
        product: { id: 'prod_honeycrisp', title: 'Organic Honeycrisp Apples' },
        buyer: { id: 'user_john', name: 'John Doe' },
      },
      {
        id: 'sub-seller-2',
        quantityOz: '32',
        status: SubscriptionStatus.active,
        fulfillmentType: 'pickup',
        nextDeliveryDate: '2026-05-21T09:00:00Z',
        product: { id: 'prod_goat_milk', title: 'Raw Goat Milk' },
        buyer: { id: 'user_jane', name: 'Jane Smith' },
      },
      {
        id: 'sub-seller-3',
        quantityOz: '4',
        status: SubscriptionStatus.paused,
        fulfillmentType: 'delivery',
        nextDeliveryDate: null,
        product: { id: 'prod_saffron', title: 'Saffron Threads' },
        buyer: { id: 'user_robert', name: 'Robert Miller' },
      },
    ],
    meta: { total: 3, page: 1, limit: 12, totalPages: 1, activeCount: 2 },
  },
};

const generateMockSubscriptions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sub-seller-${i + 1}`,
    quantityOz: '16',
    status: SubscriptionStatus.active,
    fulfillmentType: 'delivery',
    nextDeliveryDate: '2026-05-20T10:00:00Z',
    product: { id: `prod_${i + 1}`, title: `Subscription Item ${i + 1}` },
    buyer: { id: `buyer_${i + 1}`, name: `Customer ${i + 1}` },
  }));
};

const PAGINATED_DATA = generateMockSubscriptions(25);

const meta: Meta<typeof SellerSubscriptionsClient> = {
  title: 'Seller/Subscriptions/SellerSubscriptionsPage',
  component: SellerSubscriptionsClient,
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
          <div className="min-h-screen bg-slate-50">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerSubscriptionsClient>;

/**
 * Verifies that the dashboard loads and that hovering a card 
 * reveals ID-based actions for both Buyer and Product.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json(MOCK_SELLER_SUBSCRIPTIONS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check header
    await expect(await canvas.findByText(/You are fulfilling 2 active subscriptions/i)).toBeInTheDocument();
    
    // Check specific card content
    await expect(canvas.getByText('John Doe')).toBeInTheDocument();
    await expect(canvas.getByText('Organic Honeycrisp Apples')).toBeInTheDocument();

    // Test Hover Actions
    const firstCard = canvas.getByText('Organic Honeycrisp Apples').closest('.group');
    if (firstCard) {
      await userEvent.hover(firstCard);
      
      // Verify Product Actions
      await expect(canvas.getAllByTitle(/Copy Product ID/i)).toHaveLength(3);
      await expect(canvas.getAllByTitle(/Filter by Product/i)).toHaveLength(3);
      
      // Verify Buyer Actions
      await expect(canvas.getAllByTitle(/Copy Buyer ID/i)).toHaveLength(3);
      await expect(canvas.getAllByTitle(/Filter by Buyer/i)).toHaveLength(3);
    }
  },
};

export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 12;
          
          const start = (page - 1) * limit;
          const end = start + limit;
          const items = PAGINATED_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_DATA.length,
                page,
                limit,
                totalPages: Math.ceil(PAGINATED_DATA.length / limit),
                activeCount: 12,
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Customer 1')).toBeInTheDocument();
    await expect(canvas.queryByText('Customer 13')).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    await expect(await canvas.findByText('Customer 13')).toBeInTheDocument();
    await expect(canvas.queryByText('Customer 1')).not.toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', async () => {
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
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } },
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
        http.get('*/api/subscriptions', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};
