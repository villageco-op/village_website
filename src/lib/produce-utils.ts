import {
  Leaf,
  Sprout,
  Carrot,
  Apple,
  Citrus,
  Grape,
  Cherry,
  Cloudy,
  Beef,
  Milk,
  Egg,
  Drumstick,
  Wheat,
  Nut,
  Flower2,
  type LucideIcon,
} from 'lucide-react';

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

// Direct Enum/Category Mapping
const ICON_MAP: Record<string, LucideIcon> = {
  [ProduceType.leafy_greens]: Leaf,
  [ProduceType.microgreens]: Sprout,
  [ProduceType.cruciferous]: Leaf,
  [ProduceType.root_vegetables]: Carrot,
  [ProduceType.tubers]: Leaf,
  [ProduceType.alliums]: Leaf,
  [ProduceType.nightshades]: Apple,
  [ProduceType.cucurbits]: Leaf,
  [ProduceType.winter_squash]: Citrus,
  [ProduceType.legumes]: Sprout,
  [ProduceType.stalks_stems]: Leaf,
  [ProduceType.mushrooms]: Cloudy,
  [ProduceType.fresh_herbs]: Flower2,
  [ProduceType.pome_fruits]: Apple,
  [ProduceType.stone_fruits]: Cherry,
  [ProduceType.citrus]: Citrus,
  [ProduceType.berries]: Grape,
  [ProduceType.melons]: Citrus,
  [ProduceType.tropical_fruits]: Citrus,
  [ProduceType.eggs]: Egg,
  [ProduceType.raw_honey]: Flower2,
  [ProduceType.nuts_seeds]: Nut,
  [ProduceType.grains_pulses]: Wheat,
};

/**
 * Gets the best fitting Lucide icon for a produce item.
 * @param type - The produce type or name
 * @param DefaultIcon - Optional fallback icon component (defaults to Sprout)
 * @returns A LucideIcon component
 */
export function getProduceIcon(
  type: ProduceType | string | null | undefined,
  DefaultIcon: LucideIcon = Sprout,
): LucideIcon {
  if (!type) return DefaultIcon;

  const t = type.toLowerCase();

  if (ICON_MAP[t]) return ICON_MAP[t];

  // Keyword Fallback
  if (
    t.includes('kale') ||
    t.includes('lettuce') ||
    t.includes('greens') ||
    t.includes('spinach')
  ) {
    return Leaf;
  }
  if (t.includes('herb') || t.includes('basil')) {
    return Flower2;
  }
  if (t.includes('carrot') || t.includes('radish') || t.includes('beet')) {
    return Carrot;
  }
  if (t.includes('apple') || t.includes('pear') || t.includes('tomato')) {
    return Apple;
  }
  if (
    t.includes('berry') ||
    t.includes('strawberry') ||
    t.includes('raspberry') ||
    t.includes('grape')
  ) {
    return Grape;
  }
  if (t.includes('meat') || t.includes('beef') || t.includes('pork')) {
    return Beef;
  }
  if (t.includes('chicken') || t.includes('poultry')) {
    return Drumstick;
  }
  if (t.includes('dairy') || t.includes('milk') || t.includes('cheese')) {
    return Milk;
  }

  return DefaultIcon;
}

/**
 * Formats the snake_case enum to natural text.
 * @param str - The produce type
 * @returns The produce type with spaces and capitalized
 */
export const formatProduceType = (str: string) =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

/**
 * Formats ounces into pounds or just adds 'oz' if less than one pound.
 * @param oz - The input ounces
 * @returns A formated string containing the weight
 */
export const formatWeight = (oz: number) => {
  if (oz >= 16) {
    return `${(oz / 16).toFixed(1).replace('.0', '')} lbs`;
  }
  return `${oz} oz`;
};
