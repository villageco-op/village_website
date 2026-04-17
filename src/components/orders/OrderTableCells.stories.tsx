import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  OrderIdentityCell,
  OrderIdCell,
  OrderAmountCell,
  OrderDateCell,
  OrderStatusCell,
  OrderFulfillmentCell,
  OrderQuantityOzCell,
} from './OrderTableCells';

import { Table, TableBody, TableRow } from '@/components/ui/table';

/**
 * A collection of atomic table cell components used across the Order management tables.
 * These components ensure consistent typography, spacing, and data formatting.
 */
const meta: Meta = {
  title: 'Orders/TableCells',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Table className="min-w-100 border">
        <TableBody>
          <TableRow>
            <Story />
          </TableRow>
        </TableBody>
      </Table>
    ),
  ],
};

export default meta;

/**
 * Displays the name and avatar of a user (buyer or seller).
 * If no image is provided, it generates a fallback using the name or ID.
 */
export const Identity: StoryObj<typeof OrderIdentityCell> = {
  render: (args) => <OrderIdentityCell {...args} />,
  args: {
    name: 'SustainaGrow Farms',
    id: 'user_123456789',
    labelPrefix: 'Seller',
  },
};

export const IdentityWithImage: StoryObj<typeof OrderIdentityCell> = {
  render: (args) => <OrderIdentityCell {...args} />,
  args: {
    name: 'Jane Cooper',
    id: 'user_987654',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop',
  },
};

/**
 * Formats and displays a raw UUID or ID string into a human-readable reference number.
 */
export const OrderID: StoryObj<typeof OrderIdCell> = {
  render: (args) => <OrderIdCell {...args} />,
  args: {
    id: '7c9e6639-742d-4030-8027-275d9241803a',
  },
};

/**
 * Formats numeric or string amounts into currency strings.
 */
export const Amount: StoryObj<typeof OrderAmountCell> = {
  render: (args) => <OrderAmountCell {...args} />,
  args: {
    amount: 1250.75,
  },
};

/**
 * Formats ISO date strings into localized readable formats.
 */
export const DateCell: StoryObj<typeof OrderDateCell> = {
  render: (args) => <OrderDateCell {...args} />,
  args: {
    date: '2026-04-17T10:00:00Z',
    options: { weekday: 'short', month: 'short', day: 'numeric' },
  },
};

/**
 * Displays a StatusPill with conditional coloring based on the order status.
 */
export const StatusPending: StoryObj<typeof OrderStatusCell> = {
  render: (args) => <OrderStatusCell {...args} />,
  args: {
    status: 'pending',
  },
};

export const StatusCompleted: StoryObj<typeof OrderStatusCell> = {
  render: (args) => <OrderStatusCell {...args} />,
  args: {
    status: 'completed',
  },
};

export const StatusCanceled: StoryObj<typeof OrderStatusCell> = {
  render: (args) => <OrderStatusCell {...args} />,
  args: {
    status: 'canceled',
  },
};

/**
 * Displays the fulfillment type (Pickup/Delivery) alongside a representative emoji.
 */
export const FulfillmentDelivery: StoryObj<typeof OrderFulfillmentCell> = {
  render: (args) => <OrderFulfillmentCell {...args} />,
  args: {
    fulfillmentType: 'delivery',
  },
};

export const FulfillmentPickup: StoryObj<typeof OrderFulfillmentCell> = {
  render: (args) => <OrderFulfillmentCell {...args} />,
  args: {
    fulfillmentType: 'pickup',
  },
};

/**
 * Converts raw ounce measurements into pounds (lbs) for display.
 */
export const QuantityWeight: StoryObj<typeof OrderQuantityOzCell> = {
  render: (args) => <OrderQuantityOzCell {...args} />,
  args: {
    quantityOz: 32, // Should display as "2 lbs"
  },
};
