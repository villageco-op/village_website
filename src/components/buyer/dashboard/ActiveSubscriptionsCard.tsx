'use client';

import { RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  OrderIdentityCell,
  OrderDateTimeCell,
  OrderLocationCell,
  OrderFulfillmentCell,
  OrderQuantityOzCell,
  SubscriptionProductCell,
} from '@/components/orders/OrderTableCells';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SubscriptionDetailResponse } from '@/lib/api/generated/models';

interface ActiveSubscriptionsCardProps {
  subscriptions: SubscriptionDetailResponse[];
  total: number;
}

/**
 * A card containing a table view of active subscriptions for the buyer.
 * @param props - Component props
 * @param props.subscriptions - An array of subscription details
 * @param props.total - The toal active subscriptions
 * @returns A card containing a subscription table
 */
export function ActiveSubscriptionsCard({ subscriptions, total }: ActiveSubscriptionsCardProps) {
  const router = useRouter();
  const hasMoreSubscriptions = subscriptions.length < total;

  return (
    <Card>
      <CardContent className="p-0 sm:p-6">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-6 sm:px-0 sm:pt-0 gap-3">
          <div>
            <h2 className="font-heading text-[1.05rem] font-bold text-ink">Active Subscriptions</h2>
            <p className="mt-0.5 font-sans text-[0.8rem] text-ink-3">
              Showing {subscriptions.length}/{total}
            </p>
          </div>

          {hasMoreSubscriptions && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-fit text-xs text-ink-2 hover:text-ink"
            >
              <Link href="/buyer/subscriptions">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {subscriptions.length === 0 ? (
          <EmptyState
            icon={RefreshCw}
            title="No active subscriptions"
            description="When you subscribe to recurring produce, it will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Next Delivery</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const seller = sub.seller;
                  const sellerName = seller?.name || '-';
                  const sellerId = seller?.id || sub.sellerId || '';
                  const sellerImage = seller?.image;

                  const product = sub.product;
                  const productTitle = product?.title || '-';
                  const productId = sub.productId || sub.product?.id;

                  return (
                    <TableRow
                      key={sub.id}
                      onClick={() => router.push(`/subscriptions/${sub.id}`)}
                      className="cursor-pointer transition-colors hover:bg-slate-50/80"
                    >
                      {/* Product */}
                      <SubscriptionProductCell
                        title={productTitle}
                        onProductClick={() => void router.push(`/produce/${productId}`)}
                      />

                      {/* Seller */}
                      <OrderIdentityCell
                        id={sellerId}
                        name={sellerName}
                        image={sellerImage}
                        onNameClick={
                          sellerId
                            ? () => void router.push(`/public-profile/${sellerId}`)
                            : undefined
                        }
                      />

                      {/* Quantity */}
                      <OrderQuantityOzCell quantityOz={sub.quantityOz} />

                      {/* Next Delivery Date */}
                      <OrderDateTimeCell date={sub.nextDeliveryDate} />

                      {/* Location */}
                      <OrderLocationCell location={seller?.location} />

                      {/* Fulfillment Type */}
                      <OrderFulfillmentCell fulfillmentType={sub.fulfillmentType} />
                    </TableRow>
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
