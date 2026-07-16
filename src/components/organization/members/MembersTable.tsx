'use client';

import { Search, User, X } from 'lucide-react';

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
  onChangeRoleClick,
  onRemoveClick,
}: MembersTableProps) {
  return (
    <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        {/* Filters section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-3" />
              <Input
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white w-full h-9 text-sm"
              />
            </div>

            <div className="w-full sm:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full h-9 bg-white text-sm">
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
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-[rgba(42,75,40,0.08)]">
                  <TableHead className="font-heading text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">
                    Member Information
                  </TableHead>
                  <TableHead className="font-heading text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">
                    Role Designation
                  </TableHead>
                  <TableHead className="font-heading text-[0.7rem] font-bold uppercase tracking-wider text-ink-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const isSelf = member.id === currentUser.id;

                  return (
                    <TableRow
                      key={member.id}
                      className="border-[rgba(42,75,40,0.05)] hover:bg-off-white"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-heading text-sm font-semibold text-ink">
                              {member.name || 'Unnamed User'} {isSelf && '(You)'}
                            </span>
                            <span className="text-xs text-ink-3">
                              {member.email || 'No email provided'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
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
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-medium flex items-center gap-1"
                            onClick={() => onChangeRoleClick(member)}
                            disabled={isSelf}
                          >
                            Change Role
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 text-xs font-medium flex items-center gap-1"
                            onClick={() => onRemoveClick(member)}
                            disabled={isSelf}
                          >
                            Remove
                          </Button>
                        </div>
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
