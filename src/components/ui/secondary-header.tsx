'use client';

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SecondaryHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function SecondaryHeader({
  title,
  subtitle,
  actions,
  className,
  ...props
}: SecondaryHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-3 sm:flex-row sm:items-center",
        className
      )}
      {...props}
    >
      <div>
        <h2 className="font-heading text-xl font-bold text-deep-forest">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-3">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
