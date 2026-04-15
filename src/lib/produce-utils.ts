import type { ProduceStatus, ProduceStatusProperty } from './api/generated/models';

/**
 * A helper to get UI colors for each produce status.
 * @param status - The produce status
 * @returns An object containing a css color for bg, text, dot, and bar
 */
export function getStatusColors(status: ProduceStatus | ProduceStatusProperty | string | null) {
  switch (status) {
    case 'active':
      return {
        bg: 'bg-lime/30',
        text: 'text-deep-forest',
        dot: 'bg-lime-600',
        bar: 'bg-lime',
      };
    case 'paused':
      return {
        bg: 'bg-sun/30',
        text: 'text-yellow-900',
        dot: 'bg-yellow-600',
        bar: 'bg-sun',
      };
    case 'deleted':
      return {
        bg: 'bg-clay/30',
        text: 'text-red-900',
        dot: 'bg-red-600',
        bar: 'bg-clay',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        dot: 'bg-gray-400',
        bar: 'bg-gray-400',
      };
  }
}

/**
 * Gets an Emoji for a fallback icon using the produce name/type to pick the best one.
 * @param type - The produce type or name
 * @returns An emoji string representing the produce or a box if none match
 */
export function getProduceIcon(type: string | null) {
  const t = (type || '').toLowerCase();
  if (t.includes('kale') || t.includes('lettuce') || t.includes('greens')) return '🥬';
  if (t.includes('herb') || t.includes('spinach') || t.includes('basil')) return '🌿';
  if (t.includes('carrot') || t.includes('root') || t.includes('radish')) return '🥕';
  if (t.includes('tomato')) return '🍅';
  if (t.includes('pepper')) return '🌶️';
  if (t.includes('berry') || t.includes('strawberry')) return '🍓';
  return '📦';
}
