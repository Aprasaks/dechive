import type { Metadata } from 'next';
import { ContentIndexPage } from '@/components/content/ContentIndexPage';

export const metadata: Metadata = { title: 'Books' };
export const dynamic = 'force-dynamic';

export default function BooksPage() {
  return <ContentIndexPage type="book" />;
}
