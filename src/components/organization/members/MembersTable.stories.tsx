import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';
import { useState } from 'react';

import { MembersTable } from './MembersTable';

import { OrgRole, type OrgMember } from '@/lib/api/generated/models';

const MOCK_CURRENT_USER = {
  id: 'usr_admin',
  name: 'Admin User',
  email: 'admin@company.com',
  organizationId: null,
  orgRole: null,
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  aboutMe: 'Cool guy',
  deliveryRangeMiles: '0',
  specialties: [],
  goal: '90',
  stripeOnboardingComplete: false,
  isOnboardingComplete: true,
  address: '456 Market Ave',
  city: 'Gary',
  lat: 41.59,
  lng: -87.34,
  state: 'IN',
  country: 'United States',
  zip: '45678',
};

const MOCK_MEMBERS: OrgMember[] = [
  {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@company.com',
    orgRole: OrgRole.admin,
  },
  {
    id: 'usr_1',
    name: 'Alice Freeman',
    email: 'alice@company.com',
    orgRole: OrgRole.admin,
  },
  {
    id: 'usr_2',
    name: 'Bob Vance',
    email: 'bob@vancerefrig.com',
    orgRole: OrgRole.member,
  },
  {
    id: 'usr_3',
    name: '',
    email: 'unknown@example.com',
    orgRole: OrgRole.member,
  },
];

const meta: Meta<typeof MembersTable> = {
  title: 'Org/Members/MembersTable',
  component: MembersTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    members: MOCK_MEMBERS,
    currentUser: MOCK_CURRENT_USER,
    isLoading: false,
    isError: false,
    searchQuery: '',
    setSearchQuery: fn(),
    roleFilter: 'all',
    setRoleFilter: fn(),
    meta: {
      total: 4,
      totalPages: 1,
      page: 1,
      limit: 10,
    },
    setPage: fn(),
    onRefetch: fn(),
    selectedMember: null,
    setSelectedMember: fn(),
    onChangeRoleClick: fn(),
    onRemoveClick: fn(),
  },
  render: (args) => {
    const [query, setQuery] = useState(args.searchQuery);
    const [role, setRole] = useState(args.roleFilter);
    const [selectedMember, setSelectedMember] = useState<OrgMember | null>(args.selectedMember);

    return (
      <MembersTable
        {...args}
        searchQuery={query}
        setSearchQuery={(q) => {
          setQuery(q);
          args.setSearchQuery(q);
        }}
        roleFilter={role}
        setRoleFilter={(r) => {
          setRole(r);
          args.setRoleFilter(r);
        }}
        selectedMember={selectedMember}
        setSelectedMember={(member) => {
          setSelectedMember(member);
          args.setSelectedMember(member);
        }}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof MembersTable>;

export const Default: Story = {};

export const MemberSelected: Story = {
  args: {
    selectedMember: MOCK_MEMBERS[2], // Bob Vance
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
  },
};

export const Empty: Story = {
  args: {
    members: [],
  },
};

export const FilteredResults: Story = {
  args: {
    searchQuery: 'Alice',
    roleFilter: OrgRole.admin,
  },
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 1. Test Search Input
    const searchInput = canvas.getByPlaceholderText(/Search name or email/i);
    await userEvent.type(searchInput, 'Bob');
    await expect(args.setSearchQuery).toHaveBeenCalled();

    // 2. Verify "You" badge on current user
    await expect(canvas.getByText(/Admin User \(You\)/i)).toBeInTheDocument();

    // 3. Verify top action buttons are disabled initially
    const changeRoleBtn = canvas.getByRole('button', { name: /Change Role/i });
    const removeBtn = canvas.getByRole('button', { name: /Remove/i });
    await expect(changeRoleBtn).toBeDisabled();
    await expect(removeBtn).toBeDisabled();

    // 4. Select Bob Vance row to enable actions
    const bobRow = canvas.getByText('bob@vancerefrig.com');
    await userEvent.click(bobRow);
    await expect(args.setSelectedMember).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'usr_2' }),
    );

    // 5. Test Action Button Clicks after selection
    await expect(changeRoleBtn).toBeEnabled();
    await userEvent.click(changeRoleBtn);
    await expect(args.onChangeRoleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'usr_2' }),
    );

    // 6. Test Filter Clearing
    const clearBtn = canvas.getByRole('button', { name: /Clear Filters/i });
    await userEvent.click(clearBtn);
    await expect(args.setSearchQuery).toHaveBeenCalledWith('');
    await expect(args.setRoleFilter).toHaveBeenCalledWith('all');
  },
};

export const PaginationVisible: Story = {
  args: {
    meta: {
      total: 50,
      totalPages: 5,
      page: 1,
      limit: 10,
    },
  },
};
