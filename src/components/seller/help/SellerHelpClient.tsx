'use client';

import { Loader2, Send, CheckCircle, Sprout } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitContactForm } from '@/lib/api/generated/contact/contact';

/**
 * The Seller Help Page.
 * Allows sellers and growers to send a message to support.
 * @returns A page containing a contact form
 */
export default function SellerHelpClient() {
  const { user } = useAuth();
  const submitContactFormMutation = useSubmitContactForm();

  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const resolvedName = user?.name ?? '';
  const resolvedEmail = user?.email ?? '';
  const resolvedOrg = user?.organization ?? '';

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      await submitContactFormMutation.mutateAsync({
        data: {
          name: resolvedName,
          email: resolvedEmail,
          company: resolvedOrg,
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
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold text-deep-forest tracking-[-0.035em] leading-[1.1] mb-4">
            Seller & Grower Support
          </h1>
          <p className="text-lg text-forest-dark/80 max-w-lg mx-auto">
            Need help managing your farm profile, listing your harvest, or fulfilling orders? Send
            us a message and our team will support you.
          </p>
        </div>

        <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white overflow-hidden">
          {isSuccess ? (
            <CardContent className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 bg-lime/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-lime" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-deep-forest mb-2">
                Message Sent!
              </h2>
              <p className="text-forest-dark/70 mb-8">
                Thank you for reaching out. A member of our team will get back to you at{' '}
                <span className="font-semibold text-deep-forest">{resolvedEmail}</span>.
              </p>
              <Button
                variant="outline"
                className="border-lime/50 text-deep-forest hover:bg-lime/10"
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
              <CardHeader className="bg-off-white border-b border-lime/20 pb-6">
                <CardTitle className="font-heading text-xl text-deep-forest">
                  How can we help?
                </CardTitle>
                <CardDescription className="text-forest-dark/70 text-sm mt-1">
                  We&apos;ll reply to the email associated with your account.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-deep-forest">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what you need help with..."
                      className="flex w-full rounded-md border border-forest-dark/20 bg-transparent px-3 py-3 text-sm transition-colors placeholder:text-forest-dark/40 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent disabled:opacity-50 resize-y"
                    />
                  </div>

                  <div className="pt-4 border-t border-lime/20">
                    <Button
                      type="submit"
                      disabled={submitContactFormMutation.isPending || !message.trim()}
                      className="w-full sm:w-auto bg-lime text-forest-dark hover:bg-lime-light font-bold h-12 px-8 text-base transition-all duration-300 hover:-translate-y-0.5"
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
