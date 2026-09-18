import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen } from '@storybook/test';

import { TutorialProvider } from '../providers/TutorialProvider';

import TutorialList from './TutorialList';
import { TutorialOverlay } from './TutorialOverlay';

import { Toaster } from '@/components/ui/sonner';
import { ORG_TUTORIALS } from '@/config/tutorials/org_tutorials';
import { SELLER_TUTORIALS } from '@/config/tutorials/seller_tutorials';
import { TutorialCategory, type Tutorial } from '@/config/tutorials/tutorials';

const mockTutorials: Record<string, Tutorial> = {
  mock_tutorial: {
    id: 'mock_tutorial',
    title: 'Mock Guide',
    description: 'Mock tutorial description.',
    category: TutorialCategory.CLIENTS,
    steps: [
      {
        title: 'Select a Client Profile',
        content: 'Select the client you want to modify',
        targetRoute: '/clients',
      },
      {
        title: 'Click Edit Button',
        content: 'Click edit on the details panel',
        targetRoute: '/clients',
      },
    ],
  },
};

const meta: Meta<typeof TutorialList> = {
  title: 'Tutorials/TutorialList',
  component: TutorialList,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/tutorials',
      },
    },
  },
  args: {
    title: 'Tutorials',
    tutorials: mockTutorials,
    descriptionText: 'Step-by-step guides on client & organization management.',
    helpPath: '/org/help/',
  },
  decorators: [
    (Story) => (
      <TutorialProvider tutorials={mockTutorials} defaultTutorialId="mock_tutorial">
        <div className="relative min-h-125 w-full bg-background p-4">
          <Story />
          <TutorialOverlay />
          <Toaster />
        </div>
      </TutorialProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TutorialList>;

/**
 * Click a standalone tutorial card to verify it triggers.
 */
export const StartSelectedTutorialFlow: Story = {
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('onboarding_completed', 'true');
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Find target walkthrough card and start it', async () => {
      const cardTitle = canvas.getByText('Mock Guide');
      const card = cardTitle.closest('.flex-col') as HTMLElement;
      const startBtn = within(card).getByRole('button', { name: /start/i });

      await userEvent.click(startBtn);
    });

    await step('Confirm overlay updates with new instructions', async () => {
      await expect(
        await screen.findByText('Select the client you want to modify'),
      ).toBeInTheDocument();
      await expect(await screen.findByText('Step 1 of 2')).toBeInTheDocument();
    });
  },
};

/**
 * Render default organization tutorials configured via `TUTORIALS`.
 */
export const OrgTutorials: Story = {
  args: {
    title: 'Tutorials',
    tutorials: ORG_TUTORIALS,
    descriptionText: 'Step-by-step guides on client & organization management.',
    helpPath: '/org/help/',
  },
  decorators: [
    (Story) => (
      <TutorialProvider>
        <div className="relative min-h-125 w-full bg-background p-4">
          <Story />
          <TutorialOverlay />
          <Toaster />
        </div>
      </TutorialProvider>
    ),
  ],
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('onboarding_completed', 'true');
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const firstTutorialKey = Object.keys(ORG_TUTORIALS)[0];
    const defaultTutorial = ORG_TUTORIALS[firstTutorialKey];

    if (!defaultTutorial) return;

    await step('Verify default tutorial title renders on page', async () => {
      await expect(await canvas.findByText(defaultTutorial.title)).toBeInTheDocument();
    });
  },
};

/**
 * Render default seller tutorials configured via `SELLER_TUTORIALS`.
 */
export const SellerTutorials: Story = {
  args: {
    title: 'Seller Tutorials',
    tutorials: SELLER_TUTORIALS,
    descriptionText:
      'Step-by-step guides for managing produce listings, account settings, and public seller profiles.',
    helpPath: '/seller/help',
  },
  decorators: [
    (Story) => (
      <TutorialProvider tutorials={SELLER_TUTORIALS}>
        <div className="relative min-h-125 w-full bg-background p-4">
          <Story />
          <TutorialOverlay />
          <Toaster />
        </div>
      </TutorialProvider>
    ),
  ],
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('onboarding_completed', 'true');
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const firstTutorialKey = Object.keys(SELLER_TUTORIALS)[0];
    const sellerTutorial = SELLER_TUTORIALS[firstTutorialKey];

    if (!sellerTutorial) return;

    await step('Verify seller tutorial title renders on page', async () => {
      await expect(await canvas.findByText(sellerTutorial.title)).toBeInTheDocument();
    });
  },
};
