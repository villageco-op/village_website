import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';
import React, { useEffect } from 'react';

import { CartDrawer } from './CartDrawer';

import { Toaster } from '@/components/ui/sonner';
import { CartProvider, useCartUI } from '@/hooks/useCartUI';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const MOCK_FULL_CART = {
  status: 200,
  data: {
    data: [
      {
        groupId: 'group_1',
        isSubscription: false,
        frequencyDays: 0,
        fulfillmentType: 'pickup',
        availableBy: new Date().toISOString(),
        deliveryFee: '0.00',
        seller: { id: 'seller_1', name: 'Green Valley Farms' },
        items: [
          {
            reservationId: 'res_101',
            productId: 'prod_1',
            title: 'Organic Honeycrisp Apples',
            pricePerOz: '0.25', // $4.00 / lb
            quantityOz: '32', // 2 lbs
            maxOrderQuantityOz: '160',
            isSubscribable: true,
            isSubscription: false,
            subscriptionFrequencyDays: null,
            subscriptionCostReductionPercent: null,
            expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
            images: ['https://placehold.co/100x100/4CAF50/FFF?text=Apples'],
          },
          {
            reservationId: 'res_103',
            productId: 'prod_3',
            title: 'Heirloom Carrots',
            pricePerOz: '0.15', // $2.40 / lb
            quantityOz: '16', // 1 lb
            maxOrderQuantityOz: '80',
            isSubscribable: true,
            isSubscription: false,
            subscriptionFrequencyDays: null,
            subscriptionCostReductionPercent: null,
            expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
            images: [],
          },
        ],
      },
      {
        groupId: 'group_2',
        isSubscription: true,
        frequencyDays: 8,
        fulfillmentType: 'delivery',
        availableBy: new Date().toISOString(),
        deliveryFee: '5.00',
        seller: { id: 'seller_1', name: 'Green Valley Farms' },
        items: [
          {
            reservationId: 'res_102',
            productId: 'prod_2',
            title: 'Weekly Fresh Strawberries',
            pricePerOz: '0.50', // $8.00 / lb
            quantityOz: '16', // 1 lb
            maxOrderQuantityOz: '80',
            isSubscribable: true,
            isSubscription: true,
            subscriptionFrequencyDays: 7,
            subscriptionCostReductionPercent: 10,
            expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
            images: [],
          },
        ],
      },
      {
        groupId: 'group_3',
        isSubscription: false,
        frequencyDays: 0,
        fulfillmentType: 'pickup',
        availableBy: new Date().toISOString(),
        deliveryFee: '4.50',
        seller: { id: 'seller_2', name: 'Sunny Side Dairy' },
        items: [
          {
            reservationId: 'res_201',
            productId: 'prod_4',
            title: 'Raw Whole Milk (Half Gallon)',
            pricePerOz: '0.12',
            quantityOz: '64',
            maxOrderQuantityOz: '128',
            isSubscribable: false,
            isSubscription: false,
            subscriptionFrequencyDays: null,
            subscriptionCostReductionPercent: null,
            expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
            images: [],
          },
        ],
      },
    ],
  },
};

const MOCK_EMPTY_CART = {
  status: 200,
  data: { data: [] },
};

// Helper component to auto-open the cart drawer on mount for viewing in Storybook
const AutoOpenCartWrapper = ({ children }: { children: React.ReactNode }) => {
  const { openCart } = useCartUI();
  useEffect(() => {
    openCart();
  }, [openCart]);
  return <>{children}</>;
};

const meta: Meta<typeof CartDrawer> = {
  title: 'Cart/CartDrawer',
  component: CartDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <CartProvider>
            <Toaster />
            <AutoOpenCartWrapper>
              <Story />
            </AutoOpenCartWrapper>
          </CartProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CartDrawer>;

/**
 * Standard populated cart with partitioned one-time and subscription groups under multiple sellers.
 */
export const Populated: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/cart*', () => HttpResponse.json(MOCK_FULL_CART))],
    },
  },
};

/**
 * Empty state styling.
 */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/cart*', () => HttpResponse.json(MOCK_EMPTY_CART))],
    },
  },
};

/**
 * Error state where the cart fails to load. The drawer will return null.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/cart*', () => new HttpResponse(null, { status: 500 }))],
    },
  },
};

/**
 * Tests removing an item successfully from the cart drawer.
 */
export const RemoveItemSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/cart*', () => HttpResponse.json(MOCK_FULL_CART)),
        http.delete('*/api/cart/remove/*', async () => {
          await delay(400);
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Find the text "Remove" buttons
    const removeButtons = await body.findAllByText('Remove');
    await expect(removeButtons.length).toBeGreaterThan(0);

    // Click to remove the first item
    await userEvent.click(removeButtons[0]);

    // Ensure the success toast renders (kept from previous implementation)
    await expect(await body.findByText(/Item removed from cart/i)).toBeInTheDocument();
  },
};

/**
 * Tests updating item quantity (waits for 500ms debounce).
 */
export const UpdateQuantitySuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/cart*', () => HttpResponse.json(MOCK_FULL_CART)),
        http.patch('*/api/cart/update/*', async () => {
          await delay(400); // Simulate network delay
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Find the Increase Quantity buttons by their title
    const increaseButtons = await body.findAllByTitle('Increase quantity');
    await expect(increaseButtons.length).toBeGreaterThan(0);

    // Click twice rapidly to test debouncing
    await userEvent.click(increaseButtons[0]);
    await userEvent.click(increaseButtons[0]);

    // Give time for the 500ms debounce to fire the API call
    await new Promise((r) => setTimeout(r, 600));
  },
};

/**
 * Tests toggling an item's subscription status and ensures
 * non-subscribable items do not show the toggle.
 */
export const ToggleSubscriptionSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/cart*', () => HttpResponse.json(MOCK_FULL_CART)),
        http.patch('*/api/cart/update/*', async () => {
          await delay(400);
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const subLabels = await body.findAllByText(/Subscribe & Save/i);
    await expect(subLabels.length).toBeGreaterThan(0);

    const nonSubscribableItem = body.getByText(/Raw Whole Milk/i).closest('div');

    if (nonSubscribableItem) {
      const itemScope = within(nonSubscribableItem);
      await expect(itemScope.queryByText(/Subscribe & Save/i)).not.toBeInTheDocument();
    }

    await userEvent.click(subLabels[0]);

    await new Promise((r) => setTimeout(r, 600));
  },
};

/**
 * Tests toggling the checkout group's fulfillment method via the new checkbox UI.
 */
export const UpdateGroupFulfillmentSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/cart*', () => HttpResponse.json(MOCK_FULL_CART)),
        http.patch('*/api/cart/group/*', async () => {
          await delay(400);
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Find the new delivery checkboxes by their label text
    const deliveryToggles = await body.findAllByText(/Add local delivery/i);
    await expect(deliveryToggles.length).toBeGreaterThan(0);

    // Click the first delivery toggle
    await userEvent.click(deliveryToggles[0]);

    await new Promise((r) => setTimeout(r, 600));
  },
};
