import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { TutorialProvider } from '../providers/TutorialProvider';

import OnboardingFlow from './OnboardingClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof OnboardingFlow> = {
  title: 'Onboarding/RootOrchestratorFlow',
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
        http.get('*/api/organizations/subdomain/check', async () => {
          await delay(100);
          return HttpResponse.json({ available: true });
        }),
        http.post('*/api/upload', async () => {
          await delay(100);
          return HttpResponse.json({ url: 'https://example.com/logo.jpg' });
        }),
        http.post('*/api/location/geocode', async () => {
          await delay(100);
          return HttpResponse.json({ lat: 41.59, lng: -87.34 });
        }),
        http.post('*/api/organizations', async () => {
          await delay(200);
          return HttpResponse.json({ id: 'org_123', success: true }, { status: 201 });
        }),
        http.post('*/api/invites/invite', async () => {
          await delay(100);
          return HttpResponse.json({ success: true });
        }),

        http.put('*/api/users/me', async () => {
          await delay(200);
          return HttpResponse.json({ success: true });
        }),
        http.post('*/api/users/fcm-token', async () => {
          await delay(100);
          return HttpResponse.json({ success: true });
        }),
        http.post('*/api/stripe/connect/onboard', async () => {
          await delay(100);
          return HttpResponse.json({ url: 'https://stripe.mock/onboarding' });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <TutorialProvider>
          <Story />
          <Toaster />
        </TutorialProvider>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OnboardingFlow>;

/**
 * Default starting root state. Renders the top-level selection step
 * to branch out into either an Individual or Organization flow.
 */
export const InitialGateway: Story = {};

/**
 * Journey selecting "Individual" account type and traversing the primary branch.
 */
export const SelectIndividualJourney: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Gate selection step
    const individualBtn = await canvas.findByRole('button', { name: /Individual/i });
    await userEvent.click(individualBtn);

    // 2. Asserts we have branched into IndividualOnboardingFlow step 1
    const individualNameInput = await canvas.findByLabelText(/Real Name/i);
    await expect(individualNameInput).toBeInTheDocument();
  },
};

/**
 * Journey selecting "Organization" account type and traversing the organizational branch.
 */
export const SelectOrganizationJourney: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Gate selection step
    const orgBtn = await canvas.findByRole('button', { name: /Organization/i });
    await userEvent.click(orgBtn);

    // 2. Asserts we have branched into OrganizationOnboardingFlow step 1
    const foodPantryCard = await canvas.findByRole('button', { name: /Food Pantry/i });
    await expect(foodPantryCard).toBeInTheDocument();
  },
};

/**
 * Uses Next.js mock parameters to simulate an existing account navigating
 * back with query params to upgrade directly into a Seller role bypass path.
 */
export const UpgradeToSellerBypass: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          upgrade: 'seller',
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Bypasses AccountTypeStep and starts directly at the Individual "About You" seller setup
    const aboutMeInput = await canvas.findByLabelText(/About You/i);
    await expect(aboutMeInput).toBeInTheDocument();
  },
};

export const UpgradeToOrgBypass: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          upgrade: 'org',
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const orgTypeTitle = await canvas.findByLabelText(/Select Organization Type/i);
    await expect(orgTypeTitle).toBeInTheDocument();
  },
};
