import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ImpactSection from './ImpactSection';

const meta: Meta<typeof ImpactSection> = {
  title: 'Home/Sections/ImpactSection',
  component: ImpactSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImpactSection>;

/**
 * The standard desktop view.
 * Showcases the decorative radial gradient and the grid-based layout
 * of ImpactCards against the deep forest background.
 */
export const Default: Story = {};

/**
 * Mobile view showing the stack behavior where the text content
 * moves above the card grid.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};
