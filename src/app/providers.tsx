'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

/**
 * Wrapper function for all providers. Contains QueryClientProvider from @tanstack/react-query.
 *
 * @param props - The component props.
 * @param props.children - Inject child page elements into the return HTML.
 * @returns HTML with providers.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
