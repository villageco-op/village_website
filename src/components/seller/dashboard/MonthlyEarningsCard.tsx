import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { EarningsByProduce } from '@/lib/api/generated/models/earningsByProduce';

/**
 * Props for the monthly earnings card.
 */
interface MonthlyEarningsCardProps {
  earnedThisMonth: number;
  monthlyGoal: number;
  earningsByProduce: EarningsByProduce[];
}

/**
 * A card component for displaying a sellers earning stats.
 * @param props - Props for the component
 * @param props.earnedThisMonth - Amount earned this month by the seller
 * @param props.monthlyGoal - The sellers declared monthly goal (revenue)
 * @param props.earningsByProduce - Map of monthly earning broken down by produce type
 * @returns A card containing high level earning stats for a seller
 */
export function MonthlyEarningsCard({
  earnedThisMonth,
  monthlyGoal,
  earningsByProduce,
}: MonthlyEarningsCardProps) {
  // Prevent division by zero
  const safeGoal = monthlyGoal > 0 ? monthlyGoal : 1;
  const progressPercentage = Math.min(100, (earnedThisMonth / safeGoal) * 100);
  const remaining = Math.max(0, monthlyGoal - earnedThisMonth);

  const badgeVariants = [
    'bg-lime-pale text-click-green',
    'bg-sun-light text-[#8a6000]',
    'bg-clay/10 text-clay',
    'bg-deep-forest/10 text-deep-forest',
  ];

  return (
    <Card className="mb-5 rounded-xl border border-forest-dark/10 p-6 shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-[0.95rem] font-bold text-ink">Monthly Earnings</h2>
          <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} · Goal: $
            {monthlyGoal}
          </p>
        </div>
      </div>

      <div className="mb-1.5 font-heading text-[2.2rem] font-extrabold tracking-[-0.03em] text-deep-forest">
        ${earnedThisMonth.toLocaleString()}{' '}
        <span className="text-[1rem] text-ink-3">/ ${monthlyGoal}</span>
      </div>

      <div className="mb-2.5 h-2 w-full overflow-hidden rounded-full bg-forest-dark/10">
        <div
          className="h-full rounded-full bg-lime transition-all duration-1000 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="font-sans text-[0.78rem] text-ink-3">
        {progressPercentage.toFixed(0)}% of monthly goal · ${remaining.toLocaleString()} remaining
      </div>

      {earningsByProduce.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {earningsByProduce.map((produce, idx) => {
            const colorClass = badgeVariants[idx % badgeVariants.length];
            return (
              <Badge
                key={idx}
                variant="outline"
                className={`border-0 rounded-full px-2.5 py-1 uppercase tracking-[0.05em] font-heading text-[0.65rem] font-bold ${colorClass}`}
              >
                {produce.produceName}: ${produce.earned}
              </Badge>
            );
          })}
        </div>
      )}
    </Card>
  );
}
