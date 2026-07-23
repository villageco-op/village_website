'use client';

import { Edit2, Search, Trash2, X } from 'lucide-react';

import { MembersTableSkeleton } from './MembersTableSkeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState, InlineErrorState } from '@/components/ui/state-displays';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  OrgRole,
  type PaginationMetadata,
  type OrgMember,
  type User as UserType,
} from '@/lib/api/generated/models';

interface MembersTableProps {
  members: OrgMember[];
  currentUser: UserType;
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  meta?: PaginationMetadata;
  setPage: (page: number) => void;
  onRefetch: () => void;
  selectedMember: OrgMember | null;
  setSelectedMember: (member: OrgMember | null) => void;
  onChangeRoleClick: (member: OrgMember) => void;
  onRemoveClick: (member: OrgMember) => void;
}

/**
 * Table containing organization members and buttons for setting member role and removing members.
 * @param props - Component props
 * @param props.members - The members list
 * @param props.currentUser - The current user
 * @param props.isLoading - Is the list loading
 * @param props.isError - Is their an error fetching the list
 * @param props.searchQuery - The list search param
 * @param props.setSearchQuery - Handle changing the search input
 * @param props.roleFilter - Current role filter
 * @param props.setRoleFilter - Set the role filter
 * @param props.meta - Pagination metadata
 * @param props.setPage - Update the pagination page
 * @param props.onRefetch - Retry the get members query
 * @param props.selectedMember - The currently selected member
 * @param props.setSelectedMember - When a member row is selected
 * @param props.onChangeRoleClick - When the change role button is pressed
 * @param props.onRemoveClick - When the remove from org button is pressed
 * @returns A table with pagination and filter controls
 */
export function MembersTable({
  members,
  currentUser,
  isLoading,
  isError,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  meta,
  setPage,
  onRefetch,
  selectedMember,
  setSelectedMember,
  onChangeRoleClick,
  onRemoveClick,
}: MembersTableProps) {
  const isSelfSelected = selectedMember?.id === currentUser.id;

  return (
    <Card>
      <CardContent>
        {/* Filters section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-3" />
              <Input
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="w-full sm:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={OrgRole.admin}>Administrators</SelectItem>
                  <SelectItem value={OrgRole.member}>Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || roleFilter !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                }}
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-sm text-forest hover:text-forest-hover"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">
              {selectedMember && (
                <span>
                  Selected:{' '}
                  <strong className="text-foreground">
                    {selectedMember.name || 'Unnamed User'} {isSelfSelected && '(You)'}
                  </strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedMember || isSelfSelected}
                onClick={() => selectedMember && onChangeRoleClick(selectedMember)}
                className="h-8 gap-1.5 px-3 text-xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Change Role
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={!selectedMember || isSelfSelected}
                onClick={() => selectedMember && onRemoveClick(selectedMember)}
                className="h-8 gap-1.5 px-3 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Table display */}
        {isLoading ? (
          <MembersTableSkeleton />
        ) : isError ? (
          <div className="py-12">
            <InlineErrorState
              title="Unable to load members"
              description="We encountered an issue fetching the organization directory. Please try again."
              onRetry={onRefetch}
            />
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="No organization members match your search criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const isSelf = member.id === currentUser.id;
                  const isSelected = selectedMember?.id === member.id;

                  return (
                    <TableRow
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={`cursor-pointer ${isSelected ? 'bg-muted/60' : ''}`}
                    >
                      <TableCell>
                        <input
                          type="radio"
                          name="member-selection"
                          checked={isSelected}
                          onChange={() => setSelectedMember(member)}
                          className="h-4 w-4 cursor-pointer accent-primary"
                        />
                      </TableCell>
                      <TableCell className="font-heading font-semibold text-ink">
                        {member.name || 'Unnamed User'} {isSelf && '(You)'}
                      </TableCell>
                      <TableCell className="text-ink-3">
                        {member.email || 'No email provided'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            member.orgRole === OrgRole.admin
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                              : 'bg-slate-50 text-slate-700 border border-slate-200/50'
                          }`}
                        >
                          {member.orgRole}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination control footer */}
        {meta && meta.totalPages > 1 && <PaginationControls meta={meta} onPageChange={setPage} />}
      </CardContent>
    </Card>
  );
}
