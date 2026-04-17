import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { isoStringToLocalTime } from '@/lib/date-utils';

describe('isoStringToLocalTime', () => {
  const MOCK_NOW = '2024-05-09T14:30:00Z';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(MOCK_NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should convert a UTC ISO string to the local equivalent format (YYYY-MM-DDThh:mm)', () => {
    const input = '2024-05-09T14:30:00Z';
    const result = isoStringToLocalTime(input);

    // We calculate the expected value based on the local timezone of the runner
    const date = new Date(input);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const expected = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

    expect(result).toBe(expected);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('should return the current local time if an empty string is provided', () => {
    const result = isoStringToLocalTime('');

    const date = new Date(MOCK_NOW);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const expected = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

    expect(result).toBe(expected);
  });

  it('should return an empty string for invalid date inputs', () => {
    const result = isoStringToLocalTime('not-a-date');
    expect(result).toBe('');
  });

  it('should handle leap years correctly', () => {
    const input = '2024-02-29T12:00:00Z';
    const result = isoStringToLocalTime(input);

    expect(result).toContain('2024-02-29');
  });

  it('should handle cross-day timezone shifts', () => {
    // Late night UTC might be early morning local (or vice versa)
    const input = '2024-05-10T00:30:00Z';
    const result = isoStringToLocalTime(input);

    // Ensure it still returns the 16-character format
    expect(result.length).toBe(16);
    expect(result).not.toContain('Z'); // Result should be local-style, no 'Z'
  });
});
