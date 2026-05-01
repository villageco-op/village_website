import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { BrowseProduceFilters } from './BrowseProduceFilters';

const meta: Meta<typeof BrowseProduceFilters> = {
  title: 'Buyer/BrowseProduce/List/BrowseProduceFilters',
  component: BrowseProduceFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceFilters>;

export const Default: Story = {
  args: {
    searchInput: '',
    filters: {},
  },
  render: (args) => {
    const [search, setSearch] = useState(args.searchInput);
    const [filters, setFilters] = useState(args.filters);

    return (
      <BrowseProduceFilters
        {...args}
        searchInput={search}
        setSearchInput={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
    );
  },
};

export const WithActiveFilters: Story = {
  args: {
    searchInput: 'Kale',
    filters: {
      maxDistance: 15,
      hasDelivery: 'true' as any,
    },
  },
  render: (args) => {
    const [search, setSearch] = useState(args.searchInput);
    const [filters, setFilters] = useState(args.filters);

    return (
      <BrowseProduceFilters
        {...args}
        searchInput={search}
        setSearchInput={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
    );
  },
};
