'use client';

import { Loader2, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitContactForm } from '@/lib/api/generated/contact/contact';

/**
 * The Contact Page.
 * Allows users to send a general inquiry, automatically filling in their information if authenticated.
 * @returns The contact form page component
 */
export default function ContactClient() {
  const { user } = useAuth();
  const submitContactFormMutation = useSubmitContactForm();

  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    name: string | null;
    email: string | null;
    company: string;
    message: string;
  }>({
    name: null,
    email: null,
    company: '',
    message: '',
  });

  const resolvedName = formData.name ?? user?.name ?? '';
  const resolvedEmail = formData.email ?? user?.email ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      await submitContactFormMutation.mutateAsync({
        data: {
          name: resolvedName,
          email: resolvedEmail,
          company: formData.company,
          message: formData.message,
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
          <h1 className="font-heading text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold text-deep-forest tracking-[-0.035em] leading-[1.1] mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-forest-dark/80 max-w-lg mx-auto">
            Have a question, feedback, or need support? Send us a message and our team will get back
            to you shortly.
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
                <span className="font-semibold text-deep-forest">{formData.email}</span>.
              </p>
              <Button
                variant="outline"
                className="border-lime/50 text-deep-forest hover:bg-lime/10"
                onClick={() => {
                  setFormData({ ...formData, message: '' });
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
                  Contact Form
                </CardTitle>
                <CardDescription className="text-forest-dark/70 text-sm mt-1">
                  Fields marked with an asterisk (*) are required.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-deep-forest">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={resolvedName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="flex h-12 w-full rounded-md border border-forest-dark/20 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-forest-dark/40 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent disabled:opacity-50"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-deep-forest">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={resolvedEmail}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="flex h-12 w-full rounded-md border border-forest-dark/20 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-forest-dark/40 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Company Field (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-semibold text-deep-forest">
                      Company / Organization{' '}
                      <span className="text-forest-dark/50 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your organization name"
                      className="flex h-12 w-full rounded-md border border-forest-dark/20 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-forest-dark/40 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent disabled:opacity-50"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-deep-forest">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="flex w-full rounded-md border border-forest-dark/20 bg-transparent px-3 py-3 text-sm transition-colors placeholder:text-forest-dark/40 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent disabled:opacity-50 resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-lime/20">
                    <Button
                      type="submit"
                      disabled={submitContactFormMutation.isPending}
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
