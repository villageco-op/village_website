import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderItemsCard } from './OrderItemsCard';

const meta: Meta<typeof OrderItemsCard> = {
  title: 'Orders/OrderDetails/OrderItemsCard',
  component: OrderItemsCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderItemsCard>;

export const Default: Story = {
  args: {
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Heirloom Tomatoes',
        quantityOz: '32', // 2 lbs
        pricePerOz: '0.25', // $4.00/lb
        maxOrderQuantityOz: null,
        isProduceSubscribable: true,
        produceAvailableBy: new Date().toISOString(),
        produceStatus: 'active',
        produceSeasonStart: '2024-12-5',
        produceSeasonEnd: '2025-5-12',
        produceTotalOzInventory: '20.00',
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Honey Crisp Apples',
        quantityOz: '80', // 5 lbs
        pricePerOz: '0.1875', // $3.00/lb
        maxOrderQuantityOz: null,
        isProduceSubscribable: true,
        produceAvailableBy: new Date().toISOString(),
        produceStatus: 'active',
        produceSeasonStart: '2024-12-5',
        produceSeasonEnd: '2025-5-12',
        produceTotalOzInventory: '20.00',
      },
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Fresh Kale',
        quantityOz: '16', // 1 lb
        pricePerOz: '0.3125', // $5.00/lb
        maxOrderQuantityOz: null,
        isProduceSubscribable: true,
        produceAvailableBy: new Date().toISOString(),
        produceStatus: 'active',
        produceSeasonStart: '2024-12-5',
        produceSeasonEnd: '2025-5-12',
        produceTotalOzInventory: '20.00',
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
