'use client';

/**
 * Props for the orders header.
 */
interface OrdersHeaderProps {
  pendingCount: number;
}

/**
 * The header for the seller orders page.
 * @param props - Props for the pending count
 * @param props.pendingCount - Number of pending orders
 * @returns A bold header and the pending orders count
 */
export function OrdersHeader({ pendingCount }: OrdersHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="mb-1 font-heading text-[1.6rem] font-extrabold tracking-[-0.025em] text-ink">
          Orders
        </h1>
        <p className="font-sans text-[0.88rem] text-ink-3">
          {pendingCount} pending · All time orders from buyers on Village
        </p>
      </div>
    </div>
  );
}
