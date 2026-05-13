import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { BuyerOrderForm } from './OrderBuyerForm';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_PRODUCE_ID = 'prod_berry_456';

const meta: Meta<typeof BuyerOrderForm> = {
  title: 'Buyer/NewOrder/BuyerOrderForm',
  component: BuyerOrderForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    produceId: MOCK_PRODUCE_ID,
    onClose: () => console.log('On close called.'),
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="p-4">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerOrderForm>;

/**
 * Standard view with stock available and subscription enabled.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_PRODUCE_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              id: MOCK_PRODUCE_ID,
              title: 'Heirloom Tomatoes',
              pricePerOz: '0.25', // $4.00 per lb
              totalOzInventory: '160', // 10 lbs
              isSubscribable: true,
              harvestFrequencyDays: 7,
            },
          });
        }),
      ],
    },
  },
};

/**
 * Tests adding an item to the cart successfully.
 */
export const AddToCartSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.post('*/api/cart/add', async () => {
          await delay(500);
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cartBtn = await canvas.findByRole('button', { name: /Add to Cart/i });

    await userEvent.click(cartBtn);

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Added to cart!/i)).toBeInTheDocument();
  },
};

/**
 * State when the product has no inventory.
 */
export const OutOfStock: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_PRODUCE_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              id: MOCK_PRODUCE_ID,
              title: 'Out of Stock Peaches',
              pricePerOz: '0.50',
              totalOzInventory: '0',
              isSubscribable: false,
            },
          });
        }),
      ],
    },
  },
};

/**
 * Error state when API fails to load.
 */
export const LoadError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_PRODUCE_ID}`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * View with subscription pre-selected to verify recurring pricing text.
 */
export const SubscriptionEnabled: Story = {
  parameters: {
    msw: {
      handlers: [...Default.parameters!.msw.handlers],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the toggle (assuming it's a checkbox or switch role)
    const toggle = await canvas.findByRole('checkbox');
    await userEvent.click(toggle);

    // 1. Check if the subtotal suffix appears
    await expect(await canvas.findByText(/\/ weekly/i)).toBeInTheDocument();

    // 2. Check if the "Billed now" helper text appears
    await expect(await canvas.findByText(/Billed now and weekly/i)).toBeInTheDocument();

    // 3. Check if button text updated
    await expect(await canvas.findByRole('button', { name: /Add To Cart/i })).toBeInTheDocument();
  },
};

/**
 * Tests adding a subscription to the cart.
 */
export const AddSubscriptionSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.post('*/api/cart/add', async ({ request }) => {
          const body = (await request.json()) as any;
          // Verify the payload is correct
          if (body.isSubscription === true) {
            return HttpResponse.json({ success: true }, { status: 200 });
          }
          return new HttpResponse(null, { status: 400 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Toggle subscription ON
    const toggle = await canvas.findByRole('checkbox');
    await userEvent.click(toggle);

    const subBtn = await canvas.findByRole('button', { name: /Add To Cart/i });
    await userEvent.click(subBtn);

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Added to cart!/i)).toBeInTheDocument();
  },
};

/**
 * Verifies custom frequency labels (e.g., 14 days)
 */
export const BiWeeklySubscription: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_PRODUCE_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              id: MOCK_PRODUCE_ID,
              title: 'Bi-Weekly Kale',
              pricePerOz: '0.10',
              totalOzInventory: '160',
              isSubscribable: true,
              harvestFrequencyDays: 14,
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = await canvas.findByRole('checkbox');
    await userEvent.click(toggle);

    // Verify it says "every 14 days" instead of "weekly"
    await expect(canvas.getByText(/\/ every 14 days/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Billed now and every 14 days/i)).toBeInTheDocument();
  },
};
