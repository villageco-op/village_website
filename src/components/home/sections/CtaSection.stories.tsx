import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CtaSection from './CtaSection';

const meta: Meta<typeof CtaSection> = {
  title: 'Sections/CtaSection',
  component: CtaSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CtaSection>;

/**
 * The main conversion section.
 * Features a high-contrast dark theme with a decorative top gradient bar.
 */
export const Default: Story = {};

/**
 * Mobile view to ensure the trust factors wrap cleanly
 * and the headline "clamp" font size scales correctly.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view to verify the alignment of the
 * left-aligned SectionHeader within the centered container.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
