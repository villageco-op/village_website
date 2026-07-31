'use client';

import { Loader2, Send, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitContactForm } from '@/lib/api/generated/contact/contact';

/**
 * The Buyer Help Page.
 * Allows buyers to send a message to support.
 * @returns A page containing a contact form
 */
export default function BuyerHelpClient() {
  const { user } = useAuth();
  const submitContactFormMutation = useSubmitContactForm();

  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const isAuthenticated = !!user;

  const resolvedName = isAuthenticated ? (user?.name ?? '') : guestName;
  const resolvedEmail = isAuthenticated ? (user?.email ?? '') : guestEmail;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      await submitContactFormMutation.mutateAsync({
        data: {
          name: resolvedName,
          email: resolvedEmail,
          company: '',
          message: message,
        },
      });
      toast.success('Message sent successfully!');
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-20 px-4">
      <div className="container-custom max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lime-pale text-click-green rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBasket className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold text-deep-forest tracking-[-0.035em] leading-[1.1] mb-4">
            Buyer Support
          </h1>
          <p className="text-lg text-forest-dark/80 max-w-lg mx-auto">
            Need help with your orders, finding local farms, or connecting with your neighbors? Send
            us a message and we&apos;ll get right back to you.
          </p>
        </div>

        <Card>
          {isSuccess ? (
            <CardContent className="flex flex-col items-center justify-center p-16 text-center">
              <h2 className="font-heading text-2xl font-bold text-deep-forest mb-2">
                Message Sent!
              </h2>
              <p className="text-forest-dark/70 mb-8">
                Thank you for reaching out. A member of our team will get back to you at{' '}
                <span className="font-semibold text-deep-forest">{resolvedEmail}</span>.
              </p>
              <Button
                variant="lime"
                onClick={() => {
                  setMessage('');
                  setIsSuccess(false);
                }}
              >
                Send another message
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>How can we help?</CardTitle>
                <CardDescription>
                  We&apos;ll reply to the email associated with your account.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
                  {!isAuthenticated && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-deep-forest">
                          Your Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Johnny Appleseed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="johnny@example.com"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's on your mind?"
                      className="flex w-full"
                    />
                  </div>

                  <div className="pt-4 border-t border-lime/20">
                    <Button
                      type="submit"
                      variant="lime"
                      disabled={submitContactFormMutation.isPending || !message.trim()}
                      className="w-full sm:w-auto"
                    >
                      {submitContactFormMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
