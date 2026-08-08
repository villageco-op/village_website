'use client';

import { BarChart3, CheckCircle2, HeartHandshake } from 'lucide-react';
import { useState } from 'react';

import { ContactFormFields } from './ContactFormFields';
import { ContactSuccess } from './ContactSuccess';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * The contact page for requesting to become a data partner for the waste prediction research project.
 * @returns A full page contact page with details
 */
export default function BecomeDataPartnerClient() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-deep-forest text-cream py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Context & Partner Information */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="text-lime">Partner</span> with us to eliminate food waste
          </h1>

          <p className="text-base sm:text-lg text-cream/80 leading-relaxed">
            We are recruiting grocery stores and local restaurants to share purchasing and waste
            data for a Master’s thesis research project starting in August 2027.
          </p>

          {/* Key Partner Perks */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 bg-forest-mid/30 p-4 rounded-xl border border-cream/10">
              <BarChart3 className="size-5 text-lime shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-cream">Spoilage Prediction</h3>
                <p className="text-xs text-cream/70 mt-1">
                  Help train machine learning models to map city-wide demand trends and predict
                  waste cycles before they happen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-forest-mid/30 p-4 rounded-xl border border-cream/10">
              <HeartHandshake className="size-5 text-lime shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-cream">
                  Automate Tax-Deductible Pantry Donations
                </h3>
                <p className="text-xs text-cream/70 mt-1">
                  Safe surplus predictions allow pre-spoilage donations to local food pantries with
                  precise tax valuation logs.
                </p>
              </div>
            </div>
          </div>

          {/* Program Checklist */}
          <div className="pt-4 border-t border-cream/10 space-y-2.5 text-xs text-cream/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-lime shrink-0" />
              <span>Complimentary trial and early access for participating businesses in 2027</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-lime shrink-0" />
              <span>
                No long-term commitments required during the preliminary data gathering phase
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <Card>
            {isSuccess ? (
              <ContactSuccess
                title="Partner Inquiry Received!"
                description="Thank you for helping us tackle community food waste. Our research team will review your details and reach out to you shortly."
                buttonText="Submit Another Inquiry"
                onReset={() => setIsSuccess(false)}
              />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Become a Research Data Partner</CardTitle>
                </CardHeader>

                <CardContent className="pt-4">
                  <ContactFormFields
                    subjectPrefix="[DATA PARTNER INQUIRY]"
                    buttonText="Submit Form"
                    buttonVariant="forest"
                    labels={{
                      name: 'Contact Name',
                      email: 'Work Email',
                      company: 'Organization or Business Name',
                      message: 'Organization Details',
                    }}
                    placeholders={{
                      name: 'Jane Doe',
                      email: 'jane@restaurant.com',
                      company: 'e.g. Main St Bistro / Neighborhood Grocer',
                      message:
                        'Tell us about your location, city size, and any POS or inventory management systems you currently use...',
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
