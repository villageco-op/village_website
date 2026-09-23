'use client';

import TutorialList from './TutorialList';

import { SELLER_TUTORIALS } from '@/config/tutorials/seller_tutorials';

/**
 * The tutorial page with cards for starting the seller tutorials.
 * @returns The client page component
 */
export default function SellerTutorialClient() {
  return (
    <TutorialList
      title="Seller Tutorials"
      tutorials={SELLER_TUTORIALS}
      descriptionText=""
      helpPath="/seller/help"
    />
  );
}
