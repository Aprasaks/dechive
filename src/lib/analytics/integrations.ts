export type AnalyticsIntegrationStatus = {
  GA4: boolean;
  PostHog: boolean;
  Clarity: boolean;
  'Search Console': boolean;
  Cloudflare: boolean;
};

export function getAnalyticsIntegrationStatus(): AnalyticsIntegrationStatus {
  return {
    GA4: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_PROPERTY_ID),
    PostHog: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_API_KEY),
    Clarity: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
    'Search Console': Boolean(process.env.SEARCH_CONSOLE_SITE_URL),
    Cloudflare: Boolean(process.env.CLOUDFLARE_ANALYTICS_TOKEN),
  };
}
