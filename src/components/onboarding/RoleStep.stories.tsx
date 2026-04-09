import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import RoleStep from './RoleStep';

const meta: Meta<typeof RoleStep> = {
  title: 'Onboarding/RoleStep',
  component: RoleStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSelectRole: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RoleStep>;

/**
 * The default state of the role selection step.
 * Shows the Buyer and Seller options active, with the Deliverer option disabled.
 */
export const Default: Story = {
  args: {},
};

/**
 * Demonstrates how the component fills the width of a standard onboarding card.
 * This is useful for checking the grid responsiveness between mobile and desktop.
 */
export const WithinContainer: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl w-full mx-auto p-8 bg-cream/30 rounded-2xl border border-stone-100 shadow-sm">
        <Story />
      </div>
    ),
  ],
};

/**
 * A mobile-view simulator to ensure the grid stacks correctly
 * (sm:grid-cols-2 shifts to a single column on smaller screens).
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px] p-4">
        <Story />
      </div>
    ),
  ],
};

/**
 * This story can be used to document the "Coming Soon" state
 * for the Deliverer role, ensuring the styling remains distinct
 * from the actionable buttons.
 */
export const DelivererState: Story = {
  render: (args) => (
    <div className="max-w-md">
      {/* Focuses purely on the footer section of the component */}
      <RoleStep {...args} />
    </div>
  ),
};
