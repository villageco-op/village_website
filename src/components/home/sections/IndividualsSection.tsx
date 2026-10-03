import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface IndividualsSectionProps {
  id?: string;
}

interface RoleCard {
  id: string;
  title: string;
  description: string;
  isAvailable: boolean;
  actionText?: string;
  actionHref?: string;
}

const ROLES: RoleCard[] = [
  {
    id: 'buyer',
    title: 'Buyer',
    description:
      'Stimulate the local economy by buying fresh produce directly from local growers and neighbors.',
    isAvailable: true,
    actionText: 'Browse Produce',
    actionHref: '/buyer/browse',
  },
  {
    id: 'seller',
    title: 'Seller',
    description:
      'Turn your harvest into revenue with online orders, subscriptions, and mobile tap-to-pay (coming soon).',
    isAvailable: true,
    actionText: 'Start Selling',
    actionHref: '/login',
  },
  {
    id: 'grower',
    title: 'Grower',
    description:
      'Manage growth cycles, track yield projections, and streamline daily crop maintenance tasks for any scale.',
    isAvailable: false,
  },
  {
    id: 'storage',
    title: 'Storage',
    description:
      'Track inventory for fresh, frozen, and non-perishable food products, seeds, and materials. Efficiently add items with mobile QR and Barcode scanning.',
    isAvailable: false,
  },
  {
    id: 'transporter',
    title: 'Transporter',
    description:
      'Transport produce efficiently with route optimization and smart batching for farm pickups, surplus runs, or direct deliveries.',
    isAvailable: false,
  },
  {
    id: 'landowner',
    title: 'Landowner',
    description:
      'Optimize outdoor growing spaces, gain land insights, or share available land with community members to grow food.',
    isAvailable: false,
  },
];

/**
 * Section displaying roles in a horizontally scrollable list.
 * @param props - Component props
 * @param props.id - The section Id
 * @returns A section with role cards
 */
export function IndividualsSection({ id = 'individuals' }: IndividualsSectionProps) {
  return (
    <section id={id} className="bg-cream py-16 md:py-24 text-deep-forest overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-2 text-deep-forest">
            Choose Your Role
          </h2>
          <p className="mt-4 text-base sm:text-lg text-deep-forest/80 leading-relaxed">
            Choose any number of roles to unlock functionality tailored to your needs; from buying
            and selling to growing, storing, and transporting.
          </p>
        </div>
      </div>

      {/* Horizontally Scrollable Row */}
      <div className="w-full overflow-x-auto pb-8 pt-2 scrollbar-thin scrollbar-thumb-deep-forest/20 scrollbar-track-transparent">
        <div className="flex gap-6 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto min-w-max">
          {ROLES.map((role) => {
            return (
              <Card
                key={role.id}
                className={`w-75 sm:w-85 flex flex-col justify-between transition-colors snap-start ${
                  role.isAvailable
                    ? 'bg-off-white border-deep-forest/15'
                    : 'bg-off-white/50 border-deep-forest/10 opacity-80'
                }`}
              >
                <CardContent>
                  <div className="space-y-4">
                    {/* Title & Description */}
                    <div className="space-y-2 pt-2">
                      <h3 className="text-xl font-heading font-bold text-deep-forest">
                        {role.title}
                      </h3>
                      <p className="text-sm text-deep-forest/75 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action / Status */}
                  <div className="pt-6 mt-6 border-t border-deep-forest/10">
                    {role.isAvailable && role.actionText && role.actionHref ? (
                      <Button
                        variant="forest"
                        size="sm"
                        className="w-full h-10 font-semibold"
                        asChild
                      >
                        <Link href={role.actionHref}>
                          {role.actionText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <span className="block text-xs font-medium text-deep-forest/40 uppercase tracking-wider">
                        Not yet available
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
