import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerDashboardClient from './SellerDashboardClient';

import {
  SubscriptionStatus,
  OrderPaymentMethod,
  OrderFulfillmentType,
  OrderStatusProperty,
} from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_DASHBOARD_DATA = {
  sellerLocation: {
    lat: 0.0,
    lng: 34.0,
    address: 'Austin, TX',
  },
  earnedThisMonth: 1250.5,
  completedOrdersThisMonth: 56,
  pendingOrders: 3,
  activeSubscriptions: 5,
  onTrackWithGoal: true,
  monthlyGoal: 2000.0,
  earningsByProduceThisMonth: [
    { produceName: 'Strawberries', amount: 450 },
    { produceName: 'Tomatoes', amount: 300 },
    { produceName: 'Honey', amount: 500.5 },
  ],
};

const PAGE_LIMIT = 5;

const generateMockOrders = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${7000 + i}`,
    buyerId: 'me',
    sellerId: i % 2 === 0 ? 'grower-alpha' : 'grower-beta',
    paymentMethod: OrderPaymentMethod.card,
    fulfillmentType: OrderFulfillmentType.delivery,
    scheduledTime: new Date().toISOString(),
    status: OrderStatusProperty.pending,
    totalAmount: (Math.random() * 100 + 20).toFixed(2),
    createdAt: new Date().toISOString(),
  }));
};

const PAGINATED_ORDERS_DATA = generateMockOrders(25);

const generateMockSubscriptions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sub-${i + 1}`,
    quantityOz: (i + 4).toString(),
    status: i % 3 === 0 ? SubscriptionStatus.paused : SubscriptionStatus.active,
    fulfillmentType: i % 2 === 0 ? 'delivery' : 'pickup',
    nextDeliveryDate: '2026-06-15T10:00:00Z',
    product: { title: `Premium Produce ${i + 1}` },
    seller: { name: `Farmer ${i + 1}`, id: `seller_${i + 1}` },
  }));
};

const PAGINATED_DATA = generateMockSubscriptions(25);

const MOCK_SUBSCRIPTIONS = {
  data: PAGINATED_DATA.slice(0, 3),
  meta: { total: 3, page: 1, limit: 12, totalPages: 1, activeCount: 2 },
};

const MOCK_USER_DATA = {
  id: 'usr_789',
  name: 'Alex Rivera',
  email: 'alex@village.com',
  emailVerified: null,
  image: null,
  organizationId: null,
  orgRole: null,
  aboutMe: 'Growing micro greens and crisp radishes in raised garden beds.',
  specialties: ['Radishes', 'Microgreens'],
  goal: '250',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'IL',
  country: 'United States',
  zip: '62701',
  lat: null,
  lng: null,
  deliveryRangeMiles: '10',
  stripeAccountId: 'acct_123',
  stripeOnboardingComplete: false,
  createdAt: null,
  updatedAt: null,
};

const meta: Meta<typeof SellerDashboardClient> = {
  title: 'Seller/Dashboard/DashboardPage',
  component: SellerDashboardClient,
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
          <div className="min-h-screen bg-background p-8">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerDashboardClient>;

/**
 * Standard successful data load
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', () => {
          return HttpResponse.json(MOCK_DASHBOARD_DATA);
        }),
        http.get('*/api/orders*', () => {
          return HttpResponse.json({
            data: PAGINATED_ORDERS_DATA.slice(0, 2),
            meta: { total: 2, page: 1, limit: PAGE_LIMIT, totalPages: 1 },
          });
        }),
        http.get('*/api/subscriptions', () => HttpResponse.json(MOCK_SUBSCRIPTIONS)),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_USER_DATA,
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if header rendered
    await expect(await canvas.findByText(/Alex/i)).toBeInTheDocument();

    // Check if stats are visible
    await expect(canvas.getByText(/56/i)).toBeInTheDocument();

    // Check if progress is visible
    await expect(canvas.getByText(/1251/i)).toBeInTheDocument();

    // Check for specific produce in the breakdown
    await expect(canvas.getByText(/Strawberries/i)).toBeInTheDocument();
  },
};

/**
 * Demonstrates the skeleton loading state
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Demonstrates the error state when the API fails
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const errorMsg = await canvas.findByText(/Failed to load dashboard data/i);
    await expect(errorMsg).toBeInTheDocument();
  },
};

/**
 * Dashboard state for a new seller with no data
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', () => {
          return HttpResponse.json({
            sellerLocation: 'New York, NY',
            earnedThisMonth: 0,
            completedOrdersThisMonth: 0,
            pendingOrders: 0,
            activeSubscriptions: 0,
            onTrackWithGoal: false,
            monthlyGoal: 1000,
            earningsByProduceThisMonth: [],
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json({
            data: [],
            meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 },
          }),
        ),
        http.get('*/api/subscriptions', () =>
          HttpResponse.json({
            data: [],
            meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 },
          }),
        ),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_USER_DATA,
          });
        }),
      ],
    },
  },
};
