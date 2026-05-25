'use client';

import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { env } from '@/config/env';
import { getAssetPath } from '@/lib/utils';

/**
 * The client component for the login page.
 * @returns A branded component for signing in with Google or Magic Link.
 */
export default function LoginClient() {
  const searchParams = useSearchParams();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const callbackUrl = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/login/success`;

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error('Authentication failed. Please try again or use a different method.');
    }
  }, [searchParams]);

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
        toast.error('Security handshake failed. Please refresh the page.');
      }
    };
    void fetchCsrfToken();
  }, []);

  const handleMagicLinkSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const entries = Object.fromEntries(formData.entries()) as Record<string, string>;

    const signInPromise = (async () => {
      const res = await fetch('/api/auth/signin/nodemailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(entries),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      if (res.url) {
        const finalUrl = new URL(res.url);

        if (finalUrl.searchParams.has('error')) {
          throw new Error('Authentication failed');
        }

        if (finalUrl.pathname.includes('verify-request')) {
          return res;
        }
      }

      try {
        const textData = await res.text();
        if (textData) {
          const data = JSON.parse(textData);
          if (data?.url && new URL(data.url, window.location.href).searchParams.has('error')) {
            throw new Error('Authentication failed');
          }
        }
      } catch (e) {
        console.warn('Response was not JSON, continuing execution path.');
      }

      return res;
    })();

    toast.promise(signInPromise, {
      loading: 'Sending your magic link...',
      success: () => {
        setIsLoading(false);
        setIsEmailSent(true);
        return 'Check your email for the login link!';
      },
      error: () => {
        setIsLoading(false);
        return 'Failed to send email. Please try again.';
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <Link href="/" className="mb-8">
        <Image
          src={getAssetPath('/icons/logo-horizontal.png')}
          alt="Village Logo"
          width={150}
          height={51}
          priority
          className="w-auto h-12"
        />
      </Link>

      {/* Login Card */}
      <div className="max-w-md w-full bg-card border border-border/20 shadow-sm rounded-xl p-8">
        {isEmailSent ? (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime/20 text-forest-dark">
              <Mail className="h-8 w-8" />
            </div>

            <h2 className="font-heading text-2xl font-bold text-deep-forest mb-3">
              Check your email
            </h2>

            <p className="font-sans text-sm text-ink-3 mb-8">
              We sent a secure login link to <br />
              <span className="font-semibold text-ink">{email}</span>. <br />
              Please check your inbox to continue.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEmailSent(false)}
              className="w-full bg-white border-border/50 text-ink hover:bg-cream/50 h-11 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </div>
        ) : (
          <>
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
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
              <form
                onSubmit={(e) => {
                  void handleMagicLinkSignIn(e);
                }}
                method="POST"
                className="space-y-4"
              >
                <input type="hidden" name="csrfToken" value={csrfToken} />
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <input type="hidden" name="redirect" value="false" />

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
                  disabled={isLoading}
                  className="w-full h-11 bg-lime text-forest-dark font-heading text-sm font-bold tracking-wide transition-transform hover:bg-lime-light hover:-translate-y-px disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Email me a login link'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            </div>
          </>
        )}

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
