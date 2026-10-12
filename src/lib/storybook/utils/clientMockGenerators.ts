import { BASE_MOCK_CLIENT, BASE_MOCK_REFERRAL, BASE_MOCK_REFERRER } from '../mocks/client.mock';
import { BASE_MOCK_INVITE } from '../mocks/invite.mock';

import type { ClientResponse, Invite, Referral, Referrer } from '@/lib/api/generated/models';

/**
 * Creates a single mock Referrer entity extended with custom partial properties.
 * @template T - A partial type of Referrer for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed Referrer mock object.
 */
export const createMockReferrer = <T extends Partial<Referrer>>(overrides?: T): Referrer => ({
  ...BASE_MOCK_REFERRER,
  ...overrides,
});

/**
 * Creates a single mock Referral entity extended with custom partial properties.
 * @template T - A partial type of Referral for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed Referral mock object.
 */
export const createMockReferral = <T extends Partial<Referral>>(overrides?: T): Referral => ({
  ...BASE_MOCK_REFERRAL,
  ...overrides,
});

/**
 * Creates a single mock ClientResponse entity extended with custom partial properties.
 * @template T - A partial type of ClientResponse for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed ClientResponse mock object.
 */
export const createMockClient = <T extends Partial<ClientResponse>>(
  overrides?: T,
): ClientResponse => ({
  ...BASE_MOCK_CLIENT,
  ...overrides,
});

/**
 * Generates an array of mock ClientResponse items with customizable defaults.
 * @param count - The number of mock clients to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each client.
 * @returns An array of generated ClientResponse mock objects.
 */
export const generateMockClients = (
  count: number,
  overridesFn?: (index: number) => Partial<ClientResponse>,
): ClientResponse[] => {
  const sampleClients = [
    {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      city: 'Madison',
      state: 'WI',
      zip: '53703',
      active: true,
    },
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      city: 'New York',
      state: 'NY',
      zip: '10166',
      active: true,
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      city: null,
      state: null,
      zip: null,
      active: false,
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const sample = sampleClients[i % sampleClients.length];

    return createMockClient({
      id: `cli_${i + 1}`,
      name: sample.name,
      email: sample.email,
      address: sample.city ? `${(i + 1) * 100} Main St` : null,
      city: sample.city,
      state: sample.state,
      zip: sample.zip,
      active: sample.active,
      createdAt: new Date(Date.now() - i * 86400000 * 15).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000 * 15).toISOString(),
      ...(overridesFn ? overridesFn(i) : {}),
    });
  });
};

/**
 * Generates an array of mock Referrer items.
 * @param count - The number of mock Referrer items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated Referrer mock objects.
 */
export const generateMockReferrers = (
  count: number,
  overridesFn?: (index: number) => Partial<Referrer>,
): Referrer[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE_MOCK_REFERRER,
    id: `ref_${i + 1}`,
    name: i % 2 === 0 ? 'John Smith' : 'Alice Johnson',
    email: i % 2 === 0 ? 'john.smith@example.com' : 'alice.johnson@example.com',
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};

/**
 * Generates an array of mock Invite items.
 * @param count - The number of mock Invite items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated Invite mock objects.
 */
export const generateMockInvites = (
  count: number,
  overridesFn?: (index: number) => Partial<Invite>,
): Invite[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE_MOCK_INVITE,
    id: `invite_${i + 1}`,
    email: `pending.teammate${i + 1}@example.com`,
    code: `abc789${i + 1}`,
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};
