/**
 * Computes the difference in time from the given date to now.
 * @param dateString - A standard date string
 * @returns A formatted date string or an empty string if the input is null
 */
export function getTimeDiffText(dateString: string | null) {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} d`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hr`;
  return 'Just now';
}

/**
 * Helper to reliably format a UTC Date string to HTML datetime-local (YYYY-MM-DDThh:mm)
 * @param date - The input UTC Date
 * @returns A HTML datetime-local (YYYY-MM-DDThh:mm) string
 */
export const UTCDateToLocal = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

/**
 * Adjusts an ISO strings timezone to local time.
 * @param isoString - Input ISO string
 * @returns An ISO string in local time
 */
export const isoStringToLocalTime = (isoString: string) => {
  try {
    const date = isoString ? new Date(isoString) : new Date();
    if (isNaN(date.getTime())) return '';
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  } catch (e) {
    return '';
  }
};

/**
 * Formats a date without a time preserving timezone.
 * @param dateInput - Input Date or date string
 * @returns A formatted ISO Date string (YYYY-MM-DD)
 */
export const formatLocalDate = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Gets the day from a given date string.
 * @param dateStr - The source ISO date string
 * @returns The day or TBD
 */
export const getDayFromDate = (dateStr?: string) => {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Computes the difference in time from the given date to now in a human-readable format.
 * @param dateString - A standard date string
 * @returns A formatted date string (e.g., '2 yrs', '5 mo', '< 1 mo') or 'New' if null
 */
export function getTimeDifferenceFromNow(dateString: string | null | undefined): string {
  if (!dateString) return 'New';

  const joined = new Date(dateString);
  if (isNaN(joined.getTime())) return 'New';

  const now = new Date();

  const months =
    (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth());

  if (months > 11) {
    const years = Math.floor(months / 12);
    return `${years} yr${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} mo`;
  } else {
    return '< 1 mo';
  }
}

type DateFormatPreset =
  | 'numeric'
  | 'short'
  | 'full'
  | 'monthYear'
  | 'longMonthYear'
  | 'dayMonth'
  | 'weekdayDayMonth';

const PRESETS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  numeric: { month: 'numeric', day: 'numeric', year: 'numeric' },
  short: { month: 'short', day: 'numeric' },
  dayMonth: { month: 'short', day: 'numeric' },
  full: { month: 'short', day: 'numeric', year: 'numeric' },
  monthYear: { month: 'short', year: 'numeric' },
  longMonthYear: { month: 'long', year: 'numeric' },
  weekdayDayMonth: { weekday: 'short', month: 'short', day: 'numeric' },
};

/**
 * Standardizes date formatting across the application.
 * @param date - Date string, Date object, or null/undefined
 * @param preset - The formatting style to use
 * @param fallback - String to return if date is missing/invalid
 * @returns The formatted local date string
 */
export function formatAppDate(
  date: string | Date | null | undefined,
  preset: DateFormatPreset = 'full',
  fallback: string = '—',
): string {
  if (!date) return fallback;

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return fallback;

  return d.toLocaleDateString('en-US', PRESETS[preset]);
}

type DateTimeFormatPreset =
  | 'short' // Oct 2, 2026, 6:23 AM
  | 'numeric' // 10/2/2026, 6:23 AM
  | 'timeOnly' // 6:23 AM
  | 'fullWithDay'; // Fri, Oct 2, 2026, 6:23 AM

const DATE_TIME_PRESETS: Record<DateTimeFormatPreset, Intl.DateTimeFormatOptions> = {
  short: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  },
  numeric: {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  },
  timeOnly: {
    hour: 'numeric',
    minute: '2-digit',
  },
  fullWithDay: {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  },
};

/**
 * Standardizes date and time formatting across the application.
 * @param date - Date string, Date object, or null/undefined
 * @param preset - The formatting style to use
 * @param fallback - String to return if date is missing/invalid
 * @returns The formatted local date and time string
 */
export function formatAppDateTime(
  date: string | Date | null | undefined,
  preset: DateTimeFormatPreset = 'short',
  fallback: string = '—',
): string {
  if (!date) return fallback;

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return fallback;

  return d.toLocaleString('en-US', DATE_TIME_PRESETS[preset]);
}

/**
 * Returns a time-of-day greeting (Good morning, Good afternoon, Good evening)
 * based on the current hour in a specific timezone or user's local timezone.
 * @param date - The date object
 * @param timeZone - The timezone
 * @returns The greeting (e.g., Good morning, Good afternoon, Good evening)
 */
export function getTimeGreeting(date: Date = new Date(), timeZone?: string): string {
  // Use Intl to extract hour in the target timezone accurately
  const hourStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone,
  }).format(date);

  const hour = parseInt(hourStr, 10);

  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Formats the current or given week range (e.g. "Oct 4–10" or "Oct 28–Nov 3")
 * @param date - The date object
 * @param timeZone - The timezone
 * @returns The week range string
 */
export function formatWeekRange(date: Date = new Date(), timeZone?: string): string {
  const targetDate = new Date(date);

  // Calculate start (Sunday) and end (Saturday) of current week
  const dayOfWeek = targetDate.getDay();
  const weekStart = new Date(targetDate);
  weekStart.setDate(targetDate.getDate() - dayOfWeek);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();

  const startMonth = weekStart.toLocaleString('default', { month: 'short', timeZone });
  const startDate = weekStart.getDate();
  const endDate = weekEnd.getDate();

  if (sameMonth) {
    return `${startMonth} ${startDate}–${endDate}`;
  }

  const endMonth = weekEnd.toLocaleString('default', { month: 'short', timeZone });
  return `${startMonth} ${startDate}–${endMonth} ${endDate}`;
}
