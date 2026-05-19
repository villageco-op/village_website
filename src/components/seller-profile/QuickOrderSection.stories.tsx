import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuickOrderSection } from './QuickOrderSection';

import type { ProduceListItem } from '@/lib/api/generated/models';

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

const mockItems: ProduceListItem[] = [
  {
    id: 'prod-1',
    thumbnail: '',
    name: 'Baby Spinach',
    sellerName: 'Farmer John',
    sellerOrg: null,
    sellerId: 'user-123',
    price: '$2.90/lb',
    amount: '20 lbs',
    availableBy: '2024-06-12T00:00:00Z',
    distance: 2.5,
    isSubscribable: true,
    description: 'Fresh organic baby spinach.',
  },
  {
    id: 'prod-2',
    thumbnail: '',
    name: 'Cherry Tomatoes',
    sellerName: 'Farmer John',
    sellerOrg: null,
    sellerId: 'user-123',
    price: '$4.10/lb',
    amount: '30 lbs',
    availableBy: '2024-06-15T00:00:00Z',
    distance: 2.5,
    isSubscribable: false,
    description: 'Sweet and juicy cherry tomatoes.',
  },
  {
    id: 'prod-3',
    name: 'Honey Crisp Apples',
    sellerName: 'Farmer John',
    sellerOrg: null,
    sellerId: 'user-123',
    price: '$12.00/bag',
    amount: '5 bags',
    availableBy: '2024-06-18T00:00:00Z',
    distance: 2.5,
    isSubscribable: false,
    description: 'Crunchy local apples.',
    thumbnail: '',
  },
];

export const Default: Story = {
  args: {
    items: mockItems,
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
    items: [mockItems[0]],
    isLoading: false,
  },
};
