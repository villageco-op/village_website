import type { ClientResponse, Referral, Referrer } from '@/lib/api/generated/models';

export const BASE_MOCK_REFERRER: Referrer = {
  id: 'ref_1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '0001231234',
};

export const BASE_MOCK_REFERRAL: Referral = {
  id: 'ref_1',
  referrerId: 'cli_1',
  referredId: 'cli_2',
  createdAt: '2024-01-15T00:00:00Z',
};

export const BASE_MOCK_CLIENT: ClientResponse = {
  id: 'cli_1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '0001231234',
  address: '123 Forest Ave',
  city: 'Madison',
  state: 'WI',
  country: 'USA',
  zip: '53703',
  organizationId: 'org_123',
  createdById: 'user_1',
  referredBy: null as any,
  referralCount: 0,
  active: true,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};
