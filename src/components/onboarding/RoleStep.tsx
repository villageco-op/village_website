'use client';

import { Sprout, ShoppingBasket, Truck } from 'lucide-react';

/**
 * Props for the RoleStep component.
 */
export interface RoleStepProps {
  onSelectRole: (role: 'buyer' | 'seller') => void;
}

/**
 * A choice-based onboarding step where users select their primary interaction mode.
 * Displays interactive cards for 'Buyer' and 'Seller' roles.
 * @param props - Component properties.
 * @param props.onSelectRole - Callback triggered when a role button is clicked.
 * @returns A grid of selection cards and a "Coming Soon" section for deliverers.
 */
export default function RoleStep({ onSelectRole }: RoleStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-deep-forest">
          How do you want to get involved?
        </h2>
        <p className="font-sans text-ink-3 mt-2">
          You can always change this later. Sellers and Deliverers can buy produce too!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelectRole('buyer')}
          className="flex flex-col items-center justify-center p-6 bg-white border-2 border-transparent rounded-xl shadow-sm hover:border-lime hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-lime-pale text-click-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBasket className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ink">Buyer</h3>
          <p className="text-sm text-ink-3 mt-1 text-center">I want to buy fresh, local produce.</p>
        </button>

        <button
          onClick={() => onSelectRole('seller')}
          className="flex flex-col items-center justify-center p-6 bg-white border-2 border-transparent rounded-xl shadow-sm hover:border-lime hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-lime-pale text-click-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ink">Seller / Grower</h3>
          <p className="text-sm text-ink-3 mt-1 text-center">I want to list and sell my harvest.</p>
        </button>
      </div>

      <div className="p-6 bg-black/5 border border-dashed border-border/40 rounded-xl flex items-center gap-4 opacity-70">
        <div className="w-10 h-10 bg-border/20 text-ink-3 rounded-full flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-ink">Deliverer (Coming Soon)</h3>
          <p className="text-sm text-ink-3">Earn money delivering local goods to your neighbors.</p>
        </div>
      </div>
    </div>
  );
}
