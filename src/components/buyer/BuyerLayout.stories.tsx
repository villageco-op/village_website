import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { BuyerSidebar } from '@/components/buyer/BuyerSidebar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartFab } from '@/components/cart/CartFab';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCartUI';
import type { User } from '@/lib/api/generated/models/user';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const mockUser: User = {
  id: 'buyer_123',
  name: 'County Fresh Mkt',
  organization: null,
  email: 'purchasing@countyfresh.com',
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=150&h=150&auto=format&fit=crop',
  aboutMe: 'A local market bringing fresh valley produce to Gary, IN.',
  deliveryRangeMiles: '0',
  specialties: [],
  goal: '90',
  stripeOnboardingComplete: false,
  isOnboardingComplete: true,
  address: '456 Market Ave',
  city: 'Gary',
  lat: 41.59,
  lng: -87.34,
  state: 'IN',
  country: 'United States',
  zip: '92921',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

function MockFullDashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-off-white antialiased text-slate-900">
      {/* 1. Header (which now includes your ReservationBanner internally) */}
      <Header />

      {/* 2. Main content block imitating BuyerLayout's structure */}
      <div className="flex min-h-[calc(100vh-64px)] w-full bg-off-white">
        <BuyerSidebar user={mockUser} />

        <main className="flex-1 px-9 py-8">
          {children || (
            <div className="space-y-6">
              <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Buyer Dashboard Marketplace
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  This is where your child router views render. Scroll down the page or interact
                  with the sidebar to verify the sticky alignment mechanics against the Header and
                  Footer.
                </p>
              </div>
              <div className="py-120" />
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                This is the bottom of the dashboard component. The footer should now scroll into
                view.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 3. Global Overlays & Modals */}
      <CartFab />
      <CartDrawer />
      <Toaster />

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
}

const meta: Meta<typeof MockFullDashboardLayout> = {
  title: 'Layout/FullBuyerLayout',
  component: MockFullDashboardLayout,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <CartProvider>
            <Story />
          </CartProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof MockFullDashboardLayout>;

/**
 * Standard view simulating a buyer browsing the root buyer route.
 */
export const DashboardDefaultView: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer',
      },
    },
  },
};

/**
 * Simulates active navigation states deeper in the buyer dashboard directories.
 * This checks if your sidebar active line indicators function correctly on other routes.
 */
export const DashboardOrdersView: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer/orders',
      },
    },
  },
};

/**
 * Simulates the profile settings layout route.
 */
export const DashboardSettingsView: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer/settings',
      },
    },
  },
};
