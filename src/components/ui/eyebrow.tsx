import * as React from "react";

import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  align?: "left" | "center";
  variant?: "default" | "inverted";
  hasAfterLine?: boolean;
}

export function Eyebrow({
  children,
  align = "left",
  variant = "default",
  hasAfterLine = false,
  className,
  ...props
}: EyebrowProps) {
  const isCenter = align === "center";
  const isInverted = variant === "inverted";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-heading text-[0.7rem] font-bold uppercase tracking-[0.12em] mb-3.5",
        isInverted ? "text-lime-light" : "text-click-green",
        "before:content-[''] before:block before:w-5.5 before:h-0.5 before:bg-lime before:rounded-xs before:shrink-0",
        hasAfterLine &&
          "after:content-[''] after:block after:w-5.5 after:h-0.5 after:bg-lime after:rounded-xs after:shrink-0",
        isCenter && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
