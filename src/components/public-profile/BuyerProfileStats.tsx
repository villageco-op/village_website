import { Card, CardContent } from '@/components/ui/card';
import { formatAppDate } from '@/lib/date-utils';

interface BuyerProfileStatsProps {
  totalOrders: number;
  activeSubscriptions: number;
  lastOrderDate: string | null;
}

/**
 * A set of cards for displaying general buyer metrics.
 * @param props - The props for the various stats
 * @param props.totalOrders - Total orders placed by the buyer
 * @param props.activeSubscriptions - Number of active subscriptions
 * @param props.lastOrderDate - Timestamp of the last order placed
 * @returns A set of cards displaying the statistics
 */
export function BuyerProfileStats({
  totalOrders,
  activeSubscriptions,
  lastOrderDate,
}: BuyerProfileStatsProps) {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-1 lg:grid-cols-3">
          <div className="rounded-lg bg-cream p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-click-green">
              {totalOrders}
            </div>
            <div className="font-sans text-xs text-ink-3">Orders completed</div>
          </div>

          <div className="rounded-lg bg-lime-pale p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              {activeSubscriptions}
            </div>
            <div className="font-sans text-xs text-ink-3">Active subscriptions</div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 text-center">
            <div className="font-heading text-xl font-extrabold text-deep-forest">
              {formatAppDate(lastOrderDate)}
            </div>
            <div className="font-sans text-xs text-ink-3">Last order</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
