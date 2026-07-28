'use client';

import * as React from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useAnalytics } from './AnalyticsProvider';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-Y08SJBLW8G';
const OPT_OUT_KEY = 'dechive_disable_ga';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const { consent } = useAnalytics();
  const [isOptedOut, setIsOptedOut] = React.useState(true);

  React.useEffect(() => {
    setIsOptedOut(window.localStorage.getItem(OPT_OUT_KEY) === 'true');
  }, []);

  if (pathname.startsWith('/admin') || consent !== 'granted' || isOptedOut) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
