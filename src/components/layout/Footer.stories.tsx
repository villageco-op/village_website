import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

/**
 * The default state of the footer appearing at the bottom of all pages.
 */
export const Default: Story = {};

/**
 * Useful for checking how the footer looks on different background contexts,
 * though it carries its own primary background.
 */
export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
