import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props accepting an icon and text to be displayed.
 */
export interface ImpactCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  text: React.ReactNode;
}

/**
 * A simple card showing an icon and text.
 * @returns The component html
 */
export const ImpactCard = React.forwardRef<HTMLDivElement, ImpactCardProps>(
  ({ className, icon, text, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'bg-white/5 border-white/10 rounded-[14px] shadow-none ring-0',
          'transition-all duration-250 hover:bg-white/10 hover:-translate-y-0.75',
          'flex flex-col gap-0 overflow-visible',
          className,
        )}
        {...props}
      >
        <CardContent className="p-[28px_22px]">
          <span className="text-[2rem] mb-2.5 block leading-none">{icon}</span>

          <div className="font-sans text-[0.8rem] text-cream/60 leading-[1.55]">{text}</div>
        </CardContent>
      </Card>
    );
  },
);

ImpactCard.displayName = 'ImpactCard';
