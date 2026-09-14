import type { Metadata } from 'next';
import { BooksIndexPage } from '@/components/content/BooksIndexPage';

export const metadata: Metadata = { title: 'Books' };
export const dynamic = 'force-dynamic';

export default function BooksPage() {
  return <BooksIndexPage />;
}
