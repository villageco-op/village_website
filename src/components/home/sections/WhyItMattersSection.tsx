import { CheckListItem } from '@/components/home/CheckListItem';
import { StatBlock } from '@/components/home/StatBlock';
import { GradientBar } from '@/components/ui/gradient-bar';
import { SectionHeader } from '@/components/ui/section-header';

/**
 * A description of the benfits of hyper-local produce and supporting statistics.
 * @returns The "Why" section of the homepage.
 */
export default function WhyItMattersSection() {
  return (
    <section className="bg-off-white py-25 relative overflow-hidden" id="why-it-matters">
      <GradientBar></GradientBar>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionHeader
              eyebrow="Why it matters"
              title="Communities like Gary have everything they need. Except a system."
              description="Post-industrial cities face a well-documented triple threat: food deserts, economic leakage, and thousands of acres of idle land. Village is designed specifically to reverse all three — not with charity, but with a self-sustaining local economy that puts residents in control."
              className="mb-7"
            />
            <ul className="flex flex-col gap-4 list-none m-0 p-0">
              <CheckListItem>Fresh produce accessible without a car or long commute</CheckListItem>
              <CheckListItem>Low-barrier supplemental income for local families</CheckListItem>
              <CheckListItem>Food dollars that circulate and multiply locally</CheckListItem>
              <CheckListItem>Vacant land converted into a visible community asset</CheckListItem>
            </ul>
          </div>

          <div className="flex flex-col gap-4.5">
            <StatBlock
              variant="default"
              value="38%"
              description="of Gary residents live in food desert conditions — limited or no grocery access within walking distance"
            />
            <StatBlock
              variant="sun"
              value="1,800+"
              description="vacant lots in Gary available to be transformed into productive community growing space"
            />
            <StatBlock
              variant="click-green"
              value="$0"
              description="cost to join Village as a resident producer — we provide the tools, training, and the platform"
            />
            <StatBlock
              variant="clay"
              value="Phase 1"
              description="Pilot launching Spring 2026 in Gary, IN — with a clear roadmap to replicate in every city"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
