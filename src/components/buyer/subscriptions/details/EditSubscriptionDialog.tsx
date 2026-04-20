'use client';

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface EditSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantityOz: number, fulfillmentType: string) => Promise<void>;
  isPending: boolean;
  currentQuantity: number;
  currentFulfillment: string;
  pricePerOz: number;
}

/**
 * A dialog component for for editing a subscription.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.onClose - Called when closed
 * @param props.onConfirm - Called when confirmed
 * @param props.isPending - Is the cancel pending
 * @param props.currentQuantity - The current subscription quantity
 * @param props.currentFulfillment - The current subscription fulfillment type
 * @param props.pricePerOz - The price per ounce of the product
 * @returns A dialog with an input for quanitity and fulfilment type
 */
export function EditSubscriptionDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  currentQuantity,
  currentFulfillment,
  pricePerOz,
}: EditSubscriptionDialogProps) {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [fulfillment, setFulfillment] = useState(currentFulfillment);

  const handleConfirm = async () => {
    if (quantity <= 0) return;
    await onConfirm(quantity, fulfillment);
  };

  const nextTotal = (quantity * pricePerOz).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-deep-forest">
            Edit Subscription
          </DialogTitle>
          <DialogDescription>Adjust your recurring order details.</DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-4">
          <div className="rounded-lg bg-clay/10 p-3 text-sm text-clay flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              <strong>Note:</strong> Changes to the amount and fulfillment type will only go into
              effect starting your <strong>following billing cycle</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-semibold text-ink">
              Quantity (oz)
            </label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isPending}
            />
            <p className="text-xs text-ink-3">
              Estimated next cycle cost: <span className="font-bold text-ink">${nextTotal}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="fulfillment" className="text-sm font-semibold text-ink">
              Fulfillment Type
            </label>
            <select
              id="fulfillment"
              value={fulfillment}
              onChange={(e) => setFulfillment(e.target.value)}
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="forest"
            onClick={() => void handleConfirm()}
            disabled={isPending || quantity <= 0}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
