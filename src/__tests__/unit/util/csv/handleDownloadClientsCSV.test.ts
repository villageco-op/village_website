import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { ClientResponse } from '@/lib/api/generated/models';
import { handleDownloadClientsCSV } from '@/lib/csv-utils';

describe('handleDownloadClientsCSV', () => {
  const MOCK_DATE = '2026-04-14';

  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${MOCK_DATE}T12:00:00Z`));

    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    mockLink = {
      href: '',
      download: '',
      style: { visibility: '' },
      setAttribute: vi.fn().mockImplementation((key: string, val: string) => {
        (mockLink as any)[key] = val;
      }),
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create an anchor link, set expected download attributes, and trigger click', () => {
    const mockClients: ClientResponse[] = [
      {
        id: 'fake-id-000-1111',
        active: true,
        organizationId: 'org-1234',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        referralCount: 2,
        createdById: 'created-by-1234',
        referredBy: undefined as any,
        updatedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    handleDownloadClientsCSV(mockClients);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe(`organization_clients_${MOCK_DATE}.csv`);
    expect(mockLink.href).toBe('blob:mock-url');
    expect(mockLink.style.visibility).toBe('hidden');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalledOnce();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });

  it('should safely handle empty/missing properties with fallbacks', () => {
    const mockClients: ClientResponse[] = [
      {
        id: undefined as any,
        active: undefined as any,
        organizationId: undefined as any,
        name: undefined as any,
        email: undefined as any,
        phone: undefined as any,
        address: undefined as any,
        city: undefined as any,
        state: undefined as any,
        zip: undefined as any,
        country: undefined as any,
        referralCount: undefined,
        createdAt: undefined as any,
        updatedAt: undefined as any,
        createdById: undefined as any,
        referredBy: undefined as any,
      },
    ];

    handleDownloadClientsCSV(mockClients);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe(`organization_clients_${MOCK_DATE}.csv`);
    expect(mockLink.href).toBe('blob:mock-url');
    expect(mockLink.style.visibility).toBe('hidden');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalledOnce();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });
});
