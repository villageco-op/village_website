import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuickOrderSection } from './QuickOrderSection';

import { BASE_MOCK_PRODUCE_LIST_ITEM } from '@/lib/storybook/mocks/produce.mock';
import { generateMockProduceListItems } from '@/lib/storybook/utils/mockGenerators';

const meta: Meta<typeof QuickOrderSection> = {
  title: 'Seller/Profile/QuickOrderSection',
  component: QuickOrderSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-85 mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuickOrderSection>;

const MOCK_PRODUCE_LIST_ITEMS = generateMockProduceListItems(5);

export const Default: Story = {
  args: {
    items: MOCK_PRODUCE_LIST_ITEMS,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    items: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    isLoading: false,
  },
};

export const SingleItem: Story = {
  args: {
    items: [BASE_MOCK_PRODUCE_LIST_ITEM],
    isLoading: false,
  },
};
