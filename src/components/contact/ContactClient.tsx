'use client';

import { useState } from 'react';

import { ContactFormFields } from './ContactFormFields';
import { ContactSuccess } from './ContactSuccess';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * The Contact Page.
 * Allows users to send a general inquiry, automatically filling in their information if authenticated.
 * @returns The contact form page component
 */
export default function ContactClient() {
  const [isSuccess, setIsSuccess] = useState(false);

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

        <Card>
          {isSuccess ? (
            <ContactSuccess
              title="Message Sent!"
              description="Thank you for reaching out. A member of our team will get back to you shortly."
              buttonText="Send another message"
              onReset={() => setIsSuccess(false)}
            />
          ) : (
            <>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Fields marked with an asterisk (*) are required.</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <ContactFormFields
                  subjectPrefix="[GENERAL INQUIRY]"
                  buttonText="Send Message"
                  buttonVariant="forest"
                  labels={{
                    name: 'Full Name',
                    email: 'Email Address',
                    company: 'Organization (Optional)',
                    message: 'Message',
                  }}
                  placeholders={{
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    company: 'e.g. City Food Bank / Neighborhood Grocer',
                    message: 'How can we help you?',
                  }}
                  onSuccess={() => setIsSuccess(true)}
                />
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
