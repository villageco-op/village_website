import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { CartFab } from './CartFab';

import { CartProvider } from '@/hooks/useCartUI';
import type { User } from '@/lib/api/generated/models/user';

const mockUser: User = {
  id: 'buyer_123',
  name: 'County Fresh Mkt',
  organization: null,
  email: 'purchasing@countyfresh.com',
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=150&h=150&auto=format&fit=crop',
  aboutMe: 'A local market bringing fresh valley produce to Gary, IN.',
  deliveryRangeMiles: '0',
  specialties: [],
  goal: '90',
  stripeOnboardingComplete: false,
  isOnboardingComplete: true,
  address: '456 Market Ave',
  city: 'Gary',
  lat: 41.59,
  lng: -87.34,
  state: 'IN',
  country: 'United States',
  zip: '92921',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockAuthSession = http.get('*/api/auth/session', () =>
  HttpResponse.json({
    user: mockUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }),
);

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const meta: Meta<typeof CartFab> = {
  title: 'Cart/CartFab',
  component: CartFab,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <CartProvider>
            <div className="relative h-75 w-full bg-slate-50">
              <Story />
            </div>
          </CartProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CartFab>;

export const Visible: Story = {
  parameters: {
    msw: {
      handlers: [
        mockAuthSession,
        http.get('*/cart*', () =>
          HttpResponse.json({
            status: 200,
            data: {
              data: [
                {
                  seller: { id: 'test', name: 'Test' },
                  items: [
                    { reservationId: '1', quantityOz: '16', pricePerOz: '0.1' },
                    { reservationId: '2', quantityOz: '32', pricePerOz: '0.2' },
                  ],
                },
              ],
            },
          }),
        ),
      ],
    },
  },
};

export const Hidden: Story = {
  parameters: {
    msw: {
      handlers: [
        mockAuthSession,
        http.get('*/cart*', () =>
          HttpResponse.json({
            status: 200,
            data: { data: [] }, // Empty cart -> hidden FAB
          }),
        ),
      ],
    },
  },
};
