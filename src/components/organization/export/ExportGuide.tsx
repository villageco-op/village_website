'use client';

import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ClientResponse } from '@/lib/api/generated/models';
import { handleDownloadClientsCSV } from '@/lib/csv-utils';

interface ExportGuidesProps {
  clients: ClientResponse[];
  loading: boolean;
  onTriggerPrint: () => void;
}

/**
 * Cards with the download and print client buttons and explanations/guides.
 * @param props - Component props
 * @param props.clients - The clients
 * @param props.loading - Are the clients loading
 * @param props.onTriggerPrint - When the print button is clicked
 * @returns Two side by side cards
 */
export function ExportGuides({ clients, loading, onTriggerPrint }: ExportGuidesProps) {
  const isActionDisabled = loading;

  return (
    <div className="grid gap-6 md:grid-cols-2 print:hidden">
      {/* Spreadsheet Export Guide */}
      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-forest">
            <FileSpreadsheet className="h-5 w-5" />
            <CardTitle className="text-lg">Spreadsheet / Excel (CSV)</CardTitle>
          </div>
          <CardDescription className="pt-2">
            Best if you want to import client list records into software like Microsoft Excel, Apple
            Numbers, Google Sheets, or other database systems.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-ink-3 space-y-2">
            <p className="font-semibold text-ink">How it works:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Downloads a file ending in <code className="bg-muted px-1 rounded">.csv</code>
              </li>
              <li>Organized cleanly into columns (Name, Phone, Email, Address, etc.)</li>
            </ul>
          </div>
          <Button
            className="w-full mt-2"
            onClick={() => void handleDownloadClientsCSV(clients)}
            disabled={isActionDisabled}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Spreadsheet (.csv)
          </Button>
        </CardContent>
      </Card>

      {/* Paper or PDF Guide */}
      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-ink">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-lg">Print or Save as PDF</CardTitle>
          </div>
          <CardDescription className="pt-2">
            Best for creating standard physical paper records, holding in active binders, or
            archiving a digital PDF document copy offline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-ink-3 space-y-2">
            <p className="font-semibold text-ink">How it works:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Opens standard printer window; works directly with physical printers</li>
              <li>
                To save a digital document: choose{' '}
                <strong className="text-ink">"Save as PDF"</strong> in the printer destination
                options
              </li>
            </ul>
          </div>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={onTriggerPrint}
            disabled={isActionDisabled}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print / Save to PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
