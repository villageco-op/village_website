import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const statBlockVariants = cva(
  'bg-cream rounded-xl p-[26px_26px_26px_30px] border-l-4 shadow-[0_4px_24px_rgba(42,75,40,0.06)] transition-all duration-[220ms] hover:translate-x-[5px] hover:shadow-[0_8px_32px_rgba(42,75,40,0.1)] flex flex-col',
  {
    variants: {
      variant: {
        default: 'border-lime',
        sun: 'border-sun',
        'click-green': 'border-click-green',
        clay: 'border-clay',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const statValVariants = cva(
  'font-heading text-[2.4rem] font-extrabold leading-none mb-[5px] tracking-[-0.03em]',
  {
    variants: {
      variant: {
        default: 'text-deep-forest',
        sun: 'text-sun',
        'click-green': 'text-click-green',
        clay: 'text-deep-forest',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Props for the stat block.
 */
export interface StatBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statBlockVariants> {
  value: React.ReactNode;
  description: React.ReactNode;
}

/**
 * Displays a statistic value and description.
 */
export const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  ({ className, variant, value, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(statBlockVariants({ variant }), className)} {...props}>
        <div className={cn(statValVariants({ variant }))}>{value}</div>
        <div className="font-sans text-[0.83rem] text-ink-2 leading-[1.55]">{description}</div>
      </div>
    );
  },
);

StatBlock.displayName = 'StatBlock';
