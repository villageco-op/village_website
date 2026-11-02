'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

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
    title: 'Shop',
    description:
      'Stimulate the local economy by buying fresh produce directly from local growers and neighbors.',
    isAvailable: true,
    actionText: 'Browse',
    actionHref: '/buyer/browse',
  },
  {
    id: 'seller',
    title: 'Sell',
    description:
      'Turn your harvest into revenue with online orders, subscriptions, and mobile tap-to-pay (coming soon).',
    isAvailable: true,
    actionText: 'Start Selling',
    actionHref: '/login',
  },
  {
    id: 'grower',
    title: 'Grow',
    description:
      'Manage growth cycles, track yield projections, and streamline daily crop maintenance tasks for any scale.',
    isAvailable: false,
  },
  {
    id: 'storage',
    title: 'Store',
    description:
      'Track inventory for fresh, frozen, and non-perishable food products, seeds, and materials. Efficiently add items with mobile QR and Barcode scanning.',
    isAvailable: false,
  },
  {
    id: 'transporter',
    title: 'Transport',
    description:
      'Transport produce efficiently with route optimization and smart batching for farm pickups, surplus runs, or direct deliveries.',
    isAvailable: false,
  },
  {
    id: 'landowner',
    title: 'Land Share',
    description:
      'Optimize outdoor growing spaces, gain land insights, or share available land with community members to grow food.',
    isAvailable: false,
  },
];

/**
 * Section displaying roles in a vertically stacked list with expandable inactive roles.
 * @param props - Compoent props
 * @param props.id - The section Id
 * @returns A section with role list items
 */
export function IndividualsSection({ id = 'individuals' }: IndividualsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const availableRoles = ROLES.filter((role) => role.isAvailable);
  const unavailableRoles = ROLES.filter((role) => !role.isAvailable);

  return (
    <section id={id} className="bg-cream py-16 md:py-24 text-deep-forest">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-2 text-deep-forest">
            Choose Your Role
          </h2>
          <p className="mt-4 text-base sm:text-lg text-deep-forest/80 leading-relaxed">
            Choose any number of roles to unlock functionality tailored to your needs; from buying
            and selling to growing, storing, and transporting.
          </p>
        </div>

        <div className="divide-y divide-deep-forest/15 border-y border-deep-forest/15">
          {/* Always Available Roles */}
          {availableRoles.map((role) => (
            <RoleRow key={role.id} role={role} />
          ))}

          {isExpanded && unavailableRoles.map((role) => <RoleRow key={role.id} role={role} />)}
        </div>

        {unavailableRoles.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="group flex items-center gap-2 text-sm font-semibold text-deep-forest/80 hover:text-deep-forest transition-colors"
            >
              <span>{isExpanded ? 'See less roles' : 'See more roles'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function RoleRow({ role }: { role: (typeof ROLES)[number] }) {
  return (
    <div
      className={`py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-8 ${
        !role.isAvailable ? 'opacity-70' : ''
      }`}
    >
      <div className="space-y-1 max-w-2xl">
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-deep-forest">
          {role.title}
        </h3>
        <p className="text-sm sm:text-base text-deep-forest/75 leading-relaxed">
          {role.description}
        </p>
      </div>

      <div className="shrink-0 sm:self-center">
        {role.isAvailable && role.actionText && role.actionHref ? (
          <Button
            variant="forest"
            size="sm"
            className="w-full sm:w-auto h-10 font-semibold px-6"
            asChild
          >
            <Link href={role.actionHref}>
              {role.actionText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        ) : (
          <span className="inline-block text-xs font-medium text-deep-forest/50 uppercase tracking-wider">
            Not yet available
          </span>
        )}
      </div>
    </div>
  );
}
