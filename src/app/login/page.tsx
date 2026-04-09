import LoginClient from '@/components/pages/LoginClient';

/**
 * Login page for user login and account creation.
 * @returns html page
 */
export default function Login() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <LoginClient></LoginClient>
    </main>
  );
}
