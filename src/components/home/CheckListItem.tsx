import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const checkListItemVariants = cva('flex items-start gap-[14px] font-sans leading-[1.65]', {
  variants: {
    variant: {
      default: 'text-[0.95rem] text-ink-2',
      impact: 'text-[0.98rem] text-cream/80',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const checkIconVariants = cva(
  'shrink-0 rounded-full flex items-center justify-center font-heading font-bold text-lime',
  {
    variants: {
      variant: {
        default: 'w-[28px] h-[28px] bg-deep-forest text-[0.7rem] mt-[1px]',
        impact:
          'w-[26px] h-[26px] border-[1.5px] border-lime/40 bg-lime/10 text-[0.68rem] mt-[2px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Props for the checklist item.
 */
export interface CheckListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement>, VariantProps<typeof checkListItemVariants> {}

/**
 * A list item featuring a stylized checkmark icon and text.
 * @param props - Component properties.
 * @param props.className - Classes for the list element.
 * @param props.variant - Visual style: "default" (dark) or "impact" (light).
 * @param props.children - The text or content of the list item.
 * @param props... - Attributes passed to the root li element.
 */
export const CheckListItem = React.forwardRef<HTMLLIElement, CheckListItemProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <li ref={ref} className={cn(checkListItemVariants({ variant }), className)} {...props}>
        <div className={cn(checkIconVariants({ variant }))}>✓</div>
        <span>{children}</span>
      </li>
    );
  },
);

CheckListItem.displayName = 'CheckListItem';
