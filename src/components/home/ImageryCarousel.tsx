'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import Image from 'next/image';
import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const IMAGES = Array.from({ length: 6 }, (_, i) => `/images/home-carousel/local-food-${i}.jpg`);

/**
 * Props extending HTMLElement attributes for the carousel.
 */
export interface ImageryCarouselProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * A full-width, auto-scrolling image carousel designed for showcasing local food imagery.
 * * This component utilizes Embla Carousel with an auto-scroll plugin and features
 * a linear-gradient mask for a smooth "fade-out" edge effect.
 *
 * @param props - The properties for the carousel.
 * @param props.className - Optional CSS classes to merge into the root section element.
 * @param props... - Any additional HTML attributes applied to the root <section>.
 * @returns A horizontal scrolling section with masked edges.
 */
export function ImageryCarousel({ className, ...props }: ImageryCarouselProps) {
  const autoScrollPlugin = React.useRef(
    AutoScroll({
      playOnInit: true,
      speed: 2,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      startDelay: 0.1,
    }),
  );

  return (
    <section className={cn('w-full py-12 md:py-16', className)} {...props}>
      <div
        className="container-custom overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <Carousel
          opts={{
            loop: true,
            align: 'start',
            dragFree: true,
          }}
          plugins={[autoScrollPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {IMAGES.map((src, index) => (
              <CarouselItem key={index} className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4">
                <div
                  className={cn(
                    'group relative aspect-square w-full overflow-hidden rounded-[10px]',
                    'bg-deep-forest cursor-grab active:cursor-grabbing',
                  )}
                >
                  <Image
                    src={src}
                    alt={`Local food display ${index}`}
                    fill
                    sizes="(max-width: 600px) 200px, 280px"
                    className="object-cover object-center transition-transform duration-400 ease-out group-hover:scale-105"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
