import { describe, it, expect, vi } from 'vitest';

import { apiClient } from '@/lib/api/client';

vi.mock('@/config/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.example.com',
  },
}));

describe('API Client', () => {
  it('should_have_the_correct_base_url_from_env', () => {
    const configuredBaseURL = apiClient.defaults.baseURL;

    expect(configuredBaseURL).toBe('https://api.example.com');
  });

  it('should_be_initialized_with_axios', () => {
    expect(apiClient.get).toBeDefined();
    expect(apiClient.post).toBeDefined();
  });
});
