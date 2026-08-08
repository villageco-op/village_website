'use client';

import Image from 'next/image';
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
                <TableHead>Grower</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Dist.</TableHead>
                <TableHead className="text-center">Sub.</TableHead>
                <TableHead className="w-30"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produce.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => void router.push(`/produce/${item.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-forest-dark/10 bg-white">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] text-slate-400">
                            No Img
                          </div>
                        )}
                      </div>
                      <span className="truncate" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGrowerClick(item.sellerId);
                      }}
                    >
                      {item.sellerName} ↗
                    </Button>
                  </TableCell>
                  <TableCell>
                    {formatWeight(Number(item.amount) || 0)} · {getDayFromDate(item.availableBy)}
                  </TableCell>
                  <TableCell>${(Number(item.price) * 16).toFixed(2)}/lb</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
