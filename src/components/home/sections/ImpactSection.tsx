import { CheckListItem } from '@/components/home/CheckListItem';
import { ImpactCard } from '@/components/home/ImpactCard';
import { SectionHeader } from '@/components/ui/section-header';

/**
 * A high-contrast section detailing the economic and social value loop.
 * Displays a list of benefits using CheckListItems and a grid of ImpactCards.
 * @returns The "Impact" section with the community treasury overview.
 */
export default function ImpactSection() {
  return (
    <section className="relative bg-deep-forest py-25 overflow-hidden" id="impact">
      {/* Decorative Radial Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none bg-[radial-gradient(ellipse_at_100%_50%,rgba(74,119,41,0.18)_0%,transparent_70%)]" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionHeader
              variant="inverted"
              eyebrow="The value loop"
              title="Profit that stays in the neighborhood."
              description="Village isn't just a marketplace — it's a system designed to lock value inside the community. A portion of every transaction flows into a Community Treasury, governed by residents, and reinvested into the neighborhood infrastructure that makes the whole system stronger."
              className="mb-8"
            />
            <ul className="flex flex-col gap-5 list-none m-0 p-0">
              <CheckListItem variant="impact">
                Vacant land becomes productive, income-generating space
              </CheckListItem>
              <CheckListItem variant="impact">
                Revenue reinvested into community gardens and storage
              </CheckListItem>
              <CheckListItem variant="impact">
                Families get healthier food and supplemental income
              </CheckListItem>
              <CheckListItem variant="impact">
                Over time, communities gain the power to buy back their city
              </CheckListItem>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            <ImpactCard icon="🌱" text="Vacant lots turned into working community gardens" />
            <ImpactCard icon="💵" text="Income earned and kept circulating in the community" />
            <ImpactCard icon="🥗" text="Families with better access to fresh, affordable food" />
            <ImpactCard icon="🏛️" text="Community treasury reinvested into neighborhood assets" />
          </div>
        </div>
      </div>
    </section>
  );
}
