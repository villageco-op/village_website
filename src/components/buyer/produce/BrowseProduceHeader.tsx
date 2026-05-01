'use client';

/**
 * The header for the browse produce page.
 * @returns A bold header with a subtitle
 */
export function BrowseProduceHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-heading text-2xl font-bold text-ink">Browse Produce</h1>
      <p className="font-sans text-sm text-ink-3">
        Fresh listings from nearby growers · Updated daily
      </p>
    </div>
  );
}
