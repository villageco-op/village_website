import type { CartItem } from './api/generated/models/cartItem';

/**
 * Calculates the total price for a cart group.
 * @param items - The cart items in the group
 * @returns The total as a decimal fixed to two places
 */
export function calculateGroupTotal(items: CartItem[]) {
  return items
    .reduce((total, item) => total + Number(item.pricePerOz) * Number(item.quantityOz), 0)
    .toFixed(2);
}
