import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen } from '@storybook/test';

import { TutorialProvider } from '../providers/TutorialProvider';

import OrgTutorialClient from './OrgTutorialClient';
import { TutorialOverlay } from './TutorialOverlay';

import { Toaster } from '@/components/ui/sonner';
import { TutorialCategory, TUTORIALS, type Tutorial } from '@/config/tutorials';

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

const meta: Meta<typeof OrgTutorialClient> = {
  title: 'Tutorials/TutorialPage',
  component: OrgTutorialClient,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/tutorials',
      },
    },
  },
  decorators: [
    (Story) => (
      <TutorialProvider
        tutorials={mockTutorials}
        allowedRoutes={['/dashboard', '/clients', '/tutorials']}
        defaultTutorialId="mock_tutorial"
      >
        <div className="min-h-125 w-full bg-background relative p-4">
          <Story />
          <TutorialOverlay />
          <Toaster />
        </div>
      </TutorialProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrgTutorialClient>;

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
 * Render default tutorials configured via `TUTORIALS` without passing the `tutorials` prop.
 */
export const DefaultTutorials: Story = {
  decorators: [
    (Story) => (
      <TutorialProvider allowedRoutes={['/dashboard', '/clients', '/tutorials']}>
        <div className="min-h-125 w-full bg-background relative p-4">
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

    // Pick the first default tutorial key dynamically from config
    const firstTutorialKey = Object.keys(TUTORIALS)[0];
    const defaultTutorial = TUTORIALS[firstTutorialKey];

    if (!defaultTutorial) return;

    await step('Verify default tutorial title renders on page', async () => {
      await expect(await canvas.findByText(defaultTutorial.title)).toBeInTheDocument();
    });
  },
};
