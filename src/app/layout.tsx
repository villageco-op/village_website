import type { Metadata } from 'next';
import { Bricolage_Grotesque, Sora, Playfair_Display } from 'next/font/google';

import './globals.css';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartFab } from '@/components/cart/CartFab';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCartUI';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Village',
  description: 'In-Development Village Website',
  ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && {
    robots: {
      index: false,
      follow: false,
    },
  }),
};

/**
 * The root layout for the entire app.
 *
 * @param props - The component props.
 * @param props.children - Inject child elements into the body.
 * @returns HTML with children and page body.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${sora.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <CartProvider>
            <Header />
            {children}
            <CartFab />
            <CartDrawer />
          </CartProvider>
        </Providers>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
