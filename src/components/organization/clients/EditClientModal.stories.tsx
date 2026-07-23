import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect, screen } from '@storybook/test';

import { EditClientModal } from './EditClientModal';

import type { ClientResponse } from '@/lib/api/generated/models';

const mockClient: ClientResponse = {
  id: 'cli_123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '(555) 123-4567',
  address: '123 Forest Ave',
  city: 'Madison',
  state: 'WI',
  country: 'USA',
  zip: '53703',
  organizationId: 'org-1',
  createdById: 'user-1',
  referredBy: null,
  active: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const meta: Meta<typeof EditClientModal> = {
  title: 'Org/Clients/EditClientModal',
  component: EditClientModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    client: mockClient,
    isSubmitting: false,
    onClose: fn(),
    onConfirm: fn().mockImplementation(() => Promise.resolve()),
  },
};

export default meta;
type Story = StoryObj<typeof EditClientModal>;

/**
 * Standard modal state pre-filled with full client profile information.
 */
export const Default: Story = {};

/**
 * Renders the modal with minimal client data (optional email, phone, and address missing).
 */
export const EmptyOptionalFields: Story = {
  args: {
    client: {
      id: 'cli_456',
      name: 'John Smith',
      email: null,
      phone: null,
      address: null,
      city: null,
      state: null,
      country: null,
      zip: null,
      organizationId: 'org-1',
      createdById: 'user-1',
      referredBy: null,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

/**
 * Loading/pending state when the form is currently submitting updates.
 */
export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

/**
 * Tests editing input fields and submitting updated client payload data.
 */
export const SubmitFormFlow: Story = {
  play: async ({ canvasElement, args, step }) => {
    // Dialog content is rendered in a Portal on document body
    const body = within(canvasElement.ownerDocument.body);

    const nameInput = body.getByLabelText(/Full Name/i);
    const emailInput = body.getByLabelText(/Email/i);
    const phoneInput = body.getByLabelText(/Phone Number/i);
    const addressInput = body.getByLabelText(/Street Address/i);

    // Clear and fill updated data
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane H. Doe');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'jane.updated@example.com');

    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '(555) 987-6543');

    await step('Fill out address details', async () => {
      await userEvent.clear(addressInput);
      await userEvent.type(addressInput, '456 Oak St');

      const cityInput = body.getByLabelText(/City/i);
      await userEvent.clear(cityInput);
      await userEvent.type(cityInput, 'Milwaukee');

      const stateDropdown = body.getByRole('combobox');
      await userEvent.click(stateDropdown);

      const txOption = await screen.findByRole('option', { name: 'Wisconsin' });
      await userEvent.click(txOption);

      const zipInput = body.getByLabelText(/ZIP Code/i);
      await userEvent.clear(zipInput);
      await userEvent.type(zipInput, '53202');
    });

    // Submit form
    const saveButton = body.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);

    // Verify callback parameters
    await expect(args.onConfirm).toHaveBeenCalledWith('cli_123', {
      name: 'Jane H. Doe',
      email: 'jane.updated@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak St',
      city: 'Milwaukee',
      state: 'WI',
      zip: '53202',
    });
  },
};

/**
 * Ensures the submit button is disabled when the required Name field is cleared.
 */
export const ValidationDisabledSave: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const nameInput = body.getByPlaceholderText('Client full name');
    const saveButton = body.getByRole('button', { name: /save changes/i });

    // Clear required name
    await userEvent.clear(nameInput);

    // Assert save button is disabled
    await expect(saveButton).toBeDisabled();
  },
};

/**
 * Tests triggering the cancel action to close the modal.
 */
export const CancelFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const cancelButton = body.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
