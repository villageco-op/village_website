import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import SellerInfoStep from './SellerInfoStep';

const meta: Meta<typeof SellerInfoStep> = {
  title: 'Onboarding/SellerInfoStep',
  component: SellerInfoStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SellerInfoStep>;

/**
 * The initial empty state of the seller profile form.
 */
export const Default: Story = {};

/**
 * Demonstrates the conditional logic when "I am willing to deliver" is checked.
 * This story uses a play function to automatically trigger the toggle.
 */
export const DeliveryFieldsVisible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByLabelText(/willing to deliver/i);
    await userEvent.click(checkbox);

    // Verify the range input appeared
    const rangeInput = canvas.getByLabelText(/Delivery Range/i);
    await expect(rangeInput).toBeInTheDocument();
  },
};

/**
 * Shows how the form looks with realistic data populated.
 */
export const Prepopulated: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText(/About You/i),
      'We are a small family apiary producing raw wildflower honey and beeswax candles.',
    );
    await userEvent.type(canvas.getByLabelText(/Specialties/i), 'Raw Honey, Propolis, Beeswax');
    await userEvent.type(canvas.getByLabelText(/Weekly Goal/i), '250');
  },
};

/**
 * Visualizing the form within a narrow mobile container to ensure
 * the delivery checkbox and inputs don't feel cramped.
 */
export const MobileLayout: Story = {
  decorators: [
    (Story) => (
      <div className="w-90 p-6 bg-cream/20 border rounded-2xl">
        <Story />
      </div>
    ),
  ],
};

/**
 * A "Full Interaction" test story.
 * Use this to verify that the onSubmit callback receives all expected fields.
 */
export const FullFormTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/About You/i), 'Test Farm');
    await userEvent.click(canvas.getByLabelText(/willing to deliver/i));
    await userEvent.type(canvas.getByLabelText(/Delivery Range/i), '25');

    const continueBtn = canvas.getByRole('button', { name: /continue/i });
    await userEvent.click(continueBtn);

    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
