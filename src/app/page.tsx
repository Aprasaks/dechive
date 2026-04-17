import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dechive.dev' },
};

export default function Home() {
  return <HomeClient />;
}
