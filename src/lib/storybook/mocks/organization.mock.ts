import { type Organization, type OrgMember, OrgRole, OrgType } from '@/lib/api/generated/models';

export const BASE_MOCK_ORGANIZATION: Organization = {
  id: 'org_123',
  type: OrgType.pantry,
  name: 'Community Food Bank',
  subdomain: 'community-food-bank',
  email: 'contact@communityfoodbank.org',
  website: 'https://communityfoodbank.org',
  phone: '555-0199',
  image: null,
  address: '100 Main St',
  city: 'Springfield',
  state: 'IL',
  country: 'United States',
  zip: '62701',
  lat: 39.7817,
  lng: -89.6501,
  maxReferrals: 4,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const BASE_MOCK_MEMBER: OrgMember = {
  id: 'usr_987',
  name: 'John Smith',
  email: 'john.smith@example.com',
  orgRole: OrgRole.member,
};
