'use client';

/**
 * Dashboard layout wrapper.
 * @param props - The component props.
 * @param props.children - Inject child elements into the body.
 * @returns HTML with children and page body.
 */
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="px-9 pt-6 pb-6">{children}</main>;
}
