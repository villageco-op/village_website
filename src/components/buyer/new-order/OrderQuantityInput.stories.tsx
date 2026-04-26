import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { OrderQuantityInput } from './OrderQuantityInput';

const meta: Meta<typeof OrderQuantityInput> = {
  title: 'Buyer/NewOrder/OrderQuantityInput',
  component: OrderQuantityInput,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'quantity changed' },
  },
};

export default meta;
type Story = StoryObj<typeof OrderQuantityInput>;

export const Default: Story = {
  args: {
    quantityLbs: 1,
    maxLbs: 10,
  },
  render: (args) => {
    const [val, setVal] = useState(args.quantityLbs);
    return <OrderQuantityInput {...args} quantityLbs={val} onChange={setVal} />;
  },
};

export const NearLimit: Story = {
  args: {
    quantityLbs: 9,
    maxLbs: 10,
  },
  render: (args) => {
    const [val, setVal] = useState(args.quantityLbs);
    return <OrderQuantityInput {...args} quantityLbs={val} onChange={setVal} />;
  },
};

export const LowStock: Story = {
  args: {
    quantityLbs: 1,
    maxLbs: 2.5,
  },
  render: (args) => {
    const [val, setVal] = useState(args.quantityLbs);
    return <OrderQuantityInput {...args} quantityLbs={val} onChange={setVal} />;
  },
};
