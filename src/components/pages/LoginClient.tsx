'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

/**
 * The client component for the login page.
 * @returns A branded component for signing in with Google or Magic Link.
 */
export default function LoginClient() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('/api/auth/csrf');

        if (!res.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Auth Error:', error);
        // TODO: Show an error toast
      }
    };
    void fetchCsrfToken();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <Link href="/" className="mb-8">
        <Image
          src="/icons/logo-horizontal.png"
          alt="Village Logo"
          width={150}
          height={51}
          priority
          className="w-auto h-12"
        />
      </Link>

      {/* Login Card */}
      <div className="max-w-md w-full bg-card border border-border/20 shadow-sm rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold text-deep-forest">
            Welcome to the Village
          </h2>
          <p className="font-sans text-sm text-ink-3 mt-2">
            Sign in or create an account to get involved.
          </p>
        </div>

        <div className="space-y-6">
          {/* Google OAuth Form */}
          <form action="/api/auth/signin/google" method="POST">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/" />
            <Button
              type="submit"
              variant="outline"
              className="w-full bg-white border-lime/50 text-ink hover:bg-cream/50 h-11 transition-colors"
            >
              <Icons.google className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f2efe6] px-2 text-ink-3 font-semibold tracking-wider rounded-sm">
                Or magic link
              </span>
            </div>
          </div>

          {/* Magic Link (Nodemailer) Form */}
          <form action="/api/auth/signin/nodemailer" method="POST" className="space-y-4">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/" />

            <div className="space-y-2">
              <Label htmlFor="email" className="text-ink-2 font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="farmer@valley.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-lime/50 h-11 focus-visible:ring-click-green placeholder:text-ink-3/40"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-lime text-forest-dark font-heading text-sm font-bold tracking-wide transition-transform hover:bg-lime-light hover:-translate-y-px"
            >
              Email me a login link
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-ink-3/70">
          By getting involved, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-ink-2">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-ink-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
