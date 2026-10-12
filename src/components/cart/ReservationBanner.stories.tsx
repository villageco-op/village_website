import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { ReservationBanner } from './ReservationBanner';

import { CartProvider } from '@/hooks/useCartUI';
import { MOCK_BUYER_USER } from '@/lib/storybook/mocks/user.mock';

const mockAuthSession = http.get('*/api/auth/session', () =>
  HttpResponse.json({
    user: MOCK_BUYER_USER,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }),
);

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const meta: Meta<typeof ReservationBanner> = {
  title: 'Cart/ReservationBanner',
  component: ReservationBanner,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <CartProvider>
            <div className="relative min-h-75 w-full bg-slate-50 pt-24">
              <Story />
            </div>
          </CartProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ReservationBanner>;

export const ActiveReservations: Story = {
  parameters: {
    msw: {
      handlers: [
        mockAuthSession,
        http.get('*/cart*', () =>
          HttpResponse.json({
            data: [
              {
                seller: { id: 'seller_1', name: 'Sunny Farms' },
                items: [
                  {
                    reservationId: '1',
                    expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
                  },
                ],
              },
              {
                seller: { id: 'seller_2', name: 'Local Orchard' },
                items: [
                  {
                    reservationId: '2',
                    expiresAt: new Date(Date.now() + 5 * 60000).toISOString(),
                  },
                ],
              },
            ],
          }),
        ),
      ],
    },
  },
};

export const EmptyHidden: Story = {
  parameters: {
    msw: {
      handlers: [
        mockAuthSession,
        http.get('*/cart*', () =>
          HttpResponse.json({
            data: [],
          }),
        ),
      ],
    },
  },
};
