import { HowItWorksCard } from '@/components/home/HowItWorksCard';
import { SectionHeader } from '@/components/ui/section-header';

const HOW_IT_WORKS_DATA = [
  {
    id: 'producers',
    title: 'For Producers',
    imageSrc: '/images/for-producers.jpg',
    description:
      "Grow fresh produce on community or home land. Submit your harvest through the app, earn your share of each week's revenue, and access your own produce at no cost.",
  },
  {
    id: 'landowners',
    title: 'For Landowners',
    imageSrc: '/images/for-landowners.jpg',
    description:
      'Turn your unused yard, vacant lot, or church grounds into a neighborhood asset. List your space, set your terms, and earn a share of every harvest grown on your land.',
  },
  {
    id: 'businesses',
    title: 'For Local Businesses',
    imageSrc: '/images/for-local-businesses.jpg',
    description:
      'Order fresh, locally grown produce through our B2B marketplace. Reliable weekly supply, transparent sourcing, and a supply chain that strengthens the same community you serve.',
  },
];

/**
 * A structured grid section explaining specific roles for users.
 * Maps through HOW_IT_WORKS_DATA to render HowItWorksCards for Producers, Landowners, and Businesses.
 * @returns The "How It Works" step-by-step section.
 */
export default function HowItWorksSection() {
  return (
    <section className="relative bg-deep-forest py-25 overflow-hidden" id="how-it-works">
      {/* Top Right Decorative Radial Glow */}
      <div className="absolute -top-20 -right-20 w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(164,199,57,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="mb-15">
          <SectionHeader
            align="center"
            variant="inverted"
            eyebrow="How it works"
            title="Simple roles. Real rewards."
          />
        </div>

        {/* Mapped Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS_DATA.map((item) => (
            <HowItWorksCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageSrc={item.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
