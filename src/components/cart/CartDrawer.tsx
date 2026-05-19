'use client';

import { X, Leaf, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

import { CartGroupTimer } from './CartGroupTimer';
import { CartLineItem } from './CartLineItem';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useCartUI } from '@/hooks/useCartUI';
import {
  useGetCart,
  useRemoveFromCart,
  useUpdateCartItem,
  useUpdateCartGroup,
} from '@/lib/api/generated/cart/cart';
import { useCreateStripeSession } from '@/lib/api/generated/checkout/checkout';
import type { UpdateCartPayload, CartCheckoutGroup, CartSeller } from '@/lib/api/generated/models';
import { calculateGroupTotal } from '@/lib/cart-utils';
import { cn } from '@/lib/utils';

/**
 * A cart sidebar containing a buyer active cart.
 * @returns The drawer component
 */
export function CartDrawer() {
  const { isOpen, setIsOpen, closeCart } = useCartUI();

  const { data: cartResponse, refetch, isError: isGetCartError } = useGetCart();
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCartItem();
  const updateGroupMutation = useUpdateCartGroup();
  const checkoutMutation = useCreateStripeSession();

  if (isGetCartError || cartResponse?.status !== 200) {
    return null;
  }

  const cartGroups = cartResponse?.data?.data || [];
  const isEmpty = cartGroups.length === 0 || cartGroups.every((g) => g.items.length === 0);

  // Group checkouts by Seller Bucket
  const sellerBuckets = cartGroups.reduce(
    (acc, group) => {
      const sellerId = group.seller.id;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          seller: group.seller,
          groups: [],
        };
      }
      acc[sellerId].groups.push(group);
      return acc;
    },
    {} as Record<string, { seller: CartSeller; groups: CartCheckoutGroup[] }>,
  );

  const handleRemove = async (reservationId: string) => {
    try {
      await removeMutation.mutateAsync({ id: reservationId });
      toast.success('Item removed from cart');
      void refetch();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateItem = async (reservationId: string, updates: UpdateCartPayload) => {
    try {
      await updateMutation.mutateAsync({ id: reservationId, data: updates });
      void refetch();
    } catch (err) {
      toast.error('Failed to update cart item');
    }
  };

  const handleUpdateFulfillment = async (groupId: string, type: string) => {
    try {
      await updateGroupMutation.mutateAsync({
        id: groupId,
        data: { fulfillmentType: type as any },
      });
      void refetch();
    } catch (err) {
      toast.error('Failed to update fulfillment type');
    }
  };

  const handleCheckout = async (groupId: string) => {
    try {
      const res = await checkoutMutation.mutateAsync({
        data: { groupId },
      });

      if (res.status !== 200) {
        throw new Error('Checkout session did not return status 200.');
      }

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="z-1200 flex w-full max-w-full flex-col border-none bg-off-white p-0 shadow-[-8px_0_60px_rgba(0,0,0,0.18)] sm:max-w-130 [&>button.absolute]:hidden">
        <div className="flex shrink-0 items-center justify-between bg-deep-forest p-5 sm:px-6">
          <div>
            <SheetTitle className="font-heading text-[1.1rem] font-extrabold text-cream">
              🛒 Your Cart
            </SheetTitle>
            <SheetDescription className="mt-0.5 font-sans text-[0.74rem] text-cream/55">
              Items are checked out by farm and subscription schedule
            </SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={closeCart}
            className="h-8.5 w-8.5 rounded-full bg-white/10 text-cream hover:bg-white/20 hover:text-white"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isEmpty ? (
            <div className="py-16 text-center text-ink-3">
              <Leaf className="mx-auto mb-3 h-12 w-12 opacity-80 text-lime" />
              <div className="mb-1 font-heading text-[0.9rem] font-bold text-ink-2">
                Your cart is empty
              </div>
              <div className="font-sans text-[0.78rem]">
                Browse produce and add items to get started
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {Object.values(sellerBuckets).map((bucket) => (
                <div key={bucket.seller.id} className="flex flex-col gap-4">
                  {/* Seller Bucket Header */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="font-heading text-lg font-bold text-deep-forest">
                      {bucket.seller.organization || bucket.seller.name || 'Unknown Farm'}
                    </span>
                  </div>

                  {/* Seller Checkout Groups */}
                  {bucket.groups.map((group) => {
                    const expirations = group.items.map((i) => new Date(i.expiresAt).getTime());
                    const closestExpiration = Math.min(...expirations);

                    const isCheckingOut =
                      checkoutMutation.isPending &&
                      checkoutMutation.variables?.data.groupId === group.groupId;

                    const isUpdatingGroup =
                      updateGroupMutation.isPending &&
                      updateGroupMutation.variables?.id === group.groupId;

                    const deliveryFeeNum = Number(group.deliveryFee || 0);

                    return (
                      <div
                        key={group.groupId}
                        className={cn(
                          'overflow-hidden rounded-[14px] border-[1.5px] bg-white',
                          group.isSubscription ? 'border-lime/40' : 'border-cream-dark',
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-between border-b p-3.5 sm:px-4.5',
                            group.isSubscription
                              ? 'border-lime/25 bg-lime/10'
                              : 'border-cream-dark bg-cream',
                          )}
                        >
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.06em]',
                              group.isSubscription
                                ? 'bg-lime/20 text-click-green'
                                : 'bg-deep-forest/10 text-deep-forest',
                            )}
                          >
                            {group.isSubscription
                              ? `Subscription (${group.frequencyDays} Days)`
                              : 'One-time order'}
                          </span>
                          <CartGroupTimer expiresAt={closestExpiration} />
                        </div>

                        <div>
                          {group.items.map((item) => (
                            <CartLineItem
                              key={item.reservationId}
                              item={item}
                              onRemove={(reservationId) => void handleRemove(reservationId)}
                              onUpdate={(reservationId, updates) =>
                                void handleUpdateItem(reservationId, updates)
                              }
                              isPending={removeMutation.isPending}
                              isUpdating={
                                updateMutation.isPending &&
                                updateMutation.variables?.id === item.reservationId
                              }
                            />
                          ))}
                        </div>

                        <div
                          className={cn(
                            'flex items-center gap-2 border-t border-cream-dark bg-off-white/50 px-3.5 py-3 sm:px-4.5 transition-opacity',
                            isUpdatingGroup && 'pointer-events-none opacity-50',
                          )}
                        >
                          <Checkbox
                            id={`delivery-${group.groupId}`}
                            checked={group.fulfillmentType === 'delivery'}
                            onCheckedChange={(checked) =>
                              void handleUpdateFulfillment(
                                group.groupId,
                                checked ? 'delivery' : 'pickup',
                              )
                            }
                            className="border-cream-dark data-[state=checked]:bg-deep-forest data-[state=checked]:text-white"
                          />
                          <Label
                            htmlFor={`delivery-${group.groupId}`}
                            className="cursor-pointer font-sans text-[0.75rem] text-ink-2 hover:text-ink"
                          >
                            Add local delivery
                            {deliveryFeeNum > 0 && (
                              <span className="font-medium text-ink-3">
                                {' '}
                                (+${deliveryFeeNum.toFixed(2)} est. fee)
                              </span>
                            )}
                          </Label>
                        </div>

                        <div className="flex items-center justify-between border-t border-cream-dark bg-white p-3 sm:px-4.5">
                          <div>
                            <div className="font-heading text-[0.85rem] font-extrabold text-ink">
                              Subtotal: ${calculateGroupTotal(group.items)}
                            </div>
                            {group.fulfillmentType === 'delivery' &&
                              Number(group.deliveryFee) > 0 && (
                                <div className="mt-0.5 font-sans text-[0.7rem] text-ink-3">
                                  + ${group.deliveryFee} estimated delivery
                                </div>
                              )}
                          </div>
                          <Button
                            variant="lime"
                            size="sm"
                            className="font-heading font-bold"
                            onClick={() => void handleCheckout(group.groupId)}
                            disabled={checkoutMutation.isPending}
                          >
                            {isCheckingOut && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            Checkout →
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
