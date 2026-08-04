'use client';

import { useState } from 'react';

import { ContactSuccess } from './ContactSuccess';

import { ContactFormFields } from '@/components/contact/ContactFormFields';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * The contact page client for requesting custom features or services.
 * @returns A full page contact page with details
 */
export default function CustomFeaturesContactClient() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-deep-forest text-cream py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Context & Service Information */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Need <span className="text-lime">Custom Software</span> or Features?
          </h1>

          <p className="text-base sm:text-lg text-cream/80 leading-relaxed">
            Every food pantry, grocery store, and restaurant operates differently. We build custom
            features & services tailored to your organizations needs.
          </p>
        </div>

        {/* Right Column: Dynamic Contact Form */}
        <div className="lg:col-span-7">
          <Card>
            {isSuccess ? (
              <ContactSuccess
                title="Feature Inquiry Received!"
                description="Thank you for reaching out. Our engineering and product team will review your message and follow up with you shortly."
                buttonText="Submit Another Request"
                onReset={() => setIsSuccess(false)}
              />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Request Custom Service</CardTitle>
                </CardHeader>

                <CardContent className="pt-4">
                  <ContactFormFields
                    subjectPrefix="[CUSTOM FEATURE / SERVICES INQUIRY]"
                    buttonText="Submit Inquiry"
                    buttonVariant="forest"
                    labels={{
                      name: 'Contact Name',
                      email: 'Work Email',
                      company: 'Organization or Business Name',
                      message: 'Requested Feature or Service',
                    }}
                    placeholders={{
                      name: 'Jane Doe',
                      email: 'jane@pantry.org',
                      company: 'e.g. City Food Bank / Neighborhood Grocer',
                      message: 'Describe the feature, tool, or integration your business needs...',
                    }}
                    onSuccess={() => setIsSuccess(true)}
                  />
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
