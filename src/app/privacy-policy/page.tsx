import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Dechive의 개인정보처리방침입니다.',
  alternates: { canonical: 'https://dechive.dev/privacy-policy' },
  robots: { index: true, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 min-h-[calc(100vh-64px-56px)]">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-zinc-100">
        Privacy Policy
      </h1>

      <div className="flex flex-col gap-8 text-zinc-300">
        <section>
          <p className="text-sm text-zinc-500">Last updated: April 6, 2026</p>
          <p className="mt-4 leading-relaxed">
            Dechive (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website dechive.dev. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Information We Collect</h2>
          <p className="leading-relaxed">
            We do not directly collect personal information from visitors. However, third-party services we use may collect certain data automatically, including:
          </p>
          <ul className="mt-3 flex flex-col gap-2 pl-5 text-sm leading-relaxed text-zinc-400">
            <li className="list-disc">Log data such as IP address, browser type, and pages visited</li>
            <li className="list-disc">Cookies and usage data collected by Google AdSense and Google Analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Google AdSense & Advertising</h2>
          <p className="leading-relaxed">
            We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You may opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-100"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Cookies</h2>
          <p className="leading-relaxed">
            Cookies are small files stored on your device. We use cookies through third-party services (Google AdSense, Analytics) to analyze traffic and improve our service. You can instruct your browser to refuse cookies, though some features may not function properly.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Third-Party Links</h2>
          <p className="leading-relaxed">
            Our website may contain links to third-party websites. We have no control over their content or privacy practices and encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Children&apos;s Privacy</h2>
          <p className="leading-relaxed">
            Our service is not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a
              href="mailto:heavenis0113@gmail.com"
              className="underline underline-offset-4 hover:text-zinc-100"
            >
              heavenis0113@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
