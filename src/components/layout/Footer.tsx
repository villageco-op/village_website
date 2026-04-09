import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse produce', href: '#' },
      { label: 'Become a producer', href: '#' },
      { label: 'List your land', href: '#' },
      { label: 'Restaurant buyers', href: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'How it works', href: '#' },
      { label: 'The value loop', href: '#' },
      { label: 'Our mission', href: '#' },
      { label: 'Partner with us', href: '#' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Talk to our team', href: '#' },
      { label: 'Get involved', href: '/login' },
      { label: 'Press & media', href: '#' },
      { label: 'Privacy policy', href: '#' },
    ],
  },
];

/**
 * The persistent site footer. Includes all the site links.
 * @returns The component html
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-dark pt-16 pb-8 border-t border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <Image
              src="/icons/logo-horizontal.png"
              alt="Village Logo"
              width={100}
              height={34}
              className="h-8.5 w-auto mb-3.5"
            />
            <p className="font-sans text-[0.82rem] text-cream/40 leading-[1.7] max-w-57.5">
              Fresh food and real economic opportunity for neighborhoods in Gary, Indiana and
              beyond.
            </p>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading text-[0.68rem] font-bold tracking-widest uppercase text-cream/30 mb-3.5">
                {section.title}
              </h4>
              <nav className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-sans text-[0.82rem] text-cream/50 py-1 hover:text-lime transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/5 pt-6 flex justify-between items-center flex-wrap gap-3">
          <div className="font-sans text-[0.75rem] text-cream/25">
            &copy; {currentYear} Village. All rights reserved.
          </div>
          <div className="font-heading text-[0.75rem] text-cream/25 flex items-center gap-1.25">
            <span>📍</span> Gary, Indiana
          </div>
        </div>
      </div>
    </footer>
  );
}
