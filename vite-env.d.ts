import '@tanstack/react-query';
import type { ApiError } from './src/lib/api/client';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}
