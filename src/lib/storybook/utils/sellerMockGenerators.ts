import type { SellerReviewItem } from '@/lib/api/generated/models';

/**
 * Generates an array of mock SellerReviewItem items.
 * @param count - The number of mock SellerReviewItem items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated SellerReviewItem mock objects.
 */
export const generateMockReviews = (
  count: number,
  overridesFn?: (index: number) => Partial<SellerReviewItem>,
): SellerReviewItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${i}`,
    rating: (i % 3) + 3,
    comment:
      i % 2 === 0
        ? `These are the best tomatoes I've ever had! Super fresh. (Review ${i + 1})`
        : `Really good quality, though shipping took an extra day. (Review ${i + 1})`,
    createdAt: new Date(Date.now() - i * 3600000 * 24).toISOString(),
    buyer: {
      id: `buyer-${i}`,
      name: i % 2 === 0 ? 'Alice Farmer' : 'Bob Gardener',
      image: '',
    },
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};
