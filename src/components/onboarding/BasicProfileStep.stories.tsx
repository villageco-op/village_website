import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect, screen } from '@storybook/test';

import BasicProfileStep from './BasicProfileStep';

const meta: Meta<typeof BasicProfileStep> = {
  title: 'Onboarding/BasicProfileStep',
  component: BasicProfileStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof BasicProfileStep>;

/**
 * The initial empty state. The "Continue" button should be disabled
 * until all required fields are filled.
 */
export const Default: Story = {};

/**
 * Demonstrates the UI state when the form is being submitted.
 */
export const Loading: Story = {
  args: {
    isPending: true,
  },
};

/**
 * Shows the form with data populated.
 * Note: Image files are difficult to simulate purely via props in this
 * uncontrolled internal state setup, so this simulates user typing.
 */
export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Real Name/i), 'Jane Doe');
    await userEvent.type(canvas.getByLabelText(/Organization/i), 'Green Earth Collective');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '123 Bluebell Lane');

    const cityInput = canvas.getByLabelText(/City/i);
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Austin');

    const stateDropdown = canvas.getByRole('combobox');
    await userEvent.click(stateDropdown);

    const txOption = await screen.findByRole('option', { name: 'Texas' });
    await userEvent.click(txOption);

    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '78701');

    const submitBtn = canvas.getByRole('button', { name: /continue/i });
    await expect(submitBtn).not.toBeDisabled();
  },
};

/**
 * Tests the interaction flow: filling out required fields and
 * ensuring the onSubmit handler is called with the correct data.
 */
export const FullInteractionTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Real Name/i), 'John Smith');
    await userEvent.type(canvas.getByLabelText(/Organization/i), 'Tree Huggers Inc');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '456 Oak St');

    const cityInput = canvas.getByLabelText(/City/i);
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Portland');

    const stateDropdown = canvas.getByRole('combobox');
    await userEvent.click(stateDropdown);
    const orOption = await screen.findByRole('option', { name: 'Oregon' });
    await userEvent.click(orOption);

    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '97204');

    const submitBtn = canvas.getByRole('button', { name: /continue/i });
    await userEvent.click(submitBtn);

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Smith',
        address: '456 Oak St',
        city: 'Portland',
        state: 'OR',
        zip: '97204',
        country: 'United States',
      }),
    );
  },
};

/**
 * Verifies that the organization field remains optional, and
 * submits a string value of `null` if left blank.
 */
export const EmptyOptionalFieldsTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Real Name/i), 'John Smith');
    // Skipping Organization input completely to test the optional logic

    await userEvent.type(canvas.getByLabelText(/Street Address/i), '456 Oak St');

    const cityInput = canvas.getByLabelText(/City/i);
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Portland');

    const stateDropdown = canvas.getByRole('combobox');
    await userEvent.click(stateDropdown);
    const orOption = await screen.findByRole('option', { name: 'Oregon' });
    await userEvent.click(orOption);

    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '97204');

    const submitBtn = canvas.getByRole('button', { name: /continue/i });
    await userEvent.click(submitBtn);

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Smith',
        organization: null,
        address: '456 Oak St',
        city: 'Portland',
        state: 'OR',
        zip: '97204',
        country: 'United States',
      }),
    );
  },
};

/**
 * Mobile-responsive view to check the layout of the profile upload
 * and input fields in a constrained width.
 */
export const MobileView: Story = {
  decorators: [
    (Story) => (
      <div className="w-93.75 p-4 bg-slate-50 border rounded-xl">
        <Story />
      </div>
    ),
  ],
};
