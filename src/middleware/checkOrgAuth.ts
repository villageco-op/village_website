/**
 * Determines redirects for org pages.
 * @param _pathname - The url pathname
 * @param _isAuthenticated - Is the user authenticated
 * @param _subdomain - The subdomain
 * @returns The NextResponse redirect or passthrough
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function checkOrgAuth(
  _pathname: string,
  _isAuthenticated: boolean,
  _subdomain: string,
): Promise<string | null> {
  return null;
}
