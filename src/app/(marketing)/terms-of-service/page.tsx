/**
 * The terms of service page.
 * @returns The page content
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-teal-sovereign selection:text-cream-library max-w-3xl mx-auto p-6 md:p-12">
      <article className="space-y-6 text-sm leading-relaxed">
        <div>
          <h1 className="text-xl font-bold">Village Co-op</h1>
          <p className="text-muted-foreground italic">Last updated: 08/09/2026</p>
        </div>

        <p>
          Welcome to Village Co-op (&quot;Village Co-op,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). By accessing or using our website at{' '}
          <a
            href="https://villageco-op.com"
            className="underline hover:text-teal-sovereign transition-colors"
          >
            https://villageco-op.com
          </a>{' '}
          and associated services, you agree to be bound by these Terms of Service.
        </p>

        <ul className="list-disc pl-5 space-y-3">
          <li>
            <strong>Acceptable Use:</strong> You agree to use our site and contact tools only for
            lawful purposes. You must not submit false, misleading, or unauthorized details on
            behalf of any third party or organization.
          </li>
          <li>
            <strong>Orders and Purchases:</strong> All produce and farm product sales are processed
            securely through Stripe. Availability, pricing, and fulfillment timelines for
            agricultural goods are subject to harvest conditions and local supply.
          </li>
          <li>
            <strong>Food Pantry Management & Accounts:</strong> Information submitted for food
            pantry client management and organization directories must be accurate. We reserve the
            right to correct, refuse, or remove listings or profile data that breach community
            guidelines.
          </li>
          <li>
            <strong>Intellectual Property:</strong> All content, logos, layout designs, and
            materials on this site are the property of Village Co-op and are protected by applicable
            intellectual property laws.
          </li>
          <li>
            <strong>Limitation of Liability:</strong> To the fullest extent permitted by law,
            Village Co-op and its operators are not liable for any indirect, incidental, or
            consequential damages resulting from your use of the website, products, or pantry
            services.
          </li>
          <li>
            <strong>Changes to Terms:</strong> We reserve the right to update or revise these Terms
            at any time. Continued use of the website after modifications indicates your acceptance
            of the revised Terms.
          </li>
          <li>
            <strong>Contact:</strong> If you have questions about these Terms of Service, please
            reach out through our website contact form.
          </li>
        </ul>
      </article>
    </div>
  );
}
