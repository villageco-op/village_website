'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerHelpClient from './BuyerHelpClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof BuyerHelpClient> = {
  title: 'Buyer/Help/BuyerHelpClient',
  component: BuyerHelpClient,
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
          <div className="min-h-screen bg-slate-50">
            <Story />
            <Toaster />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerHelpClient>;

/**
 * Standard authenticated view.
 * Tests the form submission flow and verifies that the authenticated user's email
 * is correctly displayed on the success screen.
 */
export const SuccessfulSubmission: Story = {
  parameters: {
    msw: {
      handlers: [
        // Mock authenticated session
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: { name: 'Buyer Bob', email: 'bob@example.com' },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
        // Mock successful form submission
        http.post('*/api/contact', async () => {
          await delay(500); // Simulate network latency
          return HttpResponse.json({ status: 200, data: { success: true } });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the form to be ready
    const messageInput = await canvas.findByLabelText(/Message \*/i);

    // Submit button should be disabled initially (empty message)
    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await expect(submitButton).toBeDisabled();

    // Fill out the message
    await userEvent.type(messageInput, 'I need help finding local carrots in my area.');

    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    // Verify loading state appears
    await expect(canvas.getByText(/Sending.../i)).toBeInTheDocument();

    // Verify success screen replaces the form
    await expect(await canvas.findByText(/Message Sent!/i)).toBeInTheDocument();

    // Verify the authenticated user's email is shown in the success text
    await expect(canvas.getByText(/bob@example.com/i)).toBeInTheDocument();

    // Verify we can reset the form
    const resetButton = canvas.getByRole('button', { name: /Send another message/i });
    await userEvent.click(resetButton);

    // Form should reappear with message cleared
    await expect(await canvas.findByLabelText(/Message \*/i)).toHaveValue('');
  },
};

/**
 * Error state handling.
 * Verifies that a failed API request properly displays a toast error.
 */
export const ErrorSubmission: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: { name: 'Buyer Bob', email: 'bob@example.com' },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
        // Mock failed form submission
        http.post('*/api/contact', async () => {
          await delay(300);
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const messageInput = await canvas.findByLabelText(/Message \*/i);

    // Type a message to enable submission
    await userEvent.type(messageInput, 'This message will fail.');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await userEvent.click(submitButton);

    // The toaster is rendered in the decorator, so we look for the error text in the body
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/Failed to send message\. Please try again later\./i),
    ).toBeInTheDocument();
  },
};
