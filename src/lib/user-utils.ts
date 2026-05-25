import type { User } from './api/generated/models';

/**
 * Determines initials from a name.
 * @param name - User name
 * @returns An uppercase string containing initials
 */
export const getInitials = (name: string | null) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

/**
 * Determines if the user has the basic profile information setup.
 * @param user - The user object
 * @returns True if basic info is present
 */
export const hasCompletedOnboarding = (user?: User) => {
  if (!user) return false;
  return Boolean(user.name && user.address && user.city && user.state && user.country && user.zip);
};
