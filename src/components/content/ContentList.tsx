import Link from 'next/link';
import type { PublicContentSummary } from '@/lib/content/public';
import { getContentSection } from '@/lib/content/catalog';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function detailHref(item: PublicContentSummary) {
  const section = getContentSection(item.type);
  return `${section.href}/${item.slug}`;
}

export function ContentList({
  items,
  emptyMessage,
}: {
  items: PublicContentSummary[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="quiet-empty">{emptyMessage}</p>;
  }

  return (
    <ol className="content-list">
      {items.map((item, index) => (
        <li key={item.id}>
          <Link href={detailHref(item)}>
            <span className="content-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="content-copy">
              <strong>{item.title}</strong>
              {item.summary ? <span>{item.summary}</span> : null}
            </span>
            <time dateTime={item.publishedAt}>
              {DATE_FORMATTER.format(new Date(item.publishedAt))}
            </time>
          </Link>
        </li>
      ))}
    </ol>
  );
}
