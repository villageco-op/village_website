'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrgHelpClient from './OrgHelpClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof OrgHelpClient> = {
  title: 'Org/Help/OrgHelpClient',
  component: OrgHelpClient,
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
          <div className="min-h-screen bg-off-white">
            <Story />
            <Toaster />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OrgHelpClient>;

/**
 * Standard authenticated view.
 * Tests the form submission flow for an organization administrator and verifies success state.
 */
export const SuccessfulSubmission: Story = {
  parameters: {
    msw: {
      handlers: [
        // Mock authenticated session hook context if needed by useAuth
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: { name: 'Admin Alex', email: 'alex@enterprise-org.com' },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
        // Mock the generated contact API submission endpoint
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

    // Submit button should be disabled initially
    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await expect(submitButton).toBeDisabled();

    // Fill out the support ticket description
    await userEvent.type(
      messageInput,
      'How do I add custom domains for our organization sub-hubs?',
    );

    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    // Verify loading state appears
    await expect(canvas.getByText(/Sending.../i)).toBeInTheDocument();

    // Verify success screen replaces the form via 'Ticket Created!' string matched in component
    await expect(await canvas.findByText(/Ticket Created!/i)).toBeInTheDocument();

    // Verify that the fallback or resolution email is displayed (manually mocked if hook returns undefined in story context, otherwise handled by your real hook mock logic)
    // Note: Since 'useAuth' mock behavior relies on your project's specific setup, we check if the view text renders gracefully
    await expect(canvas.getByRole('button', { name: /Send another message/i })).toBeInTheDocument();

    // Verify reset capability works
    const resetButton = canvas.getByRole('button', { name: /Send another message/i });
    await userEvent.click(resetButton);

    // Form should reappear clean
    await expect(await canvas.findByLabelText(/Message \*/i)).toHaveValue('');
  },
};

/**
 * Error state handling.
 * Verifies that a failed API request properly displays a toast error message.
 */
export const ErrorSubmission: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: { name: 'Admin Alex', email: 'alex@enterprise-org.com' },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
        // Mock a failed backend contact response
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

    // Enter error trigger message
    await userEvent.type(messageInput, 'This notification should trigger a submission failure.');

    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await userEvent.click(submitButton);

    // Locate toast confirmation inside document body context
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/Failed to send message\. Please try again later\./i),
    ).toBeInTheDocument();
  },
};
