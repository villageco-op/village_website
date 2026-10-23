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
    quantityOz: 1,
    maxOz: 10,
  },
  render: (args) => {
    const [val, setVal] = useState(args.quantityOz);
    return <OrderQuantityInput {...args} quantityOz={val} onChange={setVal} />;
  },
};

export const NearLimit: Story = {
  args: {
    quantityOz: 9,
    maxOz: 10,
  },
  render: (args) => {
    const [val, setVal] = useState(args.quantityOz);
    return <OrderQuantityInput {...args} quantityOz={val} onChange={setVal} />;
  },
};

export const LowStock: Story = {
  args: {
    quantityOz: 1,
    maxOz: 2.5,
  },
  render: (args) => {
    const [val, setVal] = useState(args.quantityOz);
    return <OrderQuantityInput {...args} quantityOz={val} onChange={setVal} />;
  },
};
