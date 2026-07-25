interface AddressFields {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
}

/**
 * Formats address parts into a single comma-separated string.
 * @param address - The address parts
 * @returns A comma separate string of all the address parts
 */
export function formatAddress(address: AddressFields): string {
  const parts = [address.address, address.city, address.state, address.zip, address.country].filter(
    (part): part is string => Boolean(part && part.trim().length > 0),
  );

  return parts.length > 0 ? parts.join(', ') : '';
}
