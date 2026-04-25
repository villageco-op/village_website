import {
  ProduceType,
  type ProduceStatus,
  type ProduceStatusProperty,
} from './api/generated/models';

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
 * Gets the best fitting emoji for a produce item.
 * Supports ProduceType enum values, raw names, or fallback strings.
 * @param type - The produce type or name
 * @param defaultIcon - Optional fallback icon (defaults to '🌱')
 * @returns An emoji string
 */
export function getProduceIcon(
  type: ProduceType | string | null | undefined,
  defaultIcon: string = '🌱',
): string {
  if (!type) return defaultIcon;

  const t = type.toLowerCase();

  // Direct Enum/Category Mapping
  const iconMap: Record<string, string> = {
    [ProduceType.leafy_greens]: '🥬',
    [ProduceType.microgreens]: '🌱',
    [ProduceType.cruciferous]: '🥦',
    [ProduceType.root_vegetables]: '🥕',
    [ProduceType.tubers]: '🥔',
    [ProduceType.alliums]: '🧅',
    [ProduceType.nightshades]: '🍅',
    [ProduceType.cucurbits]: '🥒',
    [ProduceType.winter_squash]: '🎃',
    [ProduceType.legumes]: '🫛',
    [ProduceType.stalks_stems]: '🎋',
    [ProduceType.mushrooms]: '🍄',
    [ProduceType.fresh_herbs]: '🌿',
    [ProduceType.pome_fruits]: '🍎',
    [ProduceType.stone_fruits]: '🍑',
    [ProduceType.citrus]: '🍋',
    [ProduceType.berries]: '🍓',
    [ProduceType.melons]: '🍈',
    [ProduceType.tropical_fruits]: '🍍',
    [ProduceType.eggs]: '🥚',
    [ProduceType.raw_honey]: '🍯',
    [ProduceType.nuts_seeds]: '🥜',
    [ProduceType.grains_pulses]: '🌾',
  };

  if (iconMap[t]) return iconMap[t];

  // Keyword Fallback (for specific names like "Kale" or "Granny Smith")
  switch (true) {
    case t.includes('kale') || t.includes('lettuce') || t.includes('greens'):
      return '🥬';
    case t.includes('herb') || t.includes('spinach') || t.includes('basil'):
      return '🌿';
    case t.includes('carrot') || t.includes('radish') || t.includes('beet'):
      return '🥕';
    case t.includes('tomato'):
      return '🍅';
    case t.includes('pepper'):
      return '🌶️';
    case t.includes('apple') || t.includes('pear'):
      return '🍎';
    case t.includes('berry') || t.includes('strawberry') || t.includes('raspberry'):
      return '🍓';
    case t.includes('meat') || t.includes('beef') || t.includes('pork'):
      return '🥩';
    case t.includes('dairy') || t.includes('milk') || t.includes('cheese'):
      return '🧀';
    default:
      return defaultIcon;
  }
}

export const formatProduceType = (str: string) =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
