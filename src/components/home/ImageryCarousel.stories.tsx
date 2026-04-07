import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ImageryCarousel } from './ImageryCarousel';

const meta: Meta<typeof ImageryCarousel> = {
  title: 'Components/ImageryCarousel',
  component: ImageryCarousel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the section wrapper.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageryCarousel>;

/**
 * The default auto-scrolling carousel.
 */
export const Default: Story = {
  args: {
    className: '',
  },
};

/**
 * Demonstrates the carousel on a dark background to show the
 * masking effect (the horizontal fade-out on the edges).
 */
export const DarkBackground: Story = {
  args: {
    className: 'bg-stone-900',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

/**
 * Demonstrates the component with a custom utility class
 * to adjust the vertical padding.
 */
export const CompressedPadding: Story = {
  args: {
    className: 'py-4 md:py-6',
  },
};

/**
 * A "Full Width" look. While the carousel is contained,
 * this demonstrates how it anchors within a standard page flow.
 */
export const PageSection: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div className="bg-slate-100 p-10 text-center text-slate-500">Header Content Above</div>
      <ImageryCarousel {...args} />
      <div className="bg-slate-100 p-10 text-center text-slate-500">Footer Content Below</div>
    </div>
  ),
  args: {
    className: 'py-0',
  },
};
