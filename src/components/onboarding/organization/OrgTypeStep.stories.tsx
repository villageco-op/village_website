import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import OrgTypeStep from './OrgTypeStep';

const meta: Meta<typeof OrgTypeStep> = {
  title: 'Onboarding/Organization/OrgTypeStep',
  component: OrgTypeStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSelectType: fn(),
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrgTypeStep>;

/**
 * The default state of the organization type selection step.
 * Shows the Food Pantry option active, with the Restaurant option disabled.
 */
export const Default: Story = {
  args: {},
};

/**
 * Demonstrates how the component fills the width of a standard onboarding card.
 * This is useful for checking the grid responsiveness between mobile and desktop views.
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
 * Focuses on documenting the selection state with a constrained canvas layout.
 */
export const RestaurantState: Story = {
  render: (args) => (
    <div className="max-w-md">
      <OrgTypeStep {...args} />
    </div>
  ),
};
