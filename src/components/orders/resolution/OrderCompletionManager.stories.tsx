import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { OrderCompletionDialog } from './OrderCompletionDialog';
import { OrderCompletionManager } from './OrderCompletionManager';

import { OrderCompletionProvider } from '@/components/providers/OrderCompletionProvider';
import { Toaster } from '@/components/ui/sonner';
import { BASE_MOCK_ORDER } from '@/lib/storybook/mocks/order.mock';
import { createPaginatedResponse } from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_BUYER_USER = {
  id: 'user_buyer_123',
  email: 'buyer@example.com',
  stripeOnboardingComplete: false,
};

const MOCK_SELLER_USER = {
  id: 'user_seller_456',
  email: 'seller@example.com',
  stripeOnboardingComplete: true,
};

const pastScheduledTime = new Date(Date.now() - 3600 * 1000 * 3).toISOString(); // 3 hours ago
const oldSellerScheduledTime = new Date(Date.now() - 3600 * 1000 * 30).toISOString(); // 30 hours ago

const MOCK_BUYER_ORDERS = [
  {
    id: 'ord_buyer_1',
    sellerId: 'user_seller_456',
    scheduledTime: pastScheduledTime,
    fulfillmentType: 'delivery',
    status: 'paid',
    buyerReport: null,
    sellerReport: null,
    seller: {
      name: 'Jane Seller',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    items: [
      {
        product: {
          title: 'Artisan Sourdough Loaf',
        },
      },
    ],
  },
];

const MOCK_SELLER_ORDERS = [
  {
    id: 'ord_seller_1',
    sellerId: 'user_seller_456',
    scheduledTime: oldSellerScheduledTime,
    fulfillmentType: 'pickup',
    status: 'paid',
    buyerReport: null,
    sellerReport: null,
    seller: {
      name: 'Jane Seller',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    items: [
      {
        product: {
          title: 'Organic Honey Jar',
        },
      },
    ],
  },
];

const secondaryScheduledTime = new Date(Date.now() - 3600 * 1000 * 5).toISOString(); // 5 hours ago

const MOCK_MULTIPLE_BUYER_ORDERS = [
  ...MOCK_BUYER_ORDERS,
  {
    id: 'ord_buyer_2',
    sellerId: 'user_seller_789',
    scheduledTime: secondaryScheduledTime,
    fulfillmentType: 'pickup',
    status: 'paid',
    buyerReport: null,
    sellerReport: null,
    seller: {
      name: 'Sam Farmer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    items: [
      {
        product: {
          title: 'Fresh Organic Eggs (1 Dozen)',
        },
      },
    ],
  },
];

const meta: Meta<typeof OrderCompletionManager> = {
  title: 'Orders/OrderCompletionManager',
  component: OrderCompletionManager,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      // Clear localStorage demo keys to ensure popups show up fresh in stories
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="w-150 h-100 flex items-center justify-center bg-stone-50 border rounded-lg p-6">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OrderCompletionManager>;

/**
 * Standalone presentation of the OrderCompletionDialog component for buyers.
 */
export const DialogBuyerDefault: StoryObj<typeof OrderCompletionDialog> = {
  render: () => (
    <OrderCompletionDialog
      isOpen={true}
      onClose={() => {}}
      title="Did you receive your order?"
      description="Please confirm whether your scheduled delivery arrived successfully."
      currentIndex={0}
      totalCount={1}
      order={BASE_MOCK_ORDER}
    >
      <div className="flex flex-col gap-3 pt-2">
        <button className="w-full py-2 bg-emerald-800 text-white font-bold rounded">
          Yes, Order Delivered
        </button>
        <button className="w-full py-2 bg-red-600 text-white rounded">
          No, I didn&apos;t receive it
        </button>
      </div>
    </OrderCompletionDialog>
  ),
};

/**
 * Buyer view when a past-due order requires confirmation.
 */
export const BuyerPendingCompletion: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_BUYER_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse(MOCK_BUYER_ORDERS)),
        ),
      ],
    },
  },
  render: () => (
    <OrderCompletionProvider>
      <OrderCompletionManager />
    </OrderCompletionProvider>
  ),
};

/**
 * Seller view when a past-due order (>24h) requires fulfillment verification.
 */
export const SellerPendingCompletion: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_SELLER_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse(MOCK_SELLER_ORDERS)),
        ),
      ],
    },
  },
  render: () => (
    <OrderCompletionProvider>
      <OrderCompletionManager />
    </OrderCompletionProvider>
  ),
};

/**
 * Buyer view when multiple past-due orders require confirmation in a queue.
 */
export const MultipleBuyerPendingCompletion: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_BUYER_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse(MOCK_MULTIPLE_BUYER_ORDERS)),
        ),
      ],
    },
  },
  render: () => (
    <OrderCompletionProvider>
      <OrderCompletionManager />
    </OrderCompletionProvider>
  ),
};

/**
 * Interaction test verifying that a buyer confirming delivery triggers the API call and opens the review workflow.
 */
export const BuyerConfirmDeliveryFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_BUYER_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse(MOCK_BUYER_ORDERS)),
        ),
        http.post('*/api/orders/ord_buyer_1/report', async () => {
          await delay(500);
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  render: () => (
    <OrderCompletionProvider>
      <OrderCompletionManager />
    </OrderCompletionProvider>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Wait for dialog title to appear
    const dialogTitle = await body.findByText(/Did you receive your order?/i);
    await expect(dialogTitle).toBeInTheDocument();

    // Click "Yes, Order Delivered"
    const confirmButton = body.getByRole('button', { name: /Yes, Order Delivered/i });
    await expect(confirmButton).toBeEnabled();
    await userEvent.click(confirmButton);

    // Verify success toast or subsequent review view renders
    await expect(
      await body.findByText(/Order status updated successfully!/i, {}, { timeout: 4000 }),
    ).toBeInTheDocument();
  },
};
