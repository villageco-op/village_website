'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';

import { ExportClientTable } from './ExportClientTable';
import { ExportGuides } from './ExportGuide';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { InlineErrorState } from '@/components/ui/state-displays';
import { getClients } from '@/lib/api/generated/clients/clients';
import type { ClientResponse } from '@/lib/api/generated/models';

/**
 * Download and print clients page.
 * @returns A page component a download and print buttons and a clients table
 */
export default function ClientsExportClient() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAllClients = async (): Promise<ClientResponse[] | null> => {
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: 0 });

    abortControllerRef.current = new AbortController();

    const limit = 50;
    let currentPage = 1;
    let accumulated: ClientResponse[] = [];
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await getClients({
          page: currentPage,
          limit,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error('Failed to retrieve client data.');
        }

        const newClients = response.data.data || [];
        accumulated = [...accumulated, ...newClients];

        const totalRecords = response.data.meta?.total ?? accumulated.length;
        setProgress({ current: accumulated.length, total: totalRecords });

        const totalPages = response.data.meta?.totalPages ?? 1;
        if (currentPage >= totalPages || newClients.length === 0) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }

      setClients(accumulated);
      setHasFetched(true);

      return accumulated;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.info('Export canceled.');
        return null;
      }
      const msg = 'An error occurred while gathering client records.';
      toast.error(msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleStartExport = async (action: 'print' | 'export') => {
    if (!hasFetched) {
      setIsModalOpen(true);
      const fetched = await fetchAllClients();
      setIsModalOpen(false);
      if (!fetched) return;
    }

    if (action === 'print') {
      setIsModalOpen(false);
      setTimeout(() => {
        window.print();
      }, 300);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsModalOpen(false);
  };

  const percentComplete =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 space-y-8 print:p-0 print:m-0">
      {/* HEADER SECTION */}
      <div className="print:hidden">
        <PageHeader
          title="Export & Print Clients"
          subtitle="Prepare your organization's client list to move into external spreadsheets or to 
          print out physical paper backups."
        />
      </div>

      <ExportGuides
        clients={clients}
        loading={loading}
        onTriggerPrint={() => void handleStartExport('print')}
      />

      {/* TABLE DISPLAY - Shown inline for print stylesheet access */}
      <Card className="print:border-none print:shadow-none">
        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between print:bg-transparent print:px-0">
          <CardTitle className="print:text-2xl print:font-bold">Clients List</CardTitle>
          <div className="text-sm font-medium text-ink-3 print:hidden">
            {!hasFetched ? 'Data not loaded' : `Total: ${clients.length}`}
          </div>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <ExportClientTable clients={clients} hasFetched />
        </CardContent>
      </Card>

      {/* PROGRESS / PREVIEW DIALOG */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preparing Client Data</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {loading ? (
              <div className="space-y-2">
                <p className="text-sm text-ink-3">
                  Fetching records... ({progress.current} of {progress.total})
                </p>
                <Progress value={percentComplete} />
              </div>
            ) : error ? (
              <InlineErrorState
                title="Error loading clients"
                onRetry={() => void fetchAllClients()}
              />
            ) : (
              <p className="text-sm text-ink">Records compiled successfully!</p>
            )}
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PRINT-ONLY CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            /* Setting margin to 0 suppresses default browser header (title) and footer (URL) */
            margin: 0;
          }

          body {
            background-color: white !important;
            color: black !important;
            font-size: 9pt !important;
            /* Add margin/padding to body so content doesn't print against the paper edge */
            padding: 12mm !important;
            width: 100% !important;
          }

          header,
          nav,
          aside,
          footer,
          button,
          [role='dialog'],
          .print\\:hidden {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .max-w-5xl {
            max-width: 100% !important;
          }

          table {
            width: 100% !important;
            table-layout: auto !important;
            page-break-inside: auto;
          }

          th,
          td {
            word-break: break-word !important;
            white-space: normal !important;
            padding: 4px 6px !important;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  );
}
