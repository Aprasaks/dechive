export type AnalyticsIntegrationStatus = {
  GA4: boolean;
  PostHog: boolean;
  Clarity: boolean;
  'Search Console': boolean;
  Cloudflare: boolean;
};

function hasSearchConsoleCredentials() {
  return Boolean(
    process.env.SEARCH_CONSOLE_CLIENT_EMAIL || process.env.GA_CLIENT_EMAIL,
  ) && Boolean(
    process.env.SEARCH_CONSOLE_PRIVATE_KEY || process.env.GA_PRIVATE_KEY,
  );
}

export function getAnalyticsIntegrationStatus(): AnalyticsIntegrationStatus {
  return {
    GA4: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_PROPERTY_ID),
    PostHog: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_API_KEY),
    Clarity: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
    'Search Console': Boolean(process.env.SEARCH_CONSOLE_SITE_URL && hasSearchConsoleCredentials()),
    Cloudflare: Boolean(process.env.CLOUDFLARE_ANALYTICS_TOKEN),
  };
}
