import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { useState } from 'react';

import { BrowseProduceMapFilters } from './BrowseProduceMapFilters';

const meta: Meta<typeof BrowseProduceMapFilters> = {
  title: 'Buyer/BrowseProduce/Map/BrowseProduceMapFilters',
  component: BrowseProduceMapFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceMapFilters>;

export const Default: Story = {
  args: {
    searchInput: '',
    filters: {},
    currentView: 'map',
    onViewChange: fn(),
  },
  render: (args) => {
    const [search, setSearch] = useState(args.searchInput);
    const [filters, setFilters] = useState(args.filters);
    const [view, setView] = useState(args.currentView);

    return (
      <BrowseProduceMapFilters
        {...args}
        searchInput={search}
        setSearchInput={setSearch}
        filters={filters}
        setFilters={setFilters}
        currentView={view}
        onViewChange={(v) => {
          setView(v);
          args.onViewChange(v);
        }}
      />
    );
  },
};

export const WithActiveFilters: Story = {
  args: {
    searchInput: 'Tomato',
    filters: {
      radiusMiles: 15,
      minPrice: 0.05, // ~$0.80/lb
    },
    currentView: 'map',
    onViewChange: fn(),
  },
  render: (args) => {
    const [search, setSearch] = useState(args.searchInput);
    const [filters, setFilters] = useState(args.filters);

    return (
      <BrowseProduceMapFilters
        {...args}
        searchInput={search}
        setSearchInput={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
    );
  },
};
