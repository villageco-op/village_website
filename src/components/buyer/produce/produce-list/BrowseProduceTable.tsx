'use client';

import router from 'next/router';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AmountCell, IdentityCell, OrderProductCell } from '@/components/ui/table-cells';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import type { ProduceListItem } from '@/lib/api/generated/models';
import { getDayFromDate } from '@/lib/date-utils';
import { formatWeight } from '@/lib/produce-utils';

interface BrowseProduceTableProps {
  produce: ProduceListItem[];
  onOrderItem: (id: string) => void;
  onGrowerClick: (id: string) => void;
}

/**
 * A table for displaying produce search results with order buttons.
 * @param props - The table props
 * @param props.produce - Produce list item array
 * @param props.onOrderItem - When order is pressed
 * @param props.onGrowerClick - When the grower name is clicked
 * @returns A table displaying the produce as rows
 */
export function BrowseProduceTable({
  produce,
  onOrderItem,
  onGrowerClick,
}: BrowseProduceTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Item</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Price/oz</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead className="text-center">Subscribable</TableHead>
                <TableHead className="w-30"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produce.map((item) => (
                <SelectableTableRow
                  key={item.id}
                  id={item.id}
                  onSelect={() => void router.push(`/produce/${item.id}`)}
                >
                  <OrderProductCell title={item.name} image={item.thumbnail} />
                  <IdentityCell
                    name={item.sellerName || undefined}
                    id={item.sellerId}
                    onNameClick={() => onGrowerClick(item.sellerId)}
                  />
                  <TableCell>
                    {formatWeight(Number(item.amount) || 0)} · {getDayFromDate(item.availableBy)}
                  </TableCell>
                  <AmountCell amount={item.price} />
                  <TableCell>{item.distance ? `${item.distance.toFixed(1)} mi` : '--'}</TableCell>
                  <TableCell className="text-center">
                    {item.isSubscribable && (
                      <span className="text-xs bg-forest-dark/5 text-forest-dark px-2 py-1 rounded-full font-medium">
                        Yes
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="lime"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOrderItem(item.id);
                        }}
                        className="w-full max-w-25"
                      >
                        + Order
                      </Button>
                    </div>
                  </TableCell>
                </SelectableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
