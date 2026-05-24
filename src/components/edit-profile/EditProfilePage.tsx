'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '../ui/button';
import { NotFoundState } from '../ui/state-displays';

import { EditProfileSkeleton } from './EditProfileSkeleton';
import ProfileTab from './ProfileTab';
import SettingsTab from './SettingsTab';

import { useAuth } from '@/hooks/useAuth';

type Tab = 'profile' | 'settings';

/**
 * A page for editing a users account information. Includes additonal inputs for sellers.
 * @returns A page with profile and settings tabs.
 */
export default function EditProfilePage() {
  const { user, status, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const router = useRouter();

  if (status === 'loading') {
    return <EditProfileSkeleton />;
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <NotFoundState
        title="Account Not Found"
        description="We couldn't load your account details. Please log in to edit your profile."
        action={<Button onClick={() => router.push('/login')}>Login</Button>}
      />
    );
  }

  const isSeller = user.stripeOnboardingComplete === true;

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-off-white">
      <div className="max-w-2xl w-full">
        <h1 className="font-heading text-3xl font-bold text-deep-forest mb-6">Edit Profile</h1>

        {/* Tabs Switcher */}
        <div className="flex space-x-6 border-b border-border/20 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold text-sm transition-colors relative ${
              activeTab === 'profile' ? 'text-deep-forest' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            Profile Details
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 font-semibold text-sm transition-colors relative ${
              activeTab === 'settings' ? 'text-deep-forest' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            Account Settings
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime" />
            )}
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-6 sm:p-8">
          {activeTab === 'profile' && <ProfileTab user={user} isSeller={isSeller} />}

          {activeTab === 'settings' && <SettingsTab onLogout={() => void logout()} />}
        </div>
      </div>
    </div>
  );
}
