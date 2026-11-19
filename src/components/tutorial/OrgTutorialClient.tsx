'use client';

import TutorialList from './TutorialList';

import { ORG_TUTORIALS } from '@/config/tutorials/org_tutorials';

/**
 * The tutorial page with cards for starting the organization tutorials.
 * @returns The client page component
 */
export default function OrgTutorialClient() {
  return (
    <TutorialList
      title="Tutorials"
      tutorials={ORG_TUTORIALS}
      descriptionText=""
      helpPath="/org/help/"
    />
  );
}
