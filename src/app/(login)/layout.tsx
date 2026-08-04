import { Footer } from '@/components/layout/Footer';

/**
 * Layout for the login/onboarding pages.
 * @param props - Component props
 * @param props.children - Inject child elements into the body.
 * @returns HTML with children and page body.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
