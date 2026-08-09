/**
 * The privacy policy page.
 * @returns The page content
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-teal-sovereign selection:text-cream-library max-w-3xl mx-auto p-6 md:p-12">
      <article className="space-y-6 text-sm leading-relaxed">
        <div>
          <h1 className="text-xl font-bold">Village Co-op</h1>
          <p className="text-muted-foreground italic">Last updated: 08/09/2026</p>
        </div>

        <p>
          This Privacy Policy for Village Co-op (&quot;Village Co-op&quot; and &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), describes how and why we may configure, collect,
          store, use, and/or share your personal information when you use our services, including
          when you visit our website at{' '}
          <a
            href="https://villageco-op.com"
            className="underline hover:text-teal-sovereign transition-colors"
          >
            https://villageco-op.com
          </a>
          .
        </p>

        <ul className="list-disc pl-5 space-y-3">
          <li>
            <strong>Information We Collect:</strong> We collect personal information you voluntarily
            provide through our site:
            <ul className="list-circle pl-5 mt-2 space-y-1">
              <li>
                <strong>General Inquiries:</strong> Contact form details, which may include your
                name, email address, and optional messages.
              </li>
              <li>
                <strong>Organizations:</strong> Organization address, and optional organization
                email address and website URL.
              </li>
              <li>
                <strong>Food Pantry Client Management:</strong> Optional client profiles containing
                email address, phone number, and street address.
              </li>
            </ul>
          </li>
          <li>
            <strong>Payment Processing:</strong> When purchasing locally grown produce or farm
            products, payments are processed directly through Stripe. We do not store, process, or
            retain any credit card, debit card, or banking details on our servers.
          </li>
          <li>
            <strong>How We Use It:</strong> To respond to inquiries, facilitate produce sales,
            fulfill orders, and manage local community food pantry services. We will not sell your
            data.
          </li>
          <li>
            <strong>Sharing Data:</strong> We do not sell or rent your personal information to third
            parties.
          </li>
          <li>
            <strong>Third-Party Services:</strong> We work with third-party service providers (such
            as Stripe for payments and analytics providers) to perform necessary platform services.
            These third parties only access your data to carry out specific tasks on our behalf and
            are contractually bound not to disclose or use it for any other purpose.
          </li>
          <li>
            <strong>Your Rights:</strong> You can contact us to request access to, correction of, or
            deletion of your personal data.
          </li>
          <li>
            <strong>Consent:</strong> By using our site, you consent to this Privacy Policy and
            agree to only provide accurate personal information relevant to the services requested.
          </li>
        </ul>
      </article>
    </div>
  );
}
