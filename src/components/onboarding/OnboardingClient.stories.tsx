import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect, screen } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { Toaster } from '../ui/sonner';

import OnboardingFlow from './OnboardingClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof OnboardingFlow> = {
  title: 'Onboarding/OnboardingPage',
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
        // 0.5. Mock Geocode Address (Basic Profile Step)
        http.post('*/api/location/geocode', async () => {
          await delay(50);
          return HttpResponse.json({ lat: 0.0, lng: 0.0 });
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
          return HttpResponse.json({ url: 'https://stripe/mock-onboarding' });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <Story />
        <Toaster></Toaster>
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

    const cityInput = canvas.getByLabelText(/City/i);
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Austin');

    const stateDropdown = canvas.getByRole('combobox');
    await userEvent.click(stateDropdown);
    const txOption = await screen.findByRole('option', { name: 'Texas' });
    await userEvent.click(txOption);

    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '78701');

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
    await expect(stripeBtn).toBeInTheDocument();
    await expect(stripeBtn).toBeEnabled();
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

    const cityInput = canvas.getByLabelText(/City/i);
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Portland');

    const stateDropdown = canvas.getByRole('combobox');
    await userEvent.click(stateDropdown);
    const orOption = await screen.findByRole('option', { name: 'Oregon' });
    await userEvent.click(orOption);

    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '97204');

    await userEvent.click(canvas.getByRole('button', { name: /Continue/i }));

    // 2. Role Selection
    const buyerBtn = await canvas.findByRole('button', { name: /Buyer/i });
    await userEvent.click(buyerBtn);

    // 3. Notifications (Skipped Seller Info automatically)
    const skipBtn = await canvas.findByRole('button', { name: /Not right now/i });
    await userEvent.click(skipBtn);
  },
};

/**
 * Tests the Upgrade path for an existing buyer who is upgrading to become a seller.
 * They should skip basic info & role selection completely.
 */
export const UpgradeToSellerJourney: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          upgrade: 'seller', // Trigger the bypass logic
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Assert we start immediately at "Seller Info" (Skipping Basic Info and Role Selection)
    const aboutInput = await canvas.findByLabelText(/About You/i);
    await expect(aboutInput).toBeInTheDocument();

    await userEvent.type(aboutInput, 'I decided to start selling my extra tomatoes!');
    const continueBtn = canvas.getByRole('button', { name: /Continue/i });
    await userEvent.click(continueBtn);

    // 2. Notifications
    const skipBtn = await canvas.findByRole('button', { name: /Not right now/i });
    await userEvent.click(skipBtn);

    // 3. Success Screen
    const successHeading = await canvas.findByRole('heading', { name: /You're in!/i });
    await expect(successHeading).toBeInTheDocument();
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

    const cityInput = canvas.getByLabelText(/City/i);
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Void');

    const stateDropdown = canvas.getByRole('combobox');
    await userEvent.click(stateDropdown);
    const wyOption = await screen.findByRole('option', { name: 'Wyoming' });
    await userEvent.click(wyOption);

    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '82001');

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
