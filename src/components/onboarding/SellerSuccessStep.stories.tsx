import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import SellerSuccessStep from './SellerSuccessStep';

const meta: Meta<typeof SellerSuccessStep> = {
  title: 'Onboarding/SellerSuccessStep',
  component: SellerSuccessStep,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  args: {
    onStripeRedirect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SellerSuccessStep>;

/**
 * The final success state for a new seller.
 * Note the visual hierarchy: Stripe is the primary "active" card,
 * while Listing is slightly dimmed (opacity-80) until payments are set up.
 */
export const Default: Story = {};

/**
 * Visualizing the success state in a mobile view.
 * This helps verify that the flex-start alignment keeps the icons
 * at the top-left even if the text wraps over multiple lines.
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
 * Used to verify the hover effects, specifically the transition
 * on the "Skip to dashboard" arrow icon.
 */
export const DashboardSkipHover: Story = {
  parameters: {
    pseudo: { hover: ['.group'] },
  },
};

/**
 * A layout check to see how the "You're in! 🎉" celebration
 * feels within a branded background container.
 */
export const BrandedLayout: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-150 w-125 bg-cream/40 p-12 rounded-3xl border-4 border-white shadow-2xl">
        <Story />
      </div>
    ),
  ],
};
