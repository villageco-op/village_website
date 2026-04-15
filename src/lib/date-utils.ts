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
export const toLocalString = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};
