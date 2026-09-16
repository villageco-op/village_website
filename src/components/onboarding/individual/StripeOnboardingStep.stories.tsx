import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import StripeOnboardingStep from './StripeOnboardingStep';

const meta: Meta<typeof StripeOnboardingStep> = {
  title: 'Onboarding/Individual/StripeOnboardingStep',
  component: StripeOnboardingStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onStripeRedirect: fn(),
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof StripeOnboardingStep>;

/**
 * Default state of the dedicated Stripe Onboarding step.
 */
export const Default: Story = {};

/**
 * State when the Stripe onboarding link generation/redirect is pending.
 */
export const Loading: Story = {
  args: {
    isPending: true,
  },
};

/**
 * Mobile viewport check to ensure buttons and content scale cleanly on small screens.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-85 p-2">
        <Story />
      </div>
    ),
  ],
};

/**
 * Visualizing how the step looks inside the standard onboarding card container.
 */
export const CardLayout: Story = {
  decorators: [
    (Story) => (
      <div className="w-125 bg-cream/30 border border-border/20 shadow-sm rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
};
