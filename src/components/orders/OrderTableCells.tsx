import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusPill } from '@/components/ui/status-pill';
import { TableCell } from '@/components/ui/table';
import { formatOrderId, formatCurrency, formatOrderDate, ozToLbs } from '@/lib/order-utils';
import { cn } from '@/lib/utils';

/**
 * Table cell for user image and name.
 * @param props - Component props
 * @param props.name - User name
 * @param props.id - User ID
 * @param props.image - User profile image
 * @param props.labelPrefix - Prefix used before ID if name isn't provided
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderIdentityCell({
  name,
  id,
  image,
  labelPrefix = '',
  className,
}: {
  name?: string;
  id: string;
  image?: string;
  labelPrefix?: string;
  className?: string;
}) {
  const displayName = name || `${labelPrefix} ${id.slice(0, 4)}`.trim();
  const fallback = (name?.[0] || id.slice(0, 2)).toUpperCase();

  return (
    <TableCell className={cn('pl-4 sm:pl-2', className)}>
      <div className="flex items-center gap-2 min-w-max">
        <Avatar className="h-7 w-7 border-0 bg-lime-pale text-click-green font-heading font-extrabold text-[0.65rem]">
          {image && <AvatarImage src={image} alt={displayName} />}
          <AvatarFallback className="bg-transparent">{fallback}</AvatarFallback>
        </Avatar>
        <span className="font-heading font-bold text-ink text-[0.82rem] truncate max-w-24">
          {displayName}
        </span>
      </div>
    </TableCell>
  );
}

/**
 * Table cell for order ID.
 * @param props - Component props
 * @param props.id - Order ID
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderIdCell({ id, className }: { id: string; className?: string }) {
  return (
    <TableCell className={cn('font-sans text-ink-2 text-[0.82rem]', className)}>
      {formatOrderId(id)}
    </TableCell>
  );
}

/**
 * Table cell for order amount.
 * @param props - Component props
 * @param props.amount - The order cost in dollars
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderAmountCell({
  amount,
  className,
}: {
  amount: number | string;
  className?: string;
}) {
  return (
    <TableCell className={cn('font-sans text-ink-2 text-[0.82rem]', className)}>
      {formatCurrency(amount)}
    </TableCell>
  );
}

/**
 * Table cell for order pickup or delivery date.
 * @param props - Component props
 * @param props.date - Order date
 * @param props.options - Date formatting options
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderDateCell({
  date,
  options,
  className,
}: {
  date?: string | null;
  options: Intl.DateTimeFormatOptions;
  className?: string;
}) {
  return (
    <TableCell className={cn('font-sans text-ink-2 text-[0.82rem] whitespace-nowrap', className)}>
      {formatOrderDate(date, options)}
    </TableCell>
  );
}

/**
 * Table cell for order status.
 * @param props - Component props
 * @param props.status - Order status
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderStatusCell({ status, className }: { status?: string; className?: string }) {
  const isCanceled = status?.toLowerCase() === 'canceled';
  const isCompleted = status?.toLowerCase() === 'completed';

  return (
    <TableCell className={cn('pr-4 sm:pr-2 text-right', className)}>
      <StatusPill
        status={status || 'pending'}
        variant={isCompleted ? 'lime' : 'sun'}
        className={cn(
          'inline-flex ml-auto text-[0.65rem]',
          isCanceled && 'bg-destructive/10 text-destructive border-destructive/20',
        )}
      />
    </TableCell>
  );
}

/**
 * Table cell for order fulfillment type.
 * @param props - Component props
 * @param props.fulfillmentType - Order fulfillment type
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderFulfillmentCell({
  fulfillmentType,
  className,
}: {
  fulfillmentType?: string;
  className?: string;
}) {
  const isDelivery = fulfillmentType?.toLowerCase() === 'delivery';

  return (
    <TableCell>
      <div className={cn('flex items-center gap-1.5', className)}>
        <span className="text-sm capitalize text-ink-3">{fulfillmentType}</span>
        <span title={isDelivery ? 'Delivery' : 'Pickup'} />
      </div>
    </TableCell>
  );
}

/**
 * Table cell for order amount displayed in pounds.
 * @param props - Component props
 * @param props.quantityOz - Order quantity
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderQuantityOzCell({
  quantityOz,
  className,
}: {
  quantityOz?: string | number;
  className?: string;
}) {
  return <TableCell className={className}>{ozToLbs(quantityOz ?? 0)} lbs</TableCell>;
}
