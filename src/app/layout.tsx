import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Village',
  description: 'In-Development Village Website',
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
