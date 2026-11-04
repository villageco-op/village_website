import type { MapGrower } from '@/lib/api/generated/models';

/**
 * Complete default baseline MapGrower mock object.
 */
export const BASE_MOCK_GROWER: MapGrower = {
  sellerId: 'grower-alpha',
  name: 'Alpha Farms',
  lat: 41.61,
  lng: -87.34,
  image: 'https://i.pravatar.cc/150?u=alpha',
  rating: 4.9,
  city: 'Gary',
  distanceMiles: 3.2,
  specialties: ['Hydroponic Lettuce', 'Basil', 'Microgreens'],
};

/**
 * Pre-configured list of mock growers.
 */
export const MOCK_GROWERS_LIST: MapGrower[] = [
  BASE_MOCK_GROWER,
  {
    sellerId: 'grower-beta',
    name: 'Beta Gardens',
    lat: 41.59,
    lng: -87.32,
    image: null,
    rating: 4.2,
    city: 'Hobart',
    distanceMiles: 7.5,
    specialties: ['Honey', 'Wildflowers'],
  },
];
