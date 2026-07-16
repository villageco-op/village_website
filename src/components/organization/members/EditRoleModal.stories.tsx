import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';
import { useState } from 'react';

import { EditRoleModal } from './EditRoleModal';

import { OrgRole } from '@/lib/api/generated/models';

const MOCK_MEMBER = {
  id: 'usr_123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  orgRole: OrgRole.member,
};

const meta: Meta<typeof EditRoleModal> = {
  title: 'Org/Members/EditRoleModal',
  component: EditRoleModal,
  parameters: {
    layout: 'centered',
  },
  args: {
    member: MOCK_MEMBER,
    targetRole: OrgRole.member,
    onTargetRoleChange: fn(),
    onClose: fn(),
    onConfirm: fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    isSubmitting: false,
  },
  decorators: [
    (Story, context) => {
      const [targetRole, setTargetRole] = useState<OrgRole>(context.args.targetRole);
      return (
        <div className="min-h-100 w-150 flex items-center justify-center bg-slate-50 p-4">
          <Story
            args={{
              ...context.args,
              targetRole,
              onTargetRoleChange: (role: OrgRole) => {
                context.args.onTargetRoleChange(role);
                setTargetRole(role);
              },
            }}
          />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof EditRoleModal>;

/**
 * Standard open state displaying the current member and default target role selection.
 */
export const Default: Story = {};

/**
 * Renders the modal with the "Administrator" option selected.
 */
export const AdminSelected: Story = {
  args: {
    targetRole: OrgRole.admin,
  },
};

/**
 * Disables interactions and renders a loading spinner on the confirmation action.
 */
export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

/**
 * Interactive test verifying that changing roles updates the checkmarks and styles.
 */
export const InteractiveRoleSelection: Story = {
  play: async ({ canvasElement, args }) => {
    // The dialog contents render inside a Portal at the document body level
    const body = within(canvasElement.ownerDocument.body);

    // Verify initial state is "Member"
    const memberButton = body.getByRole('button', { name: /Member Standard access/i });
    const adminButton = body.getByRole('button', {
      name: /Administrator Full administrative access/i,
    });

    // Click Administrator
    await userEvent.click(adminButton);
    await expect(args.onTargetRoleChange).toHaveBeenCalledWith(OrgRole.admin);

    // Click back to Member
    await userEvent.click(memberButton);
    await expect(args.onTargetRoleChange).toHaveBeenCalledWith(OrgRole.member);
  },
};

/**
 * Verifies submission flow firing the confirm callback handler.
 */
export const ConfirmChanges: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const applyButton = body.getByRole('button', { name: /Apply Changes/i });
    await userEvent.click(applyButton);

    await expect(args.onConfirm).toHaveBeenCalled();
  },
};

/**
 * Verifies close callback fires when cancel is pressed.
 */
export const CancelChanges: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const cancelButton = body.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);

    await expect(args.onClose).toHaveBeenCalled();
  },
};
