import { describe, it, expect } from 'vitest';

import { formatAppDateTime } from '@/lib/date-utils';

describe('formatAppDateTime', () => {
  const TEST_DATETIME_ISO = '2024-01-15T14:30:00Z';
  const TEST_DATETIME_OBJ = new Date(TEST_DATETIME_ISO);

  it('should return fallback when date is missing or invalid', () => {
    expect(formatAppDateTime(null)).toBe('—');
    expect(formatAppDateTime(undefined)).toBe('—');
    expect(formatAppDateTime('invalid-date')).toBe('—');
    expect(formatAppDateTime(null, 'short', 'No Date')).toBe('No Date');
  });

  it('should accept both string and Date object inputs', () => {
    const formattedFromString = formatAppDateTime(TEST_DATETIME_ISO);
    const formattedFromObject = formatAppDateTime(TEST_DATETIME_OBJ);

    expect(formattedFromString).toBe(formattedFromObject);
  });

  it('should format using default preset ("short")', () => {
    const result = formatAppDateTime(TEST_DATETIME_ISO);

    // Expect date and time formatted string matching local execution context
    expect(result).toMatch(/Jan 15, 2024, \d{1,2}:30\s?(AM|PM)/);
  });

  it('should format correctly for "numeric" preset', () => {
    const result = formatAppDateTime(TEST_DATETIME_ISO, 'numeric');

    expect(result).toMatch(/1\/15\/2024, \d{1,2}:30\s?(AM|PM)/);
  });

  it('should format correctly for "timeOnly" preset', () => {
    const result = formatAppDateTime(TEST_DATETIME_ISO, 'timeOnly');

    expect(result).toMatch(/^\d{1,2}:30\s?(AM|PM)$/);
  });

  it('should format correctly for "fullWithDay" preset', () => {
    const result = formatAppDateTime(TEST_DATETIME_ISO, 'fullWithDay');

    expect(result).toMatch(/Mon, Jan 15, 2024, \d{1,2}:30\s?(AM|PM)/);
  });
});
