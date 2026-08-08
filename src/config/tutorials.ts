/**
 * A single tutorial step.
 */
export interface TutorialStep {
  title: string;
  content: string;
  targetRoute: string;
}

/**
 * A tutorial containing an array of steps.
 */
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: TutorialCategory;
}

/**
 * Tutorial categories for organizing tutorials into sections.
 */
export enum TutorialCategory {
  CLIENTS = 'Client Management',
  ORGANIZATION = 'Organization & Members',
}

/**
 * Routes where the tutorial overlay will show.
 */
export const DISALLOWED_TUTORIAL_ROUTES = ['/onboarding', '/login', '/verify-invite'];

/**
 * Tutorial config object. Contains the full list of tutorials.
 */
export const TUTORIALS: Record<string, Tutorial> = {
  add_client: {
    id: 'add_client',
    title: 'Add a Client',
    description: 'Learn where and how to create a new client profile.',
    category: TutorialCategory.CLIENTS,
    steps: [
      {
        title: 'Navigate to The New Client Page',
        content:
          'Use this page to create a new client. Here you can fill in their information and add a referral.',
        targetRoute: '/org/new-client',
      },
      {
        title: 'Client Information',
        content:
          'The name is the only required information. You can add their email, phone number, and address if needed.',
        targetRoute: '/org/new-client',
      },
      {
        title: 'Referral',
        content:
          'Search for an existing client to use them as a referral. Enter their name, email or phone number. If they do not appear, you will need to add them as a client before they can be used as a referral.',
        targetRoute: '/org/new-client',
      },
      {
        title: 'Submit',
        content:
          'Once the information is complete, click "Add Client" to add them to your organization. You can edit their information later at any time.',
        targetRoute: '/org/new-client',
      },
    ],
  },
  export_print: {
    id: 'export_print',
    title: 'Download or Print Clients',
    description: 'Learn how you can download your clients as a CSV or print them to paper or PDF.',
    category: TutorialCategory.CLIENTS,
    steps: [
      {
        title: 'Go to Export Page',
        content: 'Start by visiting the Download & Print page.',
        targetRoute: '/org/export',
      },
      {
        title: 'Download CSV',
        content:
          'Use the "Download Spreadsheet" button to download all your clients as a CSV. It will create a table that can be used within Excel to share or manage your clients externaly.',
        targetRoute: '/org/export',
      },
      {
        title: 'Print',
        content:
          'Use the "Print / Save to PDF" button to print a table of your clients or save them to a PDF.',
        targetRoute: '/org/export',
      },
      {
        title: 'Preview Table',
        content:
          'The table at the bottom will populate once you select either the download or print button. It is what the printed pages and PDF will look like.',
        targetRoute: '/org/export',
      },
    ],
  },
  view_referrals: {
    id: 'view_referrals',
    title: 'View Client Referrals',
    description: 'View a clients used referrals and who they referred.',
    category: TutorialCategory.CLIENTS,
    steps: [
      {
        title: 'Locate the Client',
        content:
          'Find the client within the table. Use the search bar to narrow down the results. You can use their name, email, or phone number to search.',
        targetRoute: '/org/clients',
      },
      {
        title: 'Select the Client',
        content:
          'Select the client client you wish to view, in the main table, by clicking the row within the table.',
        targetRoute: '/org/clients',
      },
      {
        title: 'View Referrals',
        content:
          'With the client selected, click the "View Referrals" action button near the search bar, or click directly on the counter value (e.g. "0 of 4") in the client\'s row.',
        targetRoute: '/org/clients',
      },
    ],
  },
  edit_client: {
    id: 'edit_client',
    title: 'Edit Clients',
    description: 'Learn how to edit a clients name, email, phone number and address.',
    category: TutorialCategory.CLIENTS,
    steps: [
      {
        title: 'Locate the Client',
        content:
          'Find the client within the table. Use the search bar to narrow down the results. You can use their name, email, or phone number to search.',
        targetRoute: '/org/clients',
      },
      {
        title: 'Select the Client',
        content:
          'Select the client client you need to alter, in the main table, by clicking the row within the table.',
        targetRoute: '/org/clients',
      },
      {
        title: 'Launch Edit Form',
        content:
          'Once selected, the "Edit" action button in the toolbar highlights. Click it to open the edit client form.',
        targetRoute: '/org/clients',
      },
      {
        title: 'Confirm Changes',
        content:
          'Here you can edit the clients name, email, phone number, and address. Once ready, select "Save Changes".',
        targetRoute: '/org/clients',
      },
    ],
  },
  remove_client: {
    id: 'remove_client',
    title: 'Remove a Client',
    description: 'Learn how to remove a client from your organization.',
    category: TutorialCategory.CLIENTS,
    steps: [
      {
        title: 'Locate the Client',
        content:
          'Find the client within the table. Use the search bar to narrow down the results. You can use their name, email, or phone number to search.',
        targetRoute: '/org/clients',
      },
      {
        title: 'Select the Client',
        content:
          'Select the client client you need to alter, in the main table, by clicking the row within the table.',
        targetRoute: '/org/clients',
      },
      {
        title: 'Delete Client',
        content:
          'With the client selected, click the "Delete" action button. Your will be asked to confirm before deleting. Deleting a client is permanent. You can create a new client for them again but the referrals will reset.',
        targetRoute: '/org/clients',
      },
    ],
  },
  invite_members: {
    id: 'invite_members',
    title: 'Invite Team Members & Assign Roles',
    description: 'Invite members and manage permissions.',
    category: TutorialCategory.ORGANIZATION,
    steps: [
      {
        title: 'Review Active Team',
        content:
          'Go to the Organization Members table to see current active personnel and their respective roles.',
        targetRoute: '/org/members',
      },
      {
        title: 'Invite Page',
        content:
          'Click the "Invite New Member" action button in the top header section to navigate to the invite page.',
        targetRoute: '/org/invite',
      },
      {
        title: 'Configure Email & Permission Tier',
        content:
          'Enter the new teammate\'s email and select their role. Everyone can use the pages for viewing and editing clients. "Admin" lets them edit the organization and invite members. Click "Invite" to send an invite to their email.',
        targetRoute: '/org/invite',
      },
    ],
  },
  edit_organization: {
    id: 'edit_organization',
    title: 'Edit Your Organizations Information',
    description: 'Edit your organizations name, email, website, address and subdomain.',
    category: TutorialCategory.ORGANIZATION,
    steps: [
      {
        title: 'Navigate to Settings',
        content:
          'Go to the settings page by clicking your name at the top of the sidebar or the settings nav button.',
        targetRoute: '/settings',
      },
      {
        title: 'Select the Org Tab',
        content: 'Click the "Organization" button to open the organization settings.',
        targetRoute: '/settings',
      },
      {
        title: 'Edit Information',
        content:
          'Here you can edit your organizations avatar, name, email, website and subdomain. This is also where you can delete the organization (you will be asked for confirmation).',
        targetRoute: '/settings',
      },
    ],
  },
};
