import { describe, it, expect } from 'vitest';

import { getTimeGreeting } from '@/lib/date-utils';

describe('getTimeGreeting', () => {
  it('should return "Good morning" during morning hours (05:00 - 11:59)', () => {
    // 05:00 UTC
    const earlyMorning = new Date('2024-01-15T05:00:00Z');
    // 11:59 UTC
    const lateMorning = new Date('2024-01-15T11:59:00Z');

    expect(getTimeGreeting(earlyMorning, 'UTC')).toBe('Good morning');
    expect(getTimeGreeting(lateMorning, 'UTC')).toBe('Good morning');
  });

  it('should return "Good afternoon" during afternoon hours (12:00 - 17:59)', () => {
    // 12:00 UTC
    const noon = new Date('2024-01-15T12:00:00Z');
    // 17:59 UTC
    const lateAfternoon = new Date('2024-01-15T17:59:00Z');

    expect(getTimeGreeting(noon, 'UTC')).toBe('Good afternoon');
    expect(getTimeGreeting(lateAfternoon, 'UTC')).toBe('Good afternoon');
  });

  it('should return "Good evening" during evening and night hours (18:00 - 04:59)', () => {
    // 18:00 UTC
    const eveningStart = new Date('2024-01-15T18:00:00Z');
    // 23:00 UTC
    const night = new Date('2024-01-15T23:00:00Z');
    // 04:59 UTC
    const earlyHours = new Date('2024-01-15T04:59:00Z');

    expect(getTimeGreeting(eveningStart, 'UTC')).toBe('Good evening');
    expect(getTimeGreeting(night, 'UTC')).toBe('Good evening');
    expect(getTimeGreeting(earlyHours, 'UTC')).toBe('Good evening');
  });

  it('should respect the specified timezone', () => {
    // 10:00 AM UTC is 05:00 AM in America/New_York (Good morning)
    // 10:00 AM UTC is 07:00 PM in Asia/Tokyo (Good evening)
    const testDate = new Date('2024-01-15T10:00:00Z');

    expect(getTimeGreeting(testDate, 'America/New_York')).toBe('Good morning');
    expect(getTimeGreeting(testDate, 'Asia/Tokyo')).toBe('Good evening');
  });

  it('should default to current time when no date argument is supplied', () => {
    expect(getTimeGreeting()).toMatch(/Good (morning|afternoon|evening)/);
  });
});
