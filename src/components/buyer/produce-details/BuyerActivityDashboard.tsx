'use client';

import { Package, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineErrorState } from '@/components/ui/state-displays';
import { StatusPill } from '@/components/ui/status-pill';
import { useGetOrders } from '@/lib/api/generated/orders/orders';
import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions';
import { formatAppDate } from '@/lib/date-utils';

interface BuyerActivityDashboardProps {
  produceId: string;
  sellerId: string;
}

/**
 * Dashboard to prominently show buyer's active and past orders/subscriptions for this listing.
 * @param props - Dashboard props
 * @param props.produceId - The produce Id
 * @param props.sellerId - The seller Id
 * @returns A card component
 */
export default function BuyerActivityDashboard({
  produceId,
  sellerId,
}: BuyerActivityDashboardProps) {
  const router = useRouter();

  const {
    data: ordersRes,
    isLoading: ordersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetOrders({
    role: 'buyer',
    productId: produceId,
  });

  const {
    data: subsRes,
    isLoading: subsLoading,
    isError: isSubsError,
    refetch: refetchSubs,
  } = useGetSubscriptions({
    productId: produceId,
    sellerId,
  });

  if (ordersLoading || subsLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (isOrdersError || isSubsError || ordersRes?.status !== 200 || subsRes?.status !== 200) {
    return (
      <InlineErrorState
        title="Failed to load activity."
        onRetry={() => {
          void refetchOrders();
          void refetchSubs();
        }}
      />
    );
  }

  const orders = ordersRes?.data?.data || [];
  const subscriptions = subsRes?.data?.data || [];

  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'paid');
  const activeSubs = subscriptions.filter((s) => s.status === 'active' || s.status === 'paused');

  const pastOrders = orders.filter((o) => o.status === 'completed');
  const timesOrdered = pastOrders.length;

  const lastOrderDate = pastOrders.length > 0 ? pastOrders[0].createdAt : null;
  const hasHistory = timesOrdered > 0;

  if (!activeOrders.length && !activeSubs.length && !hasHistory) {
    return null;
  }

  if (!orders.length && !subscriptions.length) return null;

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-off-white shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-b border-border/50 p-5">
        <CardTitle className="font-heading text-lg font-bold text-deep-forest">
          Your Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {(activeOrders.length > 0 || activeSubs.length > 0) && (
          <div className="p-5 border-b border-border/50 bg-white">
            <h4 className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-lime-600" /> Current & Pending
            </h4>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-ink-3" />
                    <div>
                      <p className="font-semibold text-sm text-ink">
                        Order #{order.id.slice(0, 6)}
                      </p>
                      <p className="text-xs text-ink-3">
                        Scheduled: {formatAppDate(order.scheduledTime, 'short', 'TBD')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-forest-dark h-8 text-xs font-semibold"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}

              {activeSubs.map((sub: any) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-lime-600/20 bg-lime-50/50"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-lime-700" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-lime-900">Subscription</p>
                        <StatusPill status={sub.status} />
                      </div>
                      <p className="text-xs text-lime-800/70">
                        {sub.quantityOz} oz • {sub.fulfillmentType}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-lime-800 h-8 text-xs font-semibold hover:bg-lime-600/10"
                    onClick={() => router.push(`/subscriptions/${sub.id}`)}
                  >
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasHistory && (
          <div className="p-5 bg-slate-50">
            <h4 className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Purchase History
            </h4>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-3">Times ordered</span>
                <span className="text-sm font-semibold text-ink">{timesOrdered}</span>
              </div>

              {lastOrderDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-3">Last purchased</span>
                  <span className="text-sm font-semibold text-ink">
                    {formatAppDate(lastOrderDate, 'short')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
