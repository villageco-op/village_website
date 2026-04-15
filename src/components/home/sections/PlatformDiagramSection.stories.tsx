import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PlatformDiagramSection from './PlatformDiagramSection';

const meta: Meta<typeof PlatformDiagramSection> = {
  title: 'Home/Sections/PlatformDiagramSection',
  component: PlatformDiagramSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'cream',
      values: [{ name: 'cream', value: '#f5edd8' }],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PlatformDiagramSection>;

/**
 * The standard display of the platform ecosystem diagram.
 * Shows the interconnected roles within the local food economy.
 */
export const Default: Story = {};

/**
 * Mobile view to ensure the circular decorative elements
 * and the diagram scale properly on smaller screens.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view to verify the max-width constraints
 * and section padding (py-25).
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
