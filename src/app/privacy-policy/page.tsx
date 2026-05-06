import type { Metadata } from 'next';
import PrivacyPolicyClient from '@/components/privacy/PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Dechive의 개인정보처리방침입니다.',
  alternates: { canonical: 'https://dechive.dev/privacy-policy', languages: { 'x-default': 'https://dechive.dev/privacy-policy' } },
  robots: { index: true, follow: false },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
