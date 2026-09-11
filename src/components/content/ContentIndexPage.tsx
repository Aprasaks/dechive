import { ContentList } from './ContentList';
import { getContentSection } from '@/lib/content/catalog';
import {
  getPublishedContent,
  type PublicContentSummary,
} from '@/lib/content/public';
import type { ContentType } from '@/lib/supabase/database.types';

export async function ContentIndexPage({ type }: { type: ContentType }) {
  const section = getContentSection(type);
  let items: PublicContentSummary[] = [];
  let unavailable = false;

  try {
    items = await getPublishedContent(type, 30);
  } catch {
    unavailable = true;
  }

  return (
    <main className="site-shell index-page">
      <header className="index-heading">
        <span>{section.index}</span>
        <div>
          <p>DECHIVE / {section.label.toUpperCase()}</p>
          <h1>{section.label}</h1>
          <p>{section.description}</p>
        </div>
      </header>
      <section aria-label={`${section.label} 목록`}>
        <ContentList
          items={items}
          emptyMessage={
            unavailable
              ? '콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'
              : '아직 공개한 기록이 없습니다.'
          }
        />
      </section>
    </main>
  );
}
