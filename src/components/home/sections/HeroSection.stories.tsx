import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import HeroSection from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Home/Sections/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

/**
 * The primary hero section for the landing page.
 * Uses a two-column grid that stacks on mobile.
 */
export const Default: Story = {};

/**
 * Mobile view comparison.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view comparison.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
