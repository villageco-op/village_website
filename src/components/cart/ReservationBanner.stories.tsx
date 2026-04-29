import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { ReservationBanner } from './ReservationBanner';

import { CartProvider } from '@/hooks/useCartUI';

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
            {/* Give some padding so the sticky banner top-16 is clearly visible */}
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
        http.get('*/cart*', () =>
          HttpResponse.json({
            status: 200,
            data: {
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
            },
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
        http.get('*/cart*', () =>
          HttpResponse.json({
            status: 200,
            data: { data: [] }, // No items -> translates banner out of view
          }),
        ),
      ],
    },
  },
};
