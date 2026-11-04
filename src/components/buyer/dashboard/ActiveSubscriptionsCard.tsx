'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  IdentityCell,
  DateTimeCell,
  LocationCell,
  FulfillmentCell,
  QuantityOzCell,
  SubscriptionProductCell,
} from '@/components/ui/table-cells';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import { type SubscriptionDetailResponse } from '@/lib/api/generated/models';

interface ActiveSubscriptionsCardProps {
  subscriptions: SubscriptionDetailResponse[];
  total: number;
  userRole: 'buyer' | 'seller';
}

/**
 * A card containing a table view of active subscriptions for the buyer.
 * @param props - Component props
 * @param props.subscriptions - An array of subscription details
 * @param props.total - The toal active subscriptions
 * @param props.userRole - The users role
 * @returns A card containing a subscription table
 */
export function ActiveSubscriptionsCard({
  subscriptions,
  total,
  userRole,
}: ActiveSubscriptionsCardProps) {
  const router = useRouter();
  const hasMoreSubscriptions = subscriptions.length < total;

  return (
    <Card>
      <CardContent>
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-6 sm:px-0 sm:pt-0 gap-3">
          <div>
            <h2 className="font-heading text-[1.05rem] font-bold text-ink">Active Subscriptions</h2>
            <p className="mt-0.5 font-sans text-[0.8rem] text-ink-3">
              Showing {subscriptions.length}/{total}
            </p>
          </div>

          {hasMoreSubscriptions && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/${userRole}/subscriptions`}> View all </Link>
            </Button>
          )}
        </div>

        {subscriptions.length === 0 ? (
          <EmptyState title="No active subscriptions" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Next Order</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const counterparty = userRole === 'seller' ? sub.buyer : sub.seller;
                  const counterpartyName = counterparty?.name || '-';
                  const counterpartyId = counterparty?.id || '';
                  const counterpartyImage = counterparty?.image;

                  const product = sub.product;
                  const productTitle = product?.title || '-';
                  const productId = sub.productId || sub.product?.id;

                  return (
                    <SelectableTableRow
                      id={sub.id}
                      key={sub.id}
                      onSelect={() => router.push(`/${userRole}/subscriptions/${sub.id}`)}
                      isSelected={false}
                    >
                      <SubscriptionProductCell
                        title={productTitle}
                        onProductClick={() => void router.push(`/produce/${productId}`)}
                      />

                      <IdentityCell
                        id={counterpartyId}
                        name={counterpartyName}
                        image={counterpartyImage}
                        onNameClick={
                          counterpartyId
                            ? () => void router.push(`/public-profile/${counterpartyId}`)
                            : undefined
                        }
                      />

                      <QuantityOzCell quantityOz={sub.quantityOz} />

                      <DateTimeCell date={sub.nextDeliveryDate} />

                      <LocationCell location={counterparty?.location} />

                      <FulfillmentCell fulfillmentType={sub.fulfillmentType} />
                    </SelectableTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
