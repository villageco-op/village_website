import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { Order } from '@/lib/api/generated/models/order';
import { handleDownloadBuyerInvoicesCSV } from '@/lib/csv-utils';

describe('handleDownloadBuyerInvoicesCSV', () => {
  const MOCK_DATE = '2026-04-17';

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

  it('should trigger download with correctly formatted buyer invoice data', () => {
    const mockLink = {
      href: '',
      download: '',
      style: { visibility: '' },
      setAttribute: vi.fn().mockImplementation((key, val) => {
        (mockLink as any)[key] = val;
      }),
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    const createSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

    const mockOrders: Order[] = [
      {
        id: 'ORD-123',
        scheduledTime: '2026-04-10T10:00:00Z',
        fulfillmentType: 'delivery',
        status: 'completed',
        totalAmount: '150.5',
        buyerId: 'b-1',
        sellerId: 's-1',
        paymentMethod: 'card',
        stripeReceiptUrl: 'https://stripe.com/receipt',
        cancelReason: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ORD-456',
        scheduledTime: '', // Testing the 'N/A' fallback
        fulfillmentType: 'pickup',
        status: 'canceled',
        totalAmount: '0',
        buyerId: 'b-1',
        sellerId: 's-1',
        paymentMethod: 'card',
        stripeReceiptUrl: 'https://stripe.com/receipt',
        cancelReason: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    handleDownloadBuyerInvoicesCSV(mockOrders);

    // Verify the element creation and removal
    expect(createSpy).toHaveBeenCalledWith('a');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    // Verify the file name naming convention
    expect(mockLink.download).toBe(`invoice_history_${MOCK_DATE}.csv`);

    // Verify the URL was attached
    expect(mockLink.href).toBe('blob:mock-url');

    // Verify the download trigger
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should return early and not trigger a download if there are no orders', () => {
    const createSpy = vi.spyOn(document, 'createElement');

    handleDownloadBuyerInvoicesCSV([]);

    expect(createSpy).not.toHaveBeenCalled();
  });
});
