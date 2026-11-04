import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { CartFab } from './CartFab';

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
            data: [
              {
                seller: { id: 'test', name: 'Test' },
                items: [
                  { reservationId: '1', quantityOz: '16', pricePerOz: '0.1' },
                  { reservationId: '2', quantityOz: '32', pricePerOz: '0.2' },
                ],
              },
            ],
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
            data: [],
          }),
        ),
      ],
    },
  },
};
