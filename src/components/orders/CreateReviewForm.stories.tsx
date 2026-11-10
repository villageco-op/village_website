import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { CreateReviewForm } from './CreateReviewForm';

import { Toaster } from '@/components/ui/sonner';
import { MOCK_SELLER_USER } from '@/lib/storybook/mocks/user.mock';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof CreateReviewForm> = {
  title: 'Orders/OrderDetails/CreateReviewForm',
  component: CreateReviewForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    sellerId: MOCK_SELLER_USER.id,
    orderId: 'order_abc123',
    sellerName: MOCK_SELLER_USER.name,
    sellerImage: MOCK_SELLER_USER.image,
    itemNames: ['Fresh Organic Kale', 'Heirloom Carrots'],
    fulfillmentType: 'pickup',
    scheduledTime: '2026-05-15T14:00:00Z',
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="w-110">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CreateReviewForm>;

/**
 * Default view with pre-filled seller, items, and pickup details.
 */
export const Default: Story = {};

/**
 * View showing delivery details instead of pickup.
 */
export const DeliveryFulfillment: Story = {
  args: {
    fulfillmentType: 'delivery',
    scheduledTime: '2026-05-18T10:30:00Z',
  },
};

/**
 * Story testing form submission interaction and MSW POST request handling.
 */
export const SubmitReviewInteraction: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/reviews', async () => {
          await delay(600);
          return HttpResponse.json({ id: 'review_999' }, { status: 201 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Select 4 stars
    const starBtn = canvas.getByRole('button', { name: /Rate 4 stars/i });
    await userEvent.click(starBtn);

    // Type comment
    const commentInput = canvas.getByPlaceholderText(/Tell others about the quality/i);
    await userEvent.type(commentInput, 'The produce was vibrant and incredibly fresh!');

    // Submit form
    const submitBtn = canvas.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitBtn);

    // Assert toast appears
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/Review submitted successfully/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  },
};
