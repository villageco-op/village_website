import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OnboardingFlow from './OnboardingClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof OnboardingFlow> = {
  title: 'Onboarding/Flow Orchestrator',
  component: OnboardingFlow,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/onboarding',
      },
    },
    msw: {
      handlers: [
        // 0. Mock Image Upload (Basic Profile Step)
        http.post('*/api/upload', async () => {
          await delay(300);
          return HttpResponse.json({ url: 'https://example.com/avatar.jpg' });
        }),
        // 1. Mock Update Profile (Seller Info Step)
        http.put('*/api/users/me', async () => {
          await delay(500);
          return HttpResponse.json({ success: true });
        }),
        // 2. Mock FCM Registration (Notifications Step)
        http.post('*/api/users/fcm-token', async () => {
          await delay(100);
          return HttpResponse.json({ success: true });
        }),
        // 3. Mock Stripe Link Generation (Success Step)
        http.post('*/api/stripe/connect/onboard', async () => {
          await delay(100);
          return HttpResponse.json({ url: 'https://stripe.com/mock-onboarding' });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OnboardingFlow>;

/**
 * The initial state of the flow. Shows the role selection.
 */
export const InitialState: Story = {};

/**
 * Full Seller Journey walkthrough.
 * This tests the logic: Basic -> Role -> Info -> Notifications -> Success.
 */
export const CompleteSellerJourney: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Basic Info
    await userEvent.type(await canvas.findByLabelText(/Real Name/i), 'Jane Doe');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '123 Farm Lane');
    await userEvent.type(canvas.getByLabelText(/City/i), 'Austin');
    await userEvent.click(canvas.getByRole('button', { name: /Continue/i }));

    // 2. Role Selection
    const sellerBtn = await canvas.findByRole('button', { name: /Seller/i });
    await userEvent.click(sellerBtn);

    // 3. Seller Info
    const aboutInput = await canvas.findByLabelText(/About You/i);
    await userEvent.type(aboutInput, 'I grow organic strawberries in the valley.');
    const continueBtn = canvas.getByRole('button', { name: /Continue/i });
    await userEvent.click(continueBtn);

    // 4. Notifications
    // Wait for the slide-in animation/state change
    const enableBtn = await canvas.findByRole('button', { name: /Enable Push Notifications/i });
    await userEvent.click(enableBtn);

    // 5. Success Screen
    const successHeading = await canvas.findByRole('heading', { name: /You're in!/i });
    await expect(successHeading).toBeInTheDocument();

    // Verify Stripe button is interactive
    const stripeBtn = canvas.getByRole('button', { name: /Complete Stripe Onboarding/i });
    await userEvent.click(stripeBtn);
  },
};

/**
 * Tests the Buyer path, which is shorter and skips the Seller Info and Success steps.
 */
export const CompleteBuyerJourney: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Basic Info
    await userEvent.type(await canvas.findByLabelText(/Real Name/i), 'John Smith');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '456 Oak St');
    await userEvent.type(canvas.getByLabelText(/City/i), 'Portland');
    await userEvent.click(canvas.getByRole('button', { name: /Continue/i }));

    // 2. Role Selection
    const buyerBtn = await canvas.findByRole('button', { name: /Buyer/i });
    await userEvent.click(buyerBtn);

    // 3. Notifications (Skipped Seller Info automatically)
    const skipBtn = await canvas.findByRole('button', { name: /Not right now/i });
    await userEvent.click(skipBtn);

    // Note: At this point, router.push('/buyer') is called.
    // In Storybook, you'll see this logged in the 'Actions' tab.
  },
};

/**
 * Tests how the UI handles a server error during the first profile update step.
 */
export const ProfileUpdateError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.put('*/api/users/me', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill out the required basic info
    await userEvent.type(await canvas.findByLabelText(/Real Name/i), 'Error Test');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), 'Nowhere');
    await userEvent.type(canvas.getByLabelText(/City/i), 'Void');

    // Submit
    const continueBtn = canvas.getByRole('button', { name: /Continue/i });
    await userEvent.click(continueBtn);

    // Verify that we do NOT progress to the role selection step
    // (the button should revert to normal or stay on the basic info form)
    await delay(600); // Wait for mock network failure
    const roleHeading = canvas.queryByText(/Welcome to the Village/i);
    await expect(roleHeading).toBeInTheDocument(); // We should still be on step 1
  },
};
