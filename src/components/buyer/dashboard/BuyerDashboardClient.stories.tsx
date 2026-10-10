import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerDashboardClient from './BuyerDashboardClient';

import {
  OrderStatusProperty,
  OrderPaymentMethod,
  OrderFulfillmentType,
  SubscriptionStatus,
} from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

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

const MOCK_DASHBOARD_STATS = {
  onOrderThisWeekLbs: 342,
  totalSpendThisMonth: '1850.50',
  activeSubscriptions: 3,
  localGrowersSupplying: 6,
};

const MOCK_GROWERS_LIST = [
  {
    sellerId: 'grower-alpha',
    name: 'Alpha Farms',
    lat: 41.61,
    lng: -87.34,
    image: 'https://i.pravatar.cc/150?u=alpha',
    rating: 4.9,
    city: 'Gary',
    distanceMiles: 3.2,
    specialties: ['Hydroponic Lettuce', 'Basil', 'Microgreens'],
  },
  {
    sellerId: 'grower-beta',
    name: 'Beta Gardens',
    lat: 41.59,
    lng: -87.32,
    image: null,
    rating: 4.2,
    city: 'Hobart',
    distanceMiles: 7.5,
    specialties: ['Honey', 'Wildflowers'],
  },
];

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

const meta: Meta<typeof BuyerDashboardClient> = {
  title: 'Buyer/Dashboard/DashboardPage',
  component: BuyerDashboardClient,
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
          <div className="min-h-screen bg-slate-50/30 p-8">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerDashboardClient>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => HttpResponse.json(MOCK_DASHBOARD_STATS)),
        http.get('*/api/orders*', () => {
          return HttpResponse.json({
            data: PAGINATED_ORDERS_DATA.slice(0, 2),
            meta: { total: 2, page: 1, limit: PAGE_LIMIT, totalPages: 1 },
          });
        }),
        http.get('*/api/growers/growers-map*', () => HttpResponse.json(MOCK_GROWERS_LIST)),
        http.get('*/api/subscriptions', () => HttpResponse.json(MOCK_SUBSCRIPTIONS)),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_USER_DATA,
          });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => new HttpResponse(null, { status: 500 })),
        http.get('*/api/orders*', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => {
          return HttpResponse.json({
            ...MOCK_DASHBOARD_STATS,
            onOrderThisWeekLbs: 0,
            totalSpendThisMonth: '0',
            activeSubscriptions: 0,
            localGrowersSupplying: 0,
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json({
            data: [],
            meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 },
          }),
        ),
        http.get('*/api/growers/growers-map*', () => HttpResponse.json([])),
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
