import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';
import { useState } from 'react';

import { MembersTable } from './MembersTable';

import { OrgRole, type OrgMember } from '@/lib/api/generated/models';
import { BASE_MOCK_MEMBER } from '@/lib/storybook/mocks/organization.mock';
import { MOCK_ORG_ADMIN_USER } from '@/lib/storybook/mocks/user.mock';
import { generateMockOrgMembers } from '@/lib/storybook/utils/mockGenerators';

const MOCK_MEMBERS = generateMockOrgMembers(3);
const CURRENT_USER_MEMBER: OrgMember = {
  ...BASE_MOCK_MEMBER,
  id: MOCK_ORG_ADMIN_USER.id,
  email: MOCK_ORG_ADMIN_USER.email,
  name: MOCK_ORG_ADMIN_USER.name,
  image: MOCK_ORG_ADMIN_USER.image ?? undefined,
  orgRole: MOCK_ORG_ADMIN_USER.orgRole,
};

const meta: Meta<typeof MembersTable> = {
  title: 'Org/Members/MembersTable',
  component: MembersTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    members: [...MOCK_MEMBERS, CURRENT_USER_MEMBER],
    currentUser: MOCK_ORG_ADMIN_USER,
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
    selectedMember: MOCK_MEMBERS[2],
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
    await userEvent.type(searchInput, 'Alex');
    await expect(args.setSearchQuery).toHaveBeenCalled();

    // 2. Verify "You" badge on current user
    await expect(canvas.getByText(/Alex Rivera \(You\)/i)).toBeInTheDocument();

    // 3. Verify top action buttons are disabled initially
    const changeRoleBtn = canvas.getByRole('button', { name: /Change Role/i });
    const removeBtn = canvas.getByRole('button', { name: /Remove/i });
    await expect(changeRoleBtn).toBeDisabled();
    await expect(removeBtn).toBeDisabled();

    // 4. Select a row to enable actions
    const selectedRow = canvas.getByText(MOCK_MEMBERS[1].email!);
    await userEvent.click(selectedRow);
    await expect(args.setSelectedMember).toHaveBeenCalledWith(
      expect.objectContaining({ id: MOCK_MEMBERS[1].id }),
    );

    // 5. Test Action Button Clicks after selection
    await expect(changeRoleBtn).toBeEnabled();
    await userEvent.click(changeRoleBtn);
    await expect(args.onChangeRoleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: MOCK_MEMBERS[1].id }),
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
