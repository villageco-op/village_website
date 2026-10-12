import { BASE_MOCK_ORGANIZATION, BASE_MOCK_MEMBER } from '../mocks/organization.mock';

import type { OrgMember } from '@/lib/api/generated/models';

/**
 * Creates a single mock Organization entity extended with custom partial properties.
 * @template T - A partial type of Organization for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed Organization mock object.
 */
export const createMockOrganization = <T extends Partial<typeof BASE_MOCK_ORGANIZATION>>(
  overrides?: T,
) => ({
  ...BASE_MOCK_ORGANIZATION,
  ...overrides,
});

/**
 * Generates an array of mock Org Member items.
 * @param count - The number of mock Org Member items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated Org Member mock objects.
 */
export const generateMockOrgMembers = (
  count: number,
  overridesFn?: (index: number) => Partial<OrgMember>,
): OrgMember[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE_MOCK_MEMBER,
    id: `usr_${i + 1}`,
    name: `John Smith ${i + 1}`,
    email: `john.smith${i + 1}@example.com`,
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};
