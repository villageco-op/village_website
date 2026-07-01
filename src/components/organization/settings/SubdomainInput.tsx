'use client';

import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCheckSubdomain } from '@/lib/api/generated/organizations/organizations';

interface SubdomainInputProps {
  value: string;
  onChange: (value: string) => void;
  originalValue?: string;
  onValidityChange?: (isValid: boolean) => void;
  required?: boolean;
}

/**
 * Input component for setting an organizations subdomain. Checks for validity internally.
 * @param props - Component props
 * @param props.value - The current subdomain
 * @param props.onChange - When the subdomain is changed
 * @param props.originalValue - Pass the original subdomain if editing an existing org to bypass validation checks when unchanged
 * @param props.onValidityChange - Callback to pass the availability state up to the parent form validation
 * @param props.required - Is the subdomain required
 * @returns A input with error and validation messages
 */
export function SubdomainInput({
  value,
  onChange,
  originalValue = '',
  onValidityChange,
  required = false,
}: SubdomainInputProps) {
  const [debouncedSubdomain, setDebouncedSubdomain] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSubdomain(value);
    }, 400);
    return () => clearTimeout(handler);
  }, [value]);

  const isOriginalSubdomain = originalValue && value === originalValue;

  const { data: checkData, isFetching: isChecking } = useCheckSubdomain(
    { subdomain: debouncedSubdomain },
    {
      query: {
        enabled: debouncedSubdomain.length >= 3 && !isOriginalSubdomain,
      },
    },
  );

  const isSubdomainAvailable =
    isOriginalSubdomain ||
    (debouncedSubdomain.length >= 3 && checkData?.status === 200 && checkData?.data?.available);

  const suggestion = checkData?.status === 200 ? checkData?.data?.suggestion : undefined;

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(!!isSubdomainAvailable);
    }
  }, [isSubdomainAvailable, onValidityChange]);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    onChange(formatted);
  };

  const handleSuggestionClick = () => {
    if (suggestion) {
      onChange(suggestion);
      setDebouncedSubdomain(suggestion);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor="subdomain" className="text-ink-2 font-semibold text-sm">
        Custom Subdomain {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex rounded-md shadow-sm">
        <Input
          id="subdomain"
          placeholder="gary-pantry"
          className="bg-white border-lime/50 focus-visible:ring-click-green rounded-r-none h-9 text-right font-mono text-sm"
          value={value}
          onChange={handleSubdomainChange}
          required={required}
        />
        <span className="inline-flex min-w-max shrink-0 whitespace-nowrap items-center px-3 rounded-r-md border border-l-0 border-lime/50 bg-lime-pale text-ink-3 text-sm font-mono select-none">
          .villageco-op.com
        </span>
      </div>

      {/* Verification Status UI */}
      <div className="text-xs mt-1 min-h-5">
        {isChecking && (
          <div className="text-ink-3 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin text-click-green" /> Validating availability...
          </div>
        )}
        {!isChecking && value.length > 0 && value.length < 3 && (
          <div className="text-red-500">Subdomain must be at least 3 characters.</div>
        )}
        {!isChecking && debouncedSubdomain.length >= 3 && (
          <>
            {isSubdomainAvailable ? (
              <div className="text-green-600 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />{' '}
                {isOriginalSubdomain ? 'Current Subdomain' : 'Subdomain is available!'}
              </div>
            ) : (
              <div className="text-red-500 flex flex-wrap items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Taken.
                {suggestion && (
                  <button
                    type="button"
                    onClick={handleSuggestionClick}
                    className="font-bold text-click-green hover:underline ml-1"
                  >
                    &ldquo;{suggestion}&rdquo; is available.
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
