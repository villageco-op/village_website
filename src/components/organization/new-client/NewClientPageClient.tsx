'use client';

import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { AddressFormFields, type AddressValue } from '@/components/edit-profile/AddressFormFields';
import { ReferralSelector } from '@/components/organization/new-client/ReferralSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClient } from '@/lib/api/generated/clients/clients';
import type { Referrer } from '@/lib/api/generated/models';

/**
 * Page component for registering a new client in the system.
 * @returns The client component
 */
export default function NewClientPageClient() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressValue, setAddressValue] = useState<AddressValue>({
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null);

  const { mutateAsync: createClient, isPending: isSubmitting } = useCreateClient();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const response = await createClient({
        data: {
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: addressValue.address.trim() || undefined,
          city: addressValue.city.trim() || undefined,
          state: addressValue.state.trim() || undefined,
          zip: addressValue.zip.trim() || undefined,
          referrerId: selectedReferrer?.id || undefined,
        },
      });

      if (response.status === 201) {
        toast.success('Client registered successfully.');
        router.push('/org/clients');
      }
    } catch (error) {
      toast.error('An error occurred while registering the client.');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6 px-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold text-ink">Add New Client</h1>
          <p className="text-sm text-ink-3">Add a new client to your organization.</p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Core Profile Fields */}
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-ink-2 uppercase tracking-wide"
              >
                Full Name *
              </Label>
              <Input
                id="name"
                required
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="h-9.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className="h-9.5 text-sm"
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
                  className="h-9.5 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardContent>
            <AddressFormFields value={addressValue} onChange={setAddressValue} />
          </CardContent>
        </Card>

        {/* Referrer Search Selector */}
        <ReferralSelector selectedReferrer={selectedReferrer} onSelect={setSelectedReferrer} />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/clients')}
            disabled={isSubmitting}
            className="h-10 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="forest"
            disabled={isSubmitting || !name.trim()}
            className="h-10 text-sm flex items-center gap-1.5 px-5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Client...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Client
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
