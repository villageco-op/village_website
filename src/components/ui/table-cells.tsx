import { Package } from 'lucide-react';
import Image from 'next/image';

import { Button } from './button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusPill } from '@/components/ui/status-pill';
import { TableCell } from '@/components/ui/table';
import type { Location } from '@/lib/api/generated/models';
import { formatAppDateTime } from '@/lib/date-utils';
import { formatOrderId, formatCurrency, formatOrderDate } from '@/lib/order-utils';
import { cn } from '@/lib/utils';

/**
 * Table cell for user image and name.
 * @param props - Component props
 * @param props.name - User name
 * @param props.id - User ID
 * @param props.image - User profile image
 * @param props.labelPrefix - Prefix used before ID if name isn't provided
 * @param props.className - CSS className
 * @param props.onNameClick - When the name is clicked
 * @param props.avatarFallback - Whether to show a fallback when the avatar image is null
 * @returns A TableCell component
 */
export function IdentityCell({
  name,
  id,
  image,
  labelPrefix = '',
  className,
  onNameClick,
  avatarFallback = true,
}: {
  name?: string;
  id: string;
  image?: string;
  labelPrefix?: string;
  className?: string;
  onNameClick?: () => void;
  avatarFallback?: boolean;
}) {
  const displayName = name || `${labelPrefix} ${id.slice(0, 4)}`.trim();
  const fallback = (name?.[0] || id.slice(0, 2)).toUpperCase();

  return (
    <TableCell className={cn('pl-4 sm:pl-2', className)}>
      <div className="flex items-center gap-2 min-w-max">
        {avatarFallback && (
          <Avatar>
            {image && <AvatarImage src={image} alt={displayName} />}
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        )}
        {onNameClick !== undefined ? (
          <Button
            size="sm"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              onNameClick();
            }}
          >
            {displayName}
          </Button>
        ) : (
          <span className="font-heading font-bold text-ink text-[0.82rem] truncate max-w-64">
            {displayName}
          </span>
        )}
      </div>
    </TableCell>
  );
}

/**
 * Table cell for ID.
 * @param props - Component props
 * @param props.id - ID
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function IdCell({ id, className }: { id: string; className?: string }) {
  return (
    <TableCell className={cn('font-sans text-ink-2 text-[0.82rem]', className)}>
      {formatOrderId(id)}
    </TableCell>
  );
}

/**
 * Table cell for amount.
 * @param props - Component props
 * @param props.amount - The cost in dollars
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function AmountCell({
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
 * Table cell for dates.
 * @param props - Component props
 * @param props.date - Date
 * @param props.options - Date formatting options
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function DateCell({
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
 * Table cell for date and time formatted together.
 * @param props - Component props
 * @param props.date - Order date and time
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function DateTimeCell({
  date,
  className,
}: {
  date?: string | null;
  className?: string;
}) {
  const formattedDateTime = formatAppDateTime(date);

  return (
    <TableCell className={cn('font-sans text-ink-2 text-[0.82rem] whitespace-nowrap', className)}>
      {formattedDateTime}
    </TableCell>
  );
}

/**
 * Table cell for order or subscription status.
 * @param props - Component props
 * @param props.status - Order status
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function StatusCell({ status, className }: { status?: string; className?: string }) {

  return (
    <TableCell className={cn('pr-4 sm:pr-2 text-right', className)}>
      <StatusPill
        status={status || 'pending'}
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
export function FulfillmentCell({
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
 * Table cell for ounces.
 * @param props - Component props
 * @param props.quantityOz - Quantity
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function QuantityOzCell({
  quantityOz,
  className,
}: {
  quantityOz?: string | number;
  className?: string;
}) {
  return <TableCell className={className}>{quantityOz ?? 0} oz</TableCell>;
}

/**
 * Table cell for displaying product info (image, title, and extra item count).
 * @param props - Component props
 * @param props.title - The product title
 * @param props.image - Product image
 * @param props.extraCount - Number of additional products in the order
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function OrderProductCell({
  title,
  image,
  extraCount = 0,
  className,
}: {
  title?: string;
  image?: string;
  extraCount?: number;
  className?: string;
}) {
  const displayTitle = title || 'Order Item';
  const extraText = extraCount > 0 ? ` +${extraCount}` : '';

  return (
    <TableCell className={cn('pl-2 sm:pl-1', className)}>
      <div className="flex items-center gap-3 min-w-max">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border/50 bg-slate-100">
          {image ? (
            <Image src={image} alt={displayTitle} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <Package className="h-4 w-4" />
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-primary truncate max-w-48">
          {displayTitle}
          {extraText && <span className="text-ink-3 font-normal">{extraText}</span>}
        </span>
      </div>
    </TableCell>
  );
}

/**
 * Table cell for displaying subscription product title with an optional direct link.
 * @param props - Component props
 * @param props.title - The produce name
 * @param props.onProductClick - When the product is clicked
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function SubscriptionProductCell({
  title,
  onProductClick,
  className,
}: {
  title?: string;
  onProductClick?: () => void;
  className?: string;
}) {
  const displayTitle = title || 'Unknown Product';

  return (
    <TableCell className={cn('pl-4 sm:pl-2', className)}>
      <div className="flex items-center gap-2 min-w-max">
        {onProductClick !== undefined ? (
          <Button
            size="sm"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick();
            }}
          >
            {displayTitle}
          </Button>
        ) : (
          <span className="font-heading font-bold text-ink text-[0.82rem] truncate max-w-48">
            {displayTitle}
          </span>
        )}
      </div>
    </TableCell>
  );
}

/**
 * Table cell for displaying location info (address or city/state).
 * @param props - Component props
 * @param props.location - The location
 * @param props.className - CSS className
 * @returns A TableCell component
 */
export function LocationCell({
  location,
  className,
}: {
  location?: Location | null;
  className?: string;
}) {
  const locationText =
    location?.address ||
    [location?.city, location?.state].filter(Boolean).join(', ') ||
    'Location pending';

  return (
    <TableCell className={cn('font-sans text-ink-2 text-[0.82rem]', className)}>
      <span className="block truncate max-w-40" title={locationText}>
        {locationText}
      </span>
    </TableCell>
  );
}

/**
 * Table cell for radio input.
 * @param props - Component props
 * @param props.name - The cell name
 * @param props.isSelected - Is the row selected
 * @param props.onChange - Callback for selection status changing 
 * @returns A table cell component
 */
export default function RadioCell({
  name,
  isSelected,
  onChange
}: {
  name: string;
  isSelected: boolean;
  onChange: () => void;
}) {
  return (
    <TableCell>
      <input
        type="radio"
        name={name}
        checked={isSelected}
        onChange={() => onChange()}
        className="h-4 w-4 cursor-pointer accent-primary"
      />
    </TableCell>
  );
}
