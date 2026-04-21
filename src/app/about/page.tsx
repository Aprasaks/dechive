import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description: '기록되어지는 지식은 가치를 가진다. Dechive는 수많은 정보를 재정립하여 지식으로 만드는 공간입니다.',
  alternates: { canonical: 'https://dechive.dev/about', languages: { 'x-default': 'https://dechive.dev/about' } },
  openGraph: {
    title: 'About | Dechive',
    description: '기록되어지는 지식은 가치를 가진다. Dechive는 수많은 정보를 재정립하여 지식으로 만드는 공간입니다.',
    url: 'https://dechive.dev/about',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'About Dechive' }],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
