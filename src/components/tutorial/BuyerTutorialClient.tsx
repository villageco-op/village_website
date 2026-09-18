'use client';

import TutorialList from './TutorialList';

import { BUYER_TUTORIALS } from '@/config/tutorials/buyer_tutorials';

/**
 * The tutorial page with cards for starting the buyer tutorials.
 * @returns The client page component
 */
export default function BuyerTutorialClient() {
  return (
    <TutorialList
      title="Buyer Tutorials"
      tutorials={BUYER_TUTORIALS}
      descriptionText="Step-by-step guides for browsing produce, placing orders, managing your cart, and updating account details."
      helpPath="/buyer/help"
    />
  );
}
