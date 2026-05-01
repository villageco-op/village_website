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
 * Gets the day from a given date string.
 * @param dateStr - The source ISO date string
 * @returns The day or TBD
 */
export const getDayFromDate = (dateStr?: string) => {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
