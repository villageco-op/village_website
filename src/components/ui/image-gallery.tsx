'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
}

export function ImageGallery({ images, title, className, imageClassName, width, height }: ImageGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Update the counter when the carousel moves
  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-slate-100 text-slate-400", className)}>
        No Image Available
      </div>
    );
  }

  return (
    <div className={cn("group relative w-full overflow-hidden bg-slate-100", className)}>
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0 items-start">
          {images.map((src, index) => (
            <CarouselItem key={index} className="relative basis-full pl-0 min-w-0">
              <Image
                src={src}
                alt={`${title} - image ${index + 1}`}
                width={width || 1200}
                height={height || 750}
                className={cn("object-contain w-full h-auto transition-transform duration-500 ease-in-out", imageClassName)}
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls: Only visible if multiple images exist */}
        {images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                onClick={() => api?.scrollPrev()}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                onClick={() => api?.scrollNext()}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-md px-2 py-1">
                {current} / {images.length}
              </Badge>
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
}
