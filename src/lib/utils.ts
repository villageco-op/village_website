import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind inputs.
 * @remarks
 * This is needed for shadcn tailwind compatitbility.
 * @param inputs - The css class values
 * @returns A single merged string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
