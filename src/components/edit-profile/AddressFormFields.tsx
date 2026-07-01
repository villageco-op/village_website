'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { US_STATES } from '@/lib/constants/location-constants';

/**
 * Object containing the address fields.
 */
export interface AddressValue {
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressFormFieldsProps {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  required?: boolean;
}

/**
 * Form for entering a complete address.
 * @param props - Component props
 * @param props.value - The current address
 * @param props.onChange - When any part of the address is changed
 * @param props.required - Is the address required
 * @returns A group of inputs
 */
export function AddressFormFields({ value, onChange, required = false }: AddressFormFieldsProps) {
  const updateField = (field: keyof AddressValue, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    updateField('zip', numericValue);
  };

  return (
    <div className="space-y-4">
      {/* Street Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-ink-2 font-semibold text-sm">
          Street Address {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="address"
          placeholder="e.g. 101 Civic Center Plaza"
          className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
          value={value.address}
          onChange={(e) => updateField('address', e.target.value)}
          required={required}
        />
      </div>

      {/* City / State / Zip Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-ink-2 font-semibold text-sm">
            City {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="city"
            placeholder="e.g. Gary"
            className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
            value={value.city}
            onChange={(e) => updateField('city', e.target.value)}
            required={required}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* State Select Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="state" className="text-ink-2 font-semibold text-sm">
              State {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value.state}
              onValueChange={(val) => updateField('state', val)}
              required={required}
            >
              <SelectTrigger
                id="state"
                className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
              >
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zip Code Input */}
          <div className="space-y-1.5">
            <Label htmlFor="zip" className="text-ink-2 font-semibold text-sm">
              ZIP Code {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="zip"
              placeholder="e.g. 46402"
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]*"
              className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
              value={value.zip}
              onChange={handleZipChange}
              required={required}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
