import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { toLocalString } from '@/lib/date-utils';

describe('toLocalString', () => {
  const MOCK_DATE = new Date('2024-05-09T14:30:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format a date object into a YYYY-MM-DDThh:mm string', () => {
    const date = new Date('2024-12-25T09:05:00Z');
    const result = toLocalString(date);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('should pad single digit months, days, hours, and minutes with zeros', () => {
    // January 2nd, 03:04 AM
    const date = new Date(2024, 0, 2, 3, 4);
    expect(toLocalString(date)).toBe('2024-01-02T03:04');
  });

  it('should correctly format double digit months and days', () => {
    // November 22nd, 22:55
    const date = new Date(2024, 10, 22, 22, 55);
    expect(toLocalString(date)).toBe('2024-11-22T22:55');
  });

  it('should handle the end of the year correctly', () => {
    const date = new Date(2024, 11, 31, 23, 59);
    expect(toLocalString(date)).toBe('2024-12-31T23:59');
  });

  it('should handle the beginning of the year correctly', () => {
    const date = new Date(2025, 0, 1, 0, 0);
    expect(toLocalString(date)).toBe('2025-01-01T00:00');
  });
});
