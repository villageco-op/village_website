import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HowItWorksCard } from './HowItWorksCard';

const meta: Meta<typeof HowItWorksCard> = {
  title: 'Components/HowItWorksCard',
  component: HowItWorksCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a1f1c' }],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HowItWorksCard>;

export const Default: Story = {
  args: {
    title: 'For Producers',
    imageSrc: 'images/for-producers.jpg',
    description:
      'Grow fresh produce on community or home land. Submit your harvest through the app and earn your share of weekly revenue.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-95">
        <Story />
      </div>
    ),
  ],
};

/**
 * Demonstrates how the card handles significantly longer descriptions
 * while maintaining the aspect-video ratio of the image.
 */
export const LongDescription: Story = {
  args: {
    ...Default.args,
    title: 'For Landowners & Partners',
    description:
      'Turn your unused yard, vacant lot, or church grounds into a neighborhood asset. List your space, set your terms, and earn a share of every harvest grown on your land. We handle the logistics, insurance, and matching you with vetted local producers.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-95">
        <Story />
      </div>
    ),
  ],
};
