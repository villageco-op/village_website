import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/ui/image-gallery';
import { getAssetPath } from '@/lib/utils';

interface ReferralFeatureSectionProps {
  id?: string;
  images?: string[];
}

const DEFAULT_IMAGES = [
  getAssetPath('/images/clients-table.png'),
  getAssetPath('/images/client-referrals.png'),
  getAssetPath('/images/clients-export.png'),
];

/**
 * The section describing the client referral service.
 * @param props - Component props
 * @param props.id - The section Id
 * @param props.images - The feature images
 * @returns A section component
 */
export function ReferralFeatureSection({
  id = 'referral-management',
  images = DEFAULT_IMAGES,
}: ReferralFeatureSectionProps) {
  return (
    <section
      id={id}
      className="bg-cream py-16 md:py-24 px-8 sm:px-12 lg:px-20 text-deep-forest scroll-mt-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Description & Action */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight">
            Food Pantry Referral Management
          </h2>
          <p className="text-base sm:text-lg text-deep-forest/80 leading-relaxed">
            Track your clients referrals online with ease. We offer direct support and tutorials.
            Print or download all your client data and referrals anytime.
          </p>
          <div className="pt-2">
            <Button variant="forest" size="lg" className="px-16 h-12" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Image Gallery */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl overflow-hidden border border-deep-forest/10 shadow-2xl">
            <ImageGallery
              imageClassName="object-contain"
              images={images}
              title="Food Pantry Client Referral Management Preview"
              width={1200}
              height={750}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
