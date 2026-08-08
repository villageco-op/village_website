'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { AddressFormFields, type AddressValue } from '@/components/edit-profile/AddressFormFields';
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
import { Label } from '@/components/ui/label';
import type { ClientResponse, UpdateClientPayload } from '@/lib/api/generated/models';

interface EditClientModalProps {
  client: ClientResponse;
  onClose: () => void;
  onConfirm: (id: string, payload: UpdateClientPayload) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal for editing a client.
 * @param props - Component props
 * @param props.client - The client being edited
 * @param props.onClose - When the close button is clicked
 * @param props.onConfirm - When the confirm button is clicked
 * @param props.isSubmitting - Is the update submitting
 * @returns A dialog component
 */
export function EditClientModal({
  client,
  onClose,
  onConfirm,
  isSubmitting,
}: EditClientModalProps) {
  const [name, setName] = useState(client.name || '');
  const [email, setEmail] = useState(client.email || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [addressValue, setAddressValue] = useState<AddressValue>({
    address: client.address || '',
    city: client.city || '',
    state: client.state || '',
    zip: client.zip || '',
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    void onConfirm(client.id, {
      name,
      email: email || null,
      phone: phone || null,
      address: addressValue.address || null,
      city: addressValue.city || undefined,
      state: addressValue.state || undefined,
      zip: addressValue.zip || undefined,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-ink">
              Edit Client Profile
            </DialogTitle>
            <DialogDescription className="text-sm text-ink-3">
              Modify the contact information and address details for this client.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-ink-2 uppercase tracking-wide"
              >
                Full Name *
              </Label>
              <Input
                required
                id="name"
                placeholder="Client full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-ink-2 uppercase tracking-wide"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold text-ink-2 uppercase tracking-wide"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <AddressFormFields value={addressValue} onChange={setAddressValue} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="forest"
              disabled={isSubmitting || !name.trim()}
              className="h-9 text-sm flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
