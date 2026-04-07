import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  variant?: "default" | "inverted";
  hasAfterLine?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "default",
  hasAfterLine = false,
  className,
  ...props
}: SectionHeaderProps) {
  const isCenter = align === "center";
  const isInverted = variant === "inverted";

  return (
    <div
      className={cn(
        "flex flex-col",
        isCenter ? "items-center text-center mx-auto" : "items-start text-left",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2.5 font-heading text-[0.7rem] font-bold uppercase tracking-[0.12em] mb-3.5",
            isInverted ? "text-lime-light" : "text-click-green",
            "before:content-[''] before:block before:w-5.5 before:h-0.5 before:bg-lime before:rounded-xs before:shrink-0",
            hasAfterLine &&
              "after:content-[''] after:block after:w-5.5 after:h-0.5 after:bg-lime after:rounded-xs after:shrink-0",
            isCenter && "justify-center"
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-heading text-[clamp(2rem,3.2vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.03em] mb-4.5",
          isInverted ? "text-cream" : "text-primary",
          isCenter && "max-w-3xl"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-base leading-[1.85]",
            isInverted ? "text-cream/65" : "text-foreground",
            isCenter ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
