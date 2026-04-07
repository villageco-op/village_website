import { PlatformDiagram } from '@/components/home/PlatformDiagram';
import { SectionHeader } from '@/components/ui/section-header';

/**
 * A visual section highlighting the roles within the Village ecosystem.
 * Centers the PlatformDiagram component within decorative background circles.
 * @returns The "Community" section featuring the role diagram.
 */
export default function PlatformDiagramSection() {
  return (
    <section className="relative bg-cream py-25 overflow-hidden" id="community">
      {/* Decorative Background Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full border border-deep-forest/[0.07] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-250 rounded-full border border-deep-forest/4 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <SectionHeader
          className="text-center items-center max-w-135 mx-auto mb-12 sm:mb-16"
          eyebrow="The platform"
          title="Everyone has a role. Everyone benefits."
          description="Village is the connective tissue of a hyper-local food economy. Every role contributes to the system — and every role earns a share of what it produces."
        />

        {/* Diagram Component */}
        <div className="w-full max-w-240 mx-auto">
          <PlatformDiagram />
        </div>
      </div>
    </section>
  );
}
