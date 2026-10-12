import { BASE_MOCK_USER } from '../mocks/user.mock';

/**
 * Creates a single mock User entity extended with custom partial properties.
 * @template T - A partial type of User for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed User mock object.
 */
export const createMockUser = <T extends Partial<typeof BASE_MOCK_USER>>(overrides?: T) => ({
  ...BASE_MOCK_USER,
  ...overrides,
});
