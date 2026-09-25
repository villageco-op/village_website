import { type Tutorial, TutorialCategory } from './tutorials';

/**
 * Tutorial config object. Contains the full list of seller tutorials.
 */
export const SELLER_TUTORIALS: Record<string, Tutorial> = {
  create_listing: {
    id: 'create_listing',
    title: 'Create a Produce Listing',
    description: 'Learn how to publish a new produce item to the marketplace.',
    category: TutorialCategory.LISTING_LIFECYCLE,
    steps: [
      {
        title: 'Navigate to Create Listing Page',
        content: 'Start by accessing the seller dashboard and clicking on "Create New Listing".',
        targetRoute: '/seller/new-listing',
      },
      {
        title: 'Upload Listing Images',
        content:
          'Upload high-quality images of your produce item to help buyers see what they are ordering.',
        targetRoute: '/seller/new-listing',
      },
      {
        title: 'Basic Information & Description',
        content:
          'Set a descriptive title, select the produce type, and optionally write details about flavor profiles or growing practices.',
        targetRoute: '/seller/new-listing',
      },
      {
        title: 'Pricing & Inventory',
        content:
          'Specify your price per pound, total available pounds, and optional max order limits per customer.',
        targetRoute: '/seller/new-listing',
      },
      {
        title: 'Harvest & Availability',
        content:
          'Configure your harvest frequency, season date range, available date, and allow recurring subscription orders.',
        targetRoute: '/seller/new-listing',
      },
      {
        title: 'Publish Listing',
        content:
          'Once all required fields are filled, click "Publish Listing" to make it live for marketplace buyers.',
        targetRoute: '/seller/new-listing',
      },
    ],
  },
  edit_profile: {
    id: 'edit_profile',
    title: 'Edit Seller Profile & Details',
    description: 'Learn how to update your profile photo, real name, address, and seller details.',
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
          'Update your avatar photo, display name, and street address. Accurate address information ensures geocoding works correctly for nearby buyers.',
        targetRoute: '/settings',
      },
      {
        title: 'Seller Details & Bio',
        content:
          'Fill out your "About You" bio and add specialties separated by commas (e.g., Heirloom Tomatoes, Microgreens).',
        targetRoute: '/settings',
      },
      {
        title: 'Weekly Goal & Delivery Settings',
        content:
          'Set a weekly revenue goal and specify whether you deliver orders directly, along with your maximum delivery radius in miles.',
        targetRoute: '/settings',
      },
      {
        title: 'Save Profile Changes',
        content:
          'Click "Save Changes" at the bottom to update your public details across the marketplace.',
        targetRoute: '/settings',
      },
    ],
  },
  view_public_profile: {
    id: 'view_public_profile',
    title: 'View Your Public Profile',
    description: 'See how your seller page appears to customers on the marketplace.',
    category: TutorialCategory.ACCOUNT_PROFILE,
    steps: [
      {
        title: 'Open Public Profile',
        content:
          'Click the "Public Profile" button at the top of the sidebar or the "View Public Profile" button inside the Edit Profile tab.',
        targetRoute: '/settings',
      },
      {
        title: 'About Tab',
        content:
          'The "About" tab shows your bio, seller statistics, specialties, delivery range, and quick-order options.',
      },
      {
        title: 'Listings Tab',
        content: 'The "Listings" tab showcases all your active produce listings.',
      },
      {
        title: 'Reviews Tab',
        content:
          'The "Reviews" tab displays customer feedback, ratings, and testimonials from past orders.',
      },
    ],
  },
};
