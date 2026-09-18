'use client';

import { useTutorial } from '../providers/TutorialProvider';

import TutorialList from './TutorialList';

/**
 * The tutorial page with cards for starting the organization tutorials.
 * @returns The client page component
 */
export default function OrgTutorialClient() {
  const { tutorials } = useTutorial();

  return (
    <TutorialList
      title="Tutorials"
      tutorials={tutorials}
      descriptionText="Step-by-step guides on client & organization management."
      helpPath="/org/help/"
    />
  );
}
