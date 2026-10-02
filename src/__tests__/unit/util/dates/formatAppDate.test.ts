import { describe, it, expect } from 'vitest';

import { formatAppDate } from '@/lib/date-utils';

describe('formatAppDate', () => {
  // ISO UTC string representing Jan 15, 2024 at noon UTC
  const TEST_DATE_ISO = '2024-01-15T12:00:00Z';
  const TEST_DATE_OBJ = new Date(TEST_DATE_ISO);

  it('should return the custom or default fallback when input is null, undefined, or empty', () => {
    expect(formatAppDate(null)).toBe('—');
    expect(formatAppDate(undefined)).toBe('—');
    expect(formatAppDate('')).toBe('—');
    expect(formatAppDate(null, 'full', 'N/A')).toBe('N/A');
  });

  it('should return fallback for invalid date strings or objects', () => {
    expect(formatAppDate('not-a-valid-date')).toBe('—');
    expect(formatAppDate(new Date('invalid'))).toBe('—');
    expect(formatAppDate('invalid-date', 'short', 'Custom Fallback')).toBe('Custom Fallback');
  });

  it('should accept both string and Date object inputs', () => {
    const formattedFromString = formatAppDate(TEST_DATE_ISO, 'full');
    const formattedFromObject = formatAppDate(TEST_DATE_OBJ, 'full');

    expect(formattedFromString).toBe(formattedFromObject);
  });

  it('should correctly format using default preset ("full")', () => {
    expect(formatAppDate(TEST_DATE_ISO)).toBe('Jan 15, 2024');
  });

  it('should correctly format all presets', () => {
    expect(formatAppDate(TEST_DATE_ISO, 'numeric')).toBe('1/15/2024');
    expect(formatAppDate(TEST_DATE_ISO, 'short')).toBe('Jan 15');
    expect(formatAppDate(TEST_DATE_ISO, 'dayMonth')).toBe('Jan 15');
    expect(formatAppDate(TEST_DATE_ISO, 'full')).toBe('Jan 15, 2024');
    expect(formatAppDate(TEST_DATE_ISO, 'monthYear')).toBe('Jan 2024');
    expect(formatAppDate(TEST_DATE_ISO, 'longMonthYear')).toBe('January 2024');
    expect(formatAppDate(TEST_DATE_ISO, 'weekdayDayMonth')).toBe('Mon, Jan 15');
  });
});
