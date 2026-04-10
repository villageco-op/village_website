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

/**
 * Joins the Next.js Public Base Path with a given asset path.
 * Ensures exactly one slash between the base and the path.
 * @param src - The image src path relative to public/
 * @returns A normalized combined path: NEXT_PUBLIC_BASE_PATH/src
 */
export function getAssetPath(src: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const normalizedBase = base.replace(/\/+$/, '');

  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  return `${normalizedBase}${normalizedSrc}`;
}
