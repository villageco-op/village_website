import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect, screen, waitFor, type Mock } from '@storybook/test';

import OrgInviteStep from './OrgInviteStep';

const meta: Meta<typeof OrgInviteStep> = {
  title: 'Onboarding/Organization/OrgInviteStep',
  component: OrgInviteStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onInvite: fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return true;
    }),
    onFinish: fn(),
    onBack: fn(),
  },
  beforeEach: ({ args }) => {
    (args.onInvite as Mock).mockClear();
    (args.onFinish as Mock).mockClear();
    (args.onBack as Mock).mockClear();
  },
};

export default meta;
type Story = StoryObj<typeof OrgInviteStep>;

/**
 * Initial empty state where no team invitations have been sent yet.
 * The invitation list table remains hidden.
 */
export const Default: Story = {};

/**
 * Simulates entering an email, picking a non-default permission level,
 * and performing the submission lifecycle.
 */
export const SendingInvitationFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(/Member Email Address/i);
    await userEvent.type(emailInput, 'admin.team@example.com');

    // Open permissions select dropdown card
    const roleDropdown = canvas.getByRole('combobox');
    await userEvent.click(roleDropdown);

    // Pick Admin option from Radix portal overlay context
    const adminOption = await screen.findByRole('option', { name: 'Admin' });
    await userEvent.click(adminOption);

    // Click trigger action button
    const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
    await userEvent.click(inviteBtn);

    // Confirm that the text values match down the hook pipelines
    await waitFor(async () => {
      await expect(args.onInvite).toHaveBeenCalledWith('admin.team@example.com', 'admin');
    });

    // Confirm form is cleared and item added to the roster preview listing layout grid
    await waitFor(async () => {
      await expect(emailInput).toHaveValue('');
      await expect(canvas.getByText('admin.team@example.com')).toBeInTheDocument();
    });
  },
};

/**
 * Tests form behaviors when dealing with invalid user strings.
 */
export const FormValidationErrorFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(/Member Email Address/i);
    await userEvent.type(emailInput, 'not-a-valid-email');

    const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
    await userEvent.click(inviteBtn);

    // Handler should abort upstream execution pipelines early due to regex errors
    await expect(args.onInvite).not.toHaveBeenCalled();
  },
};
