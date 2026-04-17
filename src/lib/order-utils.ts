/**
 * Formats a UUID or long ID into a readable short format (e.g., #AB12CD34).
 * @param id - The unique identifier string to be formatted.
 * @returns A string representing the first 8 characters of the ID, prefixed with '#'.
 */
export const formatOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

/**
 * Formats a numeric value into a USD currency string.
 * @param amount - The numeric or string-based amount to format.
 * @returns A string formatted as USD currency (e.g., "$10.00").
 */
export const formatCurrency = (amount: number | string) => `$${Number(amount || 0).toFixed(2)}`;

/**
 * Converts ounces (from API) to pounds for user display.
 * @param oz - The weight in ounces to be converted.
 * @returns The weight in pounds as a string, rounded to one decimal place (removes ".0" if whole).
 */
export const ozToLbs = (oz: number | string) => {
  const lbs = Number(oz || 0) / 16;
  return lbs.toFixed(1).replace(/\.0$/, '');
};

/**
 * Standardizes date formatting for order rows.
 * @param dateString - The ISO date string or null/undefined value.
 * @param options - Configuration options for the date format.
 * @returns A formatted date string in 'en-US' locale, or 'Pending' if no date is provided.
 */
export const formatOrderDate = (
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
) => {
  if (!dateString) return 'Pending';
  return new Date(dateString).toLocaleDateString('en-US', options);
};
