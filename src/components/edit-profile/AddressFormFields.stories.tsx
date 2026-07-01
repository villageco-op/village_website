import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { fn } from '@storybook/test';

import { AddressFormFields, type AddressValue } from './AddressFormFields';

const EMPTY_ADDRESS: AddressValue = {
  address: '',
  city: '',
  state: '',
  zip: '',
};

const POPULATED_ADDRESS: AddressValue = {
  address: '123 Main Street',
  city: 'Madison',
  state: 'WI',
  zip: '53703',
};

const meta: Meta<typeof AddressFormFields> = {
  title: 'EditProfile/Components/AddressFormFields',
  component: AddressFormFields,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl min-w-[320px] bg-slate-50 p-6 rounded-xl border border-slate-200">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AddressFormFields>;

/**
 * Empty layout state, typically utilized on fresh profile registration or clean address forms.
 */
export const DefaultEmpty: Story = {
  args: {
    value: EMPTY_ADDRESS,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify fields render without text contents or required asterisks
    await expect(canvas.getByLabelText('Street Address')).toHaveValue('');
    await expect(canvas.getByLabelText('City')).toHaveValue('');
    await expect(canvas.getByLabelText('ZIP Code')).toHaveValue('');
    await expect(canvas.queryByText('*')).not.toBeInTheDocument();
  },
};

/**
 * State demonstrating visual validation indicators when the address block is marked mandatory.
 */
export const RequiredFields: Story = {
  args: {
    value: EMPTY_ADDRESS,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify required visual indicators appear beside form fields
    const labels = ['Street Address', 'City', 'State', 'ZIP Code'];

    for (const labelText of labels) {
      const label = canvas.getAllByText(new RegExp(labelText, 'i'))[0].closest('label');
      await expect(within(label!).getByText('*')).toBeInTheDocument();
    }
  },
};

/**
 * Pre-populated form fields portraying valid preset address entities.
 */
export const PrePopulated: Story = {
  args: {
    value: POPULATED_ADDRESS,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Street Address')).toHaveValue('123 Main Street');
    await expect(canvas.getByLabelText('City')).toHaveValue('Madison');
    await expect(canvas.getByLabelText('ZIP Code')).toHaveValue('53703');

    // Radix UI select uses a specific text layout for current selections
    await expect(canvas.getByText('Wisconsin')).toBeInTheDocument();
  },
};

/**
 * Interaction test verifying proper execution of typing text inputs and masking non-numeric inputs within the ZIP field.
 */
export const FormInteractionsAndMasking: Story = {
  args: {
    value: EMPTY_ADDRESS,
    required: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 1. Simulate user typing a normal street address
    const addressInput = canvas.getByLabelText('Street Address');
    await userEvent.type(addressInput, '789 Orchard Ln');
    await expect(args.onChange).toHaveBeenCalledWith(expect.objectContaining({ address: '7' }));

    // 2. Simulate user typing numeric and alphabet characters into the ZIP code input
    const zipInput = canvas.getByLabelText('ZIP Code');

    // Type a string mixed with text characters: '94a0B1'
    await userEvent.type(zipInput, '94a01');

    // Your custom internal component regex logic filters non-digits out immediately.
    // The spy assertion checks if only the parsed integers were sent back up through onChange
    await expect(args.onChange).toHaveBeenCalledWith(expect.objectContaining({ zip: '9' }));
    await expect(args.onChange).not.toHaveBeenCalledWith(expect.objectContaining({ zip: '94a' }));
  },
};
