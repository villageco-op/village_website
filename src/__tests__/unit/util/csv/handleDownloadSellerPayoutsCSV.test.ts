import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { Payout } from '@/lib/api/generated/models';
import { handleDownloadSellerPayoutsCSV } from '@/lib/csv-utils';

describe('handleDownloadSellerPayoutsCSV', () => {
  const MOCK_DATE = '2026-04-14';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${MOCK_DATE}T12:00:00Z`));

    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should trigger download with correctly formatted data', () => {
    const mockLink = {
      href: '',
      download: '',
      style: { visibility: '' },
      setAttribute: vi.fn().mockImplementation((key, val) => {
        (mockLink as any)[key] = val; // Manually track attributes for easy testing
      }),
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    const createSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

    const mockPayouts: Payout[] = [
      {
        date: '2026-04-10T10:00:00Z',
        productName: 'Apples',
        quantityLbs: 50,
        buyerName: 'Market',
        amountDollars: 100.0,
      },
    ];

    handleDownloadSellerPayoutsCSV(mockPayouts);

    expect(createSpy).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe(`payout_history_${MOCK_DATE}.csv`);
    expect(mockLink.click).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});
