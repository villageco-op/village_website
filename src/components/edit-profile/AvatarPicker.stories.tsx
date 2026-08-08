import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { fn } from '@storybook/test';

import { AvatarPicker } from './AvatarPicker';

const meta: Meta<typeof AvatarPicker> = {
  title: 'EditProfile/Components/AvatarPicker',
  component: AvatarPicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AvatarPicker>;

/**
 * Empty / Default state when no avatar has been uploaded or provided yet.
 */
export const DefaultEmpty: Story = {
  args: {
    label: 'Upload Photo',
    value: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Upload Photo')).toBeInTheDocument();

    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await expect(fileInput).toBeInTheDocument();
    await expect(fileInput.accept).toContain('image/jpeg');
  },
};

/**
 * Populated state showcasing a successfully rendered initial network or local avatar preview.
 */
export const WithValue: Story = {
  args: {
    label: 'Change Avatar',
    value:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Change Avatar')).toBeInTheDocument();

    const img = canvas.getByAltText('Profile Image');
    await expect(img).toBeInTheDocument();
  },
};
