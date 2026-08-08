import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import AccountTypeStep from './AccountTypeStep';

const meta: Meta<typeof AccountTypeStep> = {
  title: 'Onboarding/AccountTypeStep',
  component: AccountTypeStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSelectType: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AccountTypeStep>;

/**
 * The initial state of the account type selection step.
 * Renders both the Individual and Organization option buttons as actionable items.
 */
export const Default: Story = {};

/**
 * Tests clicking the Individual selection card and validates the matching payload callback.
 */
export const SelectIndividual: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const individualBtn = canvas.getByRole('button', { name: /Individual/i });
    await userEvent.click(individualBtn);

    await expect(args.onSelectType).toHaveBeenCalledWith('individual');
  },
};

/**
 * Tests clicking the Organization selection card and validates the matching payload callback.
 */
export const SelectOrganization: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const orgBtn = canvas.getByRole('button', { name: /Organization/i });
    await userEvent.click(orgBtn);

    await expect(args.onSelectType).toHaveBeenCalledWith('organization');
  },
};

/**
 * Demonstrates how the cards adapt structurally inside a typical centered onboarding dialog.
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
 * Simulates small mobile break-point screens to ensure that grid styles
 * properly collapse elements into a vertical stack configuration.
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
