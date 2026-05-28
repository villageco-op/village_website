import { describe, it, expect, vi, beforeEach } from 'vitest';

import { apiClient } from '@/lib/api/client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should prepend the base URL and send correct headers', async () => {
    const mockData = { id: 1, name: 'Test Item' };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await apiClient('/test-endpoint', { method: 'GET' });

    expect(fetch).toHaveBeenCalledWith(
      '/test-endpoint',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(result).toMatchObject({
      data: mockData,
      headers: undefined,
      status: undefined,
    });
  });

  it('should throw an error when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid Request' }),
    } as Response);

    await expect(apiClient('/fail', {})).rejects.toThrow('Invalid Request');
  });
});
