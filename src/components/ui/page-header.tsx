'use client';

import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end",
        className
      )}
      {...props}
    >
      <div>
        <h1 className="mb-1 font-heading text-[1.6rem] font-extrabold tracking-[-0.025em] text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[0.88rem] text-ink-3">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}
