import type { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact',
  description: '질문, 피드백, 협업 제안 무엇이든 환영합니다.',
  alternates: { canonical: 'https://dechive.dev/contact', languages: { 'x-default': 'https://dechive.dev/contact' } },
  openGraph: {
    title: 'Contact | Dechive',
    description: '질문, 피드백, 협업 제안 무엇이든 환영합니다.',
    url: 'https://dechive.dev/contact',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Contact Dechive' }],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
