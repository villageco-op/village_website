import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from '@storybook/test';

import { ExportGuides } from './ExportGuide';

import { generateMockClients } from '@/lib/storybook/utils/clientMockGenerators';

const mockClients = generateMockClients(1);

const meta: Meta<typeof ExportGuides> = {
  title: 'Org/Export/ExportGuides',
  component: ExportGuides,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    clients: mockClients,
    loading: false,
    onTriggerPrint: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ExportGuides>;

/**
 * Standard guide layout with active action buttons for CSV download and Print/PDF export.
 */
export const Default: Story = {};

/**
 * Disabled state when data is currently being fetched or loaded.
 */
export const LoadingState: Story = {
  args: {
    loading: true,
  },
};

/**
 * Verifies print trigger callback invocation when user clicks the print button.
 */
export const TriggerPrintInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const printButton = canvas.getByRole('button', { name: /print \/ save to pdf/i });
    await expect(printButton).toBeEnabled();

    await userEvent.click(printButton);
    await expect(args.onTriggerPrint).toHaveBeenCalledTimes(1);
  },
};
