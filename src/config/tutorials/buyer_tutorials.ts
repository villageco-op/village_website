import { type Tutorial, TutorialCategory } from './tutorials';

/**
 * Tutorial config object. Contains the full list of buyer tutorials.
 */
export const BUYER_TUTORIALS: Record<string, Tutorial> = {
  purchasing_produce: {
    id: 'purchasing_produce',
    title: 'Purchasing Produce',
    description: 'Learn how to browse fresh produce, customize your order, and complete checkout.',
    category: TutorialCategory.PURCHASING,
    steps: [
      {
        title: 'Browse Available Produce',
        content:
          'Start by exploring produce listings in your area using either the map or list view.',
        targetRoute: '/buyer/browse',
      },
      {
        title: 'View Listing Details',
        content:
          'Click on a produce item to view detailed information, harvest schedule, seller information, and customer reviews.',
      },
      {
        title: 'Configure Order & Quantity',
        content:
          'Click "Order Now" on the listing page to select your desired quantity in pounds and choose whether to make it a recurring subscription.',
      },
      {
        title: 'Add to Cart',
        content: 'Review your total and click "Add to Cart" to reserve your selected item.',
      },
      {
        title: 'Review Cart & Fulfillment',
        content:
          'Open your cart drawer to review items grouped by seller and select local delivery or pickup.',
      },
      {
        title: 'Complete Checkout',
        content:
          'Click "Checkout" on a seller group to proceed to payment and secure your fresh produce order.',
      },
    ],
  },
  edit_profile: {
    id: 'edit_profile',
    title: 'Edit Buyer Profile & Details',
    description: 'Learn how to update your avatar, display name, and delivery address.',
    category: TutorialCategory.ACCOUNT_PROFILE,
    steps: [
      {
        title: 'Access Profile Settings',
        content:
          'Click your profile name or avatar at the top of the sidebar to navigate directly to the Edit Profile page.',
        targetRoute: '/settings',
      },
      {
        title: 'Basic Information & Avatar',
        content:
          'Update your avatar photo, display name, and street address. An accurate address ensures local delivery options and nearby produce calculations work correctly.',
        targetRoute: '/settings',
      },
      {
        title: 'Save Profile Changes',
        content: 'Click "Save Changes" at the bottom to update your account details.',
        targetRoute: '/settings',
      },
    ],
  },
};
