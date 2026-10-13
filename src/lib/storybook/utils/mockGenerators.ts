/**
 * Standard pagination wrapper helper for MSW response builders.
 * @template T - The type of items in the dataset.
 * @param data - The full array of data to paginate.
 * @param page - The current page number (1-indexed, defaults to 1).
 * @param limit - The maximum number of items per page (defaults to 12).
 * @returns An object containing the paginated subset of data and complete pagination metadata.
 */
export const createPaginatedResponse = <T>(data: T[], page = 1, limit = 12) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = data.slice(start, end);

  return {
    data: items,
    meta: {
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};

export * from './orderMockGenerators';
export * from './clientMockGenerators';
export * from './produceMockGenerators';
export * from './growerMockGenerators';
export * from './organizationMockGenerators';
export * from './sellerMockGenerators';
export * from './subscriptionMockGenerators';
