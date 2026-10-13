import { OrgRole, type PublicUserProfile, type User } from '@/lib/api/generated/models';

/**
 * Baseline default User mock.
 */
export const BASE_MOCK_USER: User = {
  id: 'usr_buyer_101',
  name: 'Alex Rivera',
  email: 'alex@village.com',
  emailVerified: null,
  image: null,
  organizationId: null,
  orgRole: null,
  aboutMe: 'Enthusiastic home cook and supporter of local sustainable farming.',
  specialties: [],
  goal: null,
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'IL',
  country: 'United States',
  zip: '62701',
  lat: 39.7817,
  lng: -89.6501,
  deliveryRangeMiles: null,
  isOnboardingComplete: true,
  stripeOnboardingComplete: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Dedicated Buyer Mock.
 */
export const MOCK_BUYER_USER: User = {
  ...BASE_MOCK_USER,
  id: 'usr_buyer_101',
  name: 'Alex Rivera',
  email: 'alex.buyer@village.com',
};

/**
 * Dedicated Seller Mock featuring seller-specific domain attributes.
 */
export const MOCK_SELLER_USER: User = {
  ...BASE_MOCK_USER,
  id: 'usr_seller_202',
  name: 'Green Thumb Microgreens',
  email: 'contact@greenthumb.org',
  aboutMe: 'Growing nutrient-dense microgreens and organic radishes in urban raised garden beds.',
  specialties: ['Microgreens', 'Radishes', 'Herbs'],
  goal: '250',
  deliveryRangeMiles: '10',
  stripeOnboardingComplete: true,
};

export const MOCK_ORG_ADMIN_USER = {
  ...BASE_MOCK_USER,
  organizationId: 'org_123',
  orgRole: OrgRole.admin,
};

export const MOCK_ORG_MEMBER_USER = {
  ...BASE_MOCK_USER,
  organizationId: 'org_123',
  orgRole: OrgRole.member,
};

export const MOCK_NEW_USER: User = {
  ...BASE_MOCK_USER,
  emailVerified: null,
  image: null,
  organizationId: null,
  orgRole: null,
  stripeOnboardingComplete: null,
  isOnboardingComplete: false,
};

export const MOCK_SELLER_PUBLIC_PROFILE: PublicUserProfile = {
  id: MOCK_SELLER_USER.id,
  name: MOCK_SELLER_USER.name,
  organization: null,
  organizationId: '',
  image: MOCK_SELLER_USER.image ?? '',
  aboutMe: MOCK_SELLER_USER.aboutMe,
  specialties: MOCK_SELLER_USER.specialties as string[],
  city: MOCK_SELLER_USER.city,
  state: MOCK_SELLER_USER.state,
  country: MOCK_SELLER_USER.country,
  joinedAt: '2023-05-15T00:00:00Z',
  starRating: 4.9,
  totalReviews: 42,
  activeBuyerCount: 15,
  reviewBreakdown: { '5': 38, '4': 3, '3': 1, '2': 0, '1': 0 },
};
