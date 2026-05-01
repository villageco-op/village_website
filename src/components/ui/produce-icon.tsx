'use client';

import { createElement } from "react";

import type { ProduceType } from "@/lib/api/generated/models"
import { getProduceIcon } from "@/lib/produce-utils";

interface ProduceIconProps {
  type: ProduceType | string | null;
  className?: string;
}

export function ProduceIcon({ type, className }: ProduceIconProps) {
  const iconComponent = getProduceIcon(type);
  
  return createElement(iconComponent, { className });
}
