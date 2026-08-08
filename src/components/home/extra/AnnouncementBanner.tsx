import { ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AnnouncementBannerProps {
  message?: string;
  targetId?: string;
  buttonText?: string;
}

/**
 * New feature/service announcement banner.
 * @param props - component props
 * @param props.message - The announcement banner
 * @param props.targetId - The component Id to navigate to
 * @param props.buttonText - The button text
 * @returns A banner with a message and button
 */
export function AnnouncementBanner({
  message = 'Food Pantry Referral Management is now available!',
  targetId = 'referral-management',
  buttonText = 'Learn More',
}: AnnouncementBannerProps) {
  return (
    <div className="bg-lime text-black py-2.5 px-4 sm:px-6 text-center text-md font-medium flex flex-wrap items-center justify-center gap-2 sm:gap-4 relative">
      <span>{message}</span>
      <Button asChild variant="forest" className="rounded-full font-semibold">
        <a href={`#${targetId}`}>
          {buttonText} <ArrowDown />
        </a>
      </Button>
    </div>
  );
}
