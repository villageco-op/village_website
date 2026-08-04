import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the HeroSectionHeader component.
 * Extends standard HTML div attributes but omits 'title' to allow for ReactNode input.
 */
export interface HeroSectionHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * A bold hero header component featuring fluid typography, an animated "ping" indicator,
 * and high-contrast styling optimized for dark layouts.
 * @param props - Component properties.
 * @param props.title - The primary headline using fluid 'clamp' typography.
 * @param props.description - Supporting subtext with constrained width for readability.
 * @param props.className - Additional CSS classes for the container.
 * @returns The rendered hero section header.
 */
export function HeroSectionHeader({
  title,
  description,
  className,
  ...props
}: HeroSectionHeaderProps) {
  return (
    <div className={cn('flex flex-col items-start', className)} {...props}>
      {/* Main Title (H1) */}
      <h1 className="font-heading text-[clamp(2.8rem,4.4vw,4.1rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-cream mb-6">
        {title}
      </h1>

      {/* Description / Subtitle */}
      {description && (
        <p className="font-sans text-base leading-[1.82] text-cream/65 max-w-115 mb-10">
          {description}
        </p>
      )}
    </div>
  );
}
