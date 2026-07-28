'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useAnalytics } from './AnalyticsProvider';

export default function Clarity() {
  const pathname = usePathname();
  const { consent } = useAnalytics();
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!projectId || consent !== 'granted' || pathname.startsWith('/admin') || pathname.startsWith('/dev')) return null;
  return <Script id="clarity-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${projectId.replace(/[^a-zA-Z0-9_-]/g, '')}");` }} />;
}
