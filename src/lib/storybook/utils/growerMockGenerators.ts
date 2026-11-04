import { BASE_MOCK_GROWER } from '../mocks/grower.mock';

import type { MapGrower } from '@/lib/api/generated/models';

/**
 * Creates a single mock grower entity extended with custom partial properties.
 * @template T - A partial type of MapGrower for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed MapGrower mock object.
 */
export const createMockGrower = <T extends Partial<MapGrower>>(overrides?: T): MapGrower => ({
  ...BASE_MOCK_GROWER,
  ...overrides,
});

/**
 * Generates an array of mock MapGrower items.
 * @param count - The number of mock MapGrower items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated MapGrower mock objects.
 */
export const generateMockGrowers = (
  count: number,
  overridesFn?: (index: number) => Partial<MapGrower>,
): MapGrower[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE_MOCK_GROWER,
    sellerId: `grower-${i + 1}`,
    name: `Farm ${i + 1}`,
    lat: 41.6 + i * 0.01,
    lng: -87.35 + i * 0.01,
    image: i % 2 === 0 ? `https://i.pravatar.cc/150?u=grower-${i + 1}` : null,
    rating: Number((4.0 + (i % 10) * 0.1).toFixed(1)),
    city: i % 2 === 0 ? 'Gary' : 'Hobart',
    distanceMiles: Number((2.0 + i * 1.5).toFixed(1)),
    specialties: i % 2 === 0 ? ['Produce', 'Herbs'] : ['Honey', 'Flowers'],
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};
