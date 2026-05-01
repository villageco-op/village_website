'use client';

import { Store, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import type { SellerMapGroup } from '@/lib/api/generated/models';

interface SellerProduceSidebarProps {
  group: SellerMapGroup;
  onClose: () => void;
  onOrderItem: (id: string) => void;
  onGrowerClick: (id: string) => void;
}

/**
 * Sidebar overlay component displaying produce for a selected grower.
 * @param props - The props for the produce sidebar
 * @param props.group - The seller group with produce
 * @param props.onClose - When the close button is pressed
 * @param props.onOrderItem - When the order button is pressed
 * @param props.onGrowerClick - When the seller name is clicked
 * @returns A floating right aligned sidebar
 */
export function SellerProduceSidebar({
  group,
  onClose,
  onOrderItem,
  onGrowerClick,
}: SellerProduceSidebarProps) {
  return (
    <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-forest-dark/10 z-40 flex flex-col animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between border-b border-border/50 p-4 bg-slate-50/80 backdrop-blur-sm">
        <button
          className="bg-transparent border-none cursor-pointer p-0 font-heading text-[1.05rem] font-bold text-deep-forest no-underline transition-colors hover:text-click-green hover:underline flex items-center"
          onClick={() => onGrowerClick(String(group.sellerId))}
          title="View Seller Profile"
        >
          <Store className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate max-w-45 text-left">{group.name}</span>
          <span className="ml-1 text-sm">↗</span>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full text-ink-3 hover:text-ink-1 hover:bg-slate-200/50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
        {group.produce.length === 0 ? (
          <div className="text-sm text-ink-4 italic text-center py-8">
            No active listings available.
          </div>
        ) : (
          group.produce.map((item) => (
            <div
              key={String(item.id)}
              className="flex flex-col gap-3 p-3 border border-border/60 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3 items-center">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-forest-dark/10 bg-slate-50">
                  {item.thumbnail ? (
                    <Image
                      src={String(item.thumbnail)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400 font-medium">
                      No Img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-1 truncate text-sm" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5 flex flex-col gap-0.5">
                    <span className="font-medium text-deep-forest">
                      ${(Number(item.price) * 16).toFixed(2)}/lb
                    </span>
                    <span>{(Number(item.availableInventory) / 16).toFixed(1)} lbs available</span>
                  </div>
                </div>
              </div>
              <Button
                variant="lime"
                size="sm"
                onClick={() => onOrderItem(String(item.id))}
                className="w-full font-semibold"
              >
                + Order
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
