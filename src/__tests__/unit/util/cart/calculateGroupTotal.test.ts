import { describe, it, expect } from 'vitest';

import type { CartItem } from '@/lib/api/generated/models';
import { calculateGroupTotal } from '@/lib/cart-utils';

describe('calculateGroupTotal', () => {
  it('should return "0.00" for an empty array of items', () => {
    expect(calculateGroupTotal([])).toBe('0.00');
  });

  it('should correctly calculate the total for a single item', () => {
    const items: Partial<CartItem>[] = [{ pricePerOz: '1.50', quantityOz: '2' }];
    // 1.50 * 2 = 3.00
    expect(calculateGroupTotal(items as CartItem[])).toBe('3.00');
  });

  it('should correctly sum multiple items', () => {
    const items: Partial<CartItem>[] = [
      { pricePerOz: '2.00', quantityOz: '5' }, // 10.00
      { pricePerOz: '0.50', quantityOz: '10' }, // 5.00
      { pricePerOz: '1.25', quantityOz: '1' }, // 1.25
    ];
    expect(calculateGroupTotal(items as CartItem[])).toBe('16.25');
  });

  it('should handle string inputs that represent decimals', () => {
    const items: Partial<CartItem>[] = [{ pricePerOz: '10.99', quantityOz: '0.5' }];
    // 5.495 rounded via toFixed(2) usually results in "5.50"
    expect(calculateGroupTotal(items as CartItem[])).toBe('5.50');
  });

  it('should handle zero quantities or prices', () => {
    const items: Partial<CartItem>[] = [
      { pricePerOz: '0', quantityOz: '100' },
      { pricePerOz: '10.00', quantityOz: '0' },
    ];
    expect(calculateGroupTotal(items as CartItem[])).toBe('0.00');
  });

  it('should maintain two decimal places even for whole numbers', () => {
    const items: Partial<CartItem>[] = [{ pricePerOz: '5', quantityOz: '4' }];
    expect(calculateGroupTotal(items as CartItem[])).toBe('20.00');
  });

  it('should handle floating point precision correctly (e.g., 0.1 + 0.2 logic)', () => {
    const items: Partial<CartItem>[] = [
      { pricePerOz: '0.1', quantityOz: '1' },
      { pricePerOz: '0.2', quantityOz: '1' },
    ];
    expect(calculateGroupTotal(items as CartItem[])).toBe('0.30');
  });
});
