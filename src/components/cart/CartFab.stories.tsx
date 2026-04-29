import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { CartFab } from './CartFab';

import { CartProvider } from '@/hooks/useCartUI';

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
            {/* Height forces enough space for the fixed FAB to show cleanly */}
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
