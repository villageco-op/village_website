import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ImageCarouselSection from './ImageCarouselSection';

const meta: Meta<typeof ImageCarouselSection> = {
  title: 'Sections/ImageCarouselSection',
  component: ImageCarouselSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageCarouselSection>;

/**
 * The default state of the imagery carousel.
 * Features a centered header and a horizontal carousel on a primary background.
 */
export const Default: Story = {};

/**
 * Mobile view to check the carousel's touch-swipe behavior
 * and header text wrapping.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view to ensure the container-custom padding
 * maintains appropriate gutters.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
