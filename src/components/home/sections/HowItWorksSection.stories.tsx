import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import HowItWorksSection from './HowItWorksSection';

const meta: Meta<typeof HowItWorksSection> = {
  title: 'Sections/HowItWorksSection',
  component: HowItWorksSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HowItWorksSection>;

/**
 * The standard layout as it appears on the landing page.
 * Note the radial glow in the top right and the multi-color
 * gradient line at the bottom of the section.
 */
export const Default: Story = {};

/**
 * Mobile view showing the transition from a 3-column grid to a
 * stacked single-column layout.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};
