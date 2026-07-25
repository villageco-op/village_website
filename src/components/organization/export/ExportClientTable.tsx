'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAddress } from '@/lib/address-utils';
import type { ClientResponse } from '@/lib/api/generated/models';

interface ExportClientTableProps {
  clients: ClientResponse[];
  hasFetched: boolean;
}

/**
 * Table displaying clients in the export clients page.
 * @param props - Component props
 * @param props.clients - The clients
 * @param props.hasFetched - Flag indicating if data fetch has completed
 * @returns A table component
 */
export function ExportClientTable({ clients, hasFetched = false }: ExportClientTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full text-left border-collapse print:text-xs">
        <TableHeader className="hover:bg-transparent print:bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-3 px-4 print:py-1 print:px-2">Name</TableHead>
            <TableHead className="py-3 px-4 print:py-1 print:px-2">Email Address</TableHead>
            <TableHead className="py-3 px-4 print:py-1 print:px-2">Phone</TableHead>
            <TableHead className="py-3 px-4 print:py-1 print:px-2">Address</TableHead>
            <TableHead className="py-3 px-4 print:py-1 print:px-2">Referrals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow className="hover:bg-transparent print:hidden">
              <TableCell colSpan={5} className="py-8 text-center text-sm text-ink-3">
                {!hasFetched
                  ? 'Client data has not been fetched yet. Click Export or Print above to gather records.'
                  : 'No client records found.'}
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow
                key={client.id}
                className="print:hover:bg-transparent print:border-muted-foreground/20"
              >
                <TableCell className="py-3 px-4 print:py-1 print:px-2 print:font-semibold">
                  {client.name || ''}
                </TableCell>
                <TableCell className="py-3 px-4 print:py-1 print:px-2">
                  {client.email || ''}
                </TableCell>
                <TableCell className="py-3 px-4 print:py-1 print:px-2">
                  {client.phone || ''}
                </TableCell>
                <TableCell className="py-3 px-4 print:py-1 print:px-2">
                  {formatAddress(client) || ''}
                </TableCell>
                <TableCell>{client.referralCount || 0}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
