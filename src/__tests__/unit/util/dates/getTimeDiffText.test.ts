import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { getTimeDiffText } from '@/lib/date-utils';

describe('getTimeDiffText', () => {
  const MOCK_NOW = new Date('2024-01-15T12:00:00Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return an empty string if the input is null', () => {
    expect(getTimeDiffText(null)).toBe('');
  });

  it('should return "Just now" for a time less than one hour ago', () => {
    // 30 minutes ago
    const thirtyMinsAgo = new Date(MOCK_NOW - 1000 * 60 * 30).toISOString();
    expect(getTimeDiffText(thirtyMinsAgo)).toBe('Just now');
  });

  it('should return hours (e.g., "5 hr") for a time more than an hour but less than a day ago', () => {
    // 5 hours ago
    const fiveHoursAgo = new Date(MOCK_NOW - 1000 * 60 * 60 * 5).toISOString();
    expect(getTimeDiffText(fiveHoursAgo)).toBe('5 hr');
  });

  it('should return days (e.g., "3 d") for a time more than 24 hours ago', () => {
    // 3 days ago
    const threeDaysAgo = new Date(MOCK_NOW - 1000 * 60 * 60 * 24 * 3).toISOString();
    expect(getTimeDiffText(threeDaysAgo)).toBe('3 d');
  });

  it('should handle exactly 24 hours as "1 d"', () => {
    const oneDayAgo = new Date(MOCK_NOW - 1000 * 60 * 60 * 24).toISOString();
    expect(getTimeDiffText(oneDayAgo)).toBe('1 d');
  });

  it('should handle exactly 1 hour as "1 hr"', () => {
    const oneHourAgo = new Date(MOCK_NOW - 1000 * 60 * 60).toISOString();
    expect(getTimeDiffText(oneHourAgo)).toBe('1 hr');
  });
});
