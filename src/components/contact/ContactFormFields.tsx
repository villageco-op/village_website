'use client';

import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitContactForm } from '@/lib/api/generated/contact/contact';

/**
 * Contact form props.
 */
export interface ContactFormFieldsProps {
  subjectPrefix?: string;
  labels?: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };
  placeholders?: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };
  buttonText?: string;
  buttonVariant?: 'forest' | 'lime' | 'default' | 'outline';
  isCompanyRequired?: boolean;
  onSuccess?: () => void;
}

/**
 * The contact form fields. Handles form submission and auto filling.
 * @param props - Component props
 * @param props.subjectPrefix -  Prefix added to the email subject
 * @param props.labels - The form input labels
 * @param props.placeholders - The form input placeholders
 * @param props.buttonText - The submit button text
 * @param props.buttonVariant - The submit button style variant
 * @param props.isCompanyRequired - Is the company input required
 * @param props.onSuccess - When the form is successfuly submitted
 * @returns Form inputs and a submit button
 */
export function ContactFormFields({
  subjectPrefix,
  labels = {},
  placeholders = {},
  buttonText = 'Submit Form',
  buttonVariant = 'forest',
  isCompanyRequired = false,
  onSuccess,
}: ContactFormFieldsProps) {
  const { user } = useAuth();
  const submitContactFormMutation = useSubmitContactForm();

  const [formData, setFormData] = useState({
    name: null as string | null,
    email: null as string | null,
    company: null as string | null,
    message: '',
    website: '', // Honeypot state
  });

  const resolvedName = formData.name ?? user?.name ?? '';
  const resolvedEmail = formData.email ?? user?.email ?? '';
  const resolvedCompany = formData.company ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.website) {
      toast.success('Inquiry submitted successfully!');
      if (onSuccess) onSuccess();
      return;
    }

    const finalMessage = subjectPrefix ? `${subjectPrefix}\n${formData.message}` : formData.message;

    try {
      await submitContactFormMutation.mutateAsync({
        data: {
          name: resolvedName,
          email: resolvedEmail,
          company: resolvedCompany,
          message: finalMessage,
          website: formData.website,
        },
      });
      toast.success('Inquiry submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      toast.error('Failed to send inquiry. Please try again later.');
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          className="absolute -left-2499.75 -top-2499.75 opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">
            {labels.name ?? 'Contact Name'} <span className="text-required">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={resolvedName}
            onChange={handleChange}
            placeholder={placeholders.name ?? 'Jane Doe'}
            className="flex h-12 w-full"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">
            {labels.email ?? 'Email Address'} <span className="text-required">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={resolvedEmail}
            onChange={handleChange}
            placeholder={placeholders.email ?? 'jane@example.com'}
            className="flex h-12 w-full"
          />
        </div>
      </div>

      {/* Company / Organization Field */}
      <div className="space-y-2">
        <Label htmlFor="company">
          {labels.company ?? 'Organization or Business Name'}{' '}
          {isCompanyRequired ? (
            <span className="text-required">*</span>
          ) : (
            <span className="text-forest-dark/50 font-normal">(Optional)</span>
          )}
        </Label>
        <Input
          id="company"
          name="company"
          type="text"
          required={isCompanyRequired}
          value={resolvedCompany}
          onChange={handleChange}
          placeholder={placeholders.company ?? 'e.g., Community Food Bank / Main St Market'}
          className="flex h-12 w-full"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message">
          {labels.message ?? 'How can we help?'} <span className="text-required">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder={
            placeholders.message ??
            'Tell us about your organization and the tools or features you need...'
          }
          className="flex w-full"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-deep-forest/10">
        <Button
          type="submit"
          variant={buttonVariant}
          disabled={submitContactFormMutation.isPending}
          className="w-full sm:w-auto font-bold px-8 h-12"
        >
          {submitContactFormMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              {buttonText} <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
