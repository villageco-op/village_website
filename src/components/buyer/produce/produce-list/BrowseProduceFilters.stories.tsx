import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { delay, http, HttpResponse } from 'msw';
import { useState } from 'react';

import { BrowseProduceFilters } from './BrowseProduceFilters';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof BrowseProduceFilters> = {
  title: 'Buyer/BrowseProduce/List/BrowseProduceFilters',
  component: BrowseProduceFilters,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [
        http.post('*/api/location/geocode', async () => {
          await delay(400);
          return HttpResponse.json({ lat: 41.8781, lng: -87.6298 });
        }),
      ],
    },
  },
  tags: ['autodocs'],
  args: {
    onLocationChange: fn(),
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <div className="bg-slate-50 flex flex-col h-screen w-full">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceFilters>;

export const Default: Story = {
  args: {
    searchInput: '',
    filters: {},
    currentView: 'list',
    onViewChange: fn(),
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
    currentView: 'list',
    onViewChange: fn(),
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

export const AuthenticatedUser: Story = {
  args: {
    searchInput: '',
    filters: {},
    currentView: 'list',
    currentLocationName: 'Home Profile (Chicago, IL)',
    onViewChange: fn(),
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
