'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { ProduceSales } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

/**
 * Props for the monthly goal card.
 */
interface MonthlyGoalCardProps {
  earnedThisMonth: number;
  monthlyGoal: number;
  produceBreakdown: ProduceSales[];
}

/**
 * Returns specific tailwind classes for the category pills based on the index.
 * @param index - The style index
 * @returns The css class for the pill
 */
const getPillClasses = (index: number) => {
  const styles = [
    'bg-lime/20 text-click-green', // lime
    'bg-sun/30 text-[#8a6000]', // sun
    'bg-clay/10 text-clay', // clay
    'bg-forest-dark/10 text-forest-dark', // forest
  ];
  return styles[index % styles.length];
};

/**
 * A card displaying the progress towards the seller's monthly revenue goal.
 * @param props - Props containing the earning metrics
 * @param props.earnedThisMonth - Amount earned this month
 * @param props.monthlyGoal - The sellers stated monthly goal (revenue)
 * @param props.produceBreakdown - An object containing the amount earned by produce
 * @returns A card with earning stats and a prominent progress bar
 */
export function MonthlyGoalCard({
  earnedThisMonth,
  monthlyGoal,
  produceBreakdown,
}: MonthlyGoalCardProps) {
  const currentMonth = formatAppDate(new Date(), 'longMonthYear');
  const progressPercent = Math.min((earnedThisMonth / monthlyGoal) * 100, 100);

  return (
    <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[0.95rem] font-bold text-ink">
              Monthly Goal Progress
            </h2>
            <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">{currentMonth}</p>
          </div>
        </div>

        <div className="mb-2 font-heading text-[2.4rem] font-extrabold tracking-[-0.03em] text-forest-dark">
          ${earnedThisMonth.toFixed(0)}{' '}
          <span className="text-[1.1rem] text-ink-3">/ ${monthlyGoal.toFixed(0)}</span>
        </div>

        <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-[rgba(42,75,40,0.08)]">
          <div
            className="h-full animate-[progressFill_1.2s_ease_both] rounded-full bg-lime transition-all duration-1000 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {produceBreakdown.map((produce, index) => (
            <span
              key={produce.produceName}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-wider ${getPillClasses(index)}`}
            >
              {produce.produceName}: ${produce.amount.toFixed(0)}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
