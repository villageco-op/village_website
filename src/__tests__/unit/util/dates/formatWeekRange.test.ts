import { describe, it, expect } from 'vitest';

import { formatWeekRange } from '@/lib/date-utils';

describe('formatWeekRange', () => {
  it('should format a week range within the same month', () => {
    // Wednesday, Jan 17, 2024
    // Week: Sunday Jan 14 – Saturday Jan 20
    const midWeek = new Date('2024-01-17T12:00:00Z');

    expect(formatWeekRange(midWeek, 'UTC')).toBe('Jan 14–20');
  });

  it('should format a week range spanning across two months', () => {
    // Thursday, Oct 31, 2024
    // Week: Sunday Oct 27 – Saturday Nov 2
    const monthEnd = new Date('2024-10-31T12:00:00Z');

    expect(formatWeekRange(monthEnd, 'UTC')).toBe('Oct 27–Nov 2');
  });

  it('should handle the first day of the week (Sunday)', () => {
    // Sunday, Jan 14, 2024
    const sunday = new Date('2024-01-14T12:00:00Z');

    expect(formatWeekRange(sunday, 'UTC')).toBe('Jan 14–20');
  });

  it('should handle the last day of the week (Saturday)', () => {
    // Saturday, Jan 20, 2024
    const saturday = new Date('2024-01-20T12:00:00Z');

    expect(formatWeekRange(saturday, 'UTC')).toBe('Jan 14–20');
  });

  it('should handle a week range crossing a year boundary', () => {
    // Tuesday, Dec 31, 2024
    // Week: Sunday Dec 29 – Saturday Jan 4
    const yearEnd = new Date('2024-12-31T12:00:00Z');

    expect(formatWeekRange(yearEnd, 'UTC')).toBe('Dec 29–Jan 4');
  });

  it('should default to current date when no parameters are provided', () => {
    const result = formatWeekRange();
    expect(result).toMatch(/^[A-Z][a-z]{2}\s\d{1,2}–([A-Z][a-z]{2}\s)?\d{1,2}$/);
  });
});
