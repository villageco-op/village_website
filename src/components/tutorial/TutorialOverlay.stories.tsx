import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';

import { TutorialProvider } from '../providers/TutorialProvider';

import { TutorialOverlay } from './TutorialOverlay';

import { Toaster } from '@/components/ui/sonner';
import { TutorialCategory, type Tutorial } from '@/config/tutorials';

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

const meta: Meta<typeof TutorialOverlay> = {
  title: 'Tutorials/TutorialOverlay',
  component: TutorialOverlay,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/clients',
      },
    },
  },
  decorators: [
    (Story) => (
      <TutorialProvider
        tutorials={mockTutorials}
        allowedRoutes={['/dashboard', '/clients']}
        defaultTutorialId="mock_tutorial"
      >
        <div className="min-h-100 w-full bg-slate-50 relative p-8">
          <p className="text-sm text-ink-3">Workspace viewport content...</p>
          <Story />
          <Toaster />
        </div>
      </TutorialProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TutorialOverlay>;

/**
 * Overlay rendering when navigated to the exact target route of the active step.
 */
export const OnCorrectPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clients', // Matches mock step 0 target route
      },
    },
  },
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('active_tutorial_id', 'mock_tutorial');
    localStorage.setItem('active_tutorial_step', '0');
  },
};

/**
 * Displays warning notification box if on an allowed page route,
 * but not on the exact targetRoute expected by the active step.
 */
export const OnIncorrectPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard', // Allowed route, but not step target (/clients)
      },
    },
  },
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('active_tutorial_id', 'mock_tutorial');
    localStorage.setItem('active_tutorial_step', '0');
  },
};

/**
 * Ensures the tutorial overlay is completely hidden on routes excluded from ALLOWED_TUTORIAL_ROUTES.
 */
export const OnDisallowedPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/onboarding/step-1', // Route not in mock ALLOWED_TUTORIAL_ROUTES
      },
    },
  },
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('active_tutorial_id', 'mock_tutorial');
    localStorage.setItem('active_tutorial_step', '0');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('card')).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Step 1/i)).not.toBeInTheDocument();
  },
};

/**
 * Minimized view containing condensed progress indicators.
 */
export const CollapsedState: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clients',
      },
    },
  },
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('active_tutorial_id', 'mock_tutorial');
    localStorage.setItem('active_tutorial_step', '0');
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Minimize the guide', async () => {
      const buttons = await canvas.findAllByRole('button');
      await userEvent.click(buttons[0]);
    });

    await step('Verify expanded instructions are hidden', async () => {
      await expect(
        canvas.queryByText(/Select the client you want to modify/i),
      ).not.toBeInTheDocument();
      await expect(canvas.getByText('Expand Instructions')).toBeInTheDocument();
    });
  },
};

/**
 * Tests step navigation and regression tracking on mocked data.
 */
export const ProgressionTest: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clients',
      },
    },
  },
  beforeEach: () => {
    localStorage.clear();
    localStorage.setItem('active_tutorial_id', 'mock_tutorial');
    localStorage.setItem('active_tutorial_step', '0');
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Confirm initial step instructions are present', async () => {
      await expect(canvas.getByText('Step 1 of 2')).toBeInTheDocument();
      await expect(canvas.getByText('Select a Client Profile')).toBeInTheDocument();
    });

    await step('Advance to next step', async () => {
      const nextBtn = canvas.getByRole('button', { name: /next/i });
      await userEvent.click(nextBtn);
    });

    await step('Confirm second step details render', async () => {
      await expect(canvas.getByText('Step 2 of 2')).toBeInTheDocument();
      await expect(canvas.getByText('Click Edit Button')).toBeInTheDocument();
    });

    await step('Select back button to check historical state persistence', async () => {
      const backBtn = canvas.getByRole('button', { name: /back/i });
      await userEvent.click(backBtn);
      await expect(canvas.getByText('Step 1 of 2')).toBeInTheDocument();
    });
  },
};
