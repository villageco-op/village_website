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
  LISTING_LIFECYCLE = 'Listing Lifecycle',
  ACCOUNT_PROFILE = 'Account & Public Profile',
}

/**
 * Routes where the tutorial overlay will show.
 */
export const DISALLOWED_TUTORIAL_ROUTES = ['/onboarding', '/login', '/verify-invite'];
