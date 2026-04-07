import { ImageryCarousel } from '../ImageryCarousel';

import { SectionHeader } from '@/components/ui/section-header';

/**
 * A minimalist display section featuring the auto-scrolling image carousel.
 * Used to provide visual texture and showcase local food imagery.
 * @returns The "Carousel" section.
 */
export default function ImageCarouselSection() {
  return (
    <section className="relative bg-forest-dark py-25 overflow-hidden" id="carousel">
      <div className="container-custom relative z-10">
        <SectionHeader align="center" variant="inverted" title="Local Food for Local People." />

        <div className="w-full mx-auto">
          <ImageryCarousel />
        </div>
      </div>
    </section>
  );
}
