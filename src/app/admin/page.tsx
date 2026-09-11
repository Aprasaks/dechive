import type { Metadata } from 'next';
import Link from 'next/link';
import { logout } from './actions';
import { CONTENT_SECTIONS } from '@/lib/content/catalog';
import { requireOwner } from '@/lib/auth/require-owner';
import type { ContentType } from '@/lib/supabase/database.types';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

const EMPTY_COUNTS: Record<ContentType, number> = {
  knowledge: 0,
  lecture: 0,
  practice: 0,
  ai_update: 0,
  book: 0,
};

export default async function AdminPage() {
  const { supabase, user } = await requireOwner();
  const { data: contents, error } = await supabase
    .from('contents')
    .select('id,type,status,updated_at')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  const contentIds = (contents ?? []).map((content) => content.id);
  const draftResult = contentIds.length
    ? await supabase
        .from('content_drafts')
        .select('content_id,title')
        .in('content_id', contentIds)
    : { data: [], error: null };
  const draftTitles = new Map(
    (draftResult.data ?? []).map((draft) => [draft.content_id, draft.title]),
  );

  const counts = { ...EMPTY_COUNTS };

  for (const content of contents ?? []) {
    counts[content.type] += 1;
  }

  return (
    <main id="main-content" className="admin-page">
      <header className="admin-topbar">
        <Link href="/" className="admin-brand">
          DECHIVE
        </Link>
        <div>
          <span>{user.email}</span>
          <form action={logout}>
            <button type="submit">로그아웃</button>
          </form>
        </div>
      </header>

      <section className="admin-shell">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">CANONICAL CONTENT</p>
            <h1>콘텐츠 관리</h1>
            <p>
              초안, 출처, 관계, 발행 revision을 한곳에서 관리합니다.
            </p>
          </div>
          <Link className="admin-primary-action" href="/admin/content/new">
            새 콘텐츠
          </Link>
        </div>

        {error || draftResult.error ? (
          <p className="admin-error">
            콘텐츠 상태를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.
          </p>
        ) : null}

        <div className="admin-content-types">
          {CONTENT_SECTIONS.map((section) => (
            <article key={section.type}>
              <span>{section.index}</span>
              <h2>{section.label}</h2>
              <p>{section.description}</p>
              <strong>{counts[section.type]}</strong>
              <small>전체 콘텐츠</small>
            </article>
          ))}
        </div>

        <section className="admin-recent">
          <div>
            <p className="eyebrow">RECENT</p>
            <h2>최근 작업</h2>
          </div>
          {contents?.length ? (
            <ol>
              {contents.slice(0, 8).map((content) => {
                const section = CONTENT_SECTIONS.find(
                  (item) => item.type === content.type,
                );

                return (
                  <li key={content.id}>
                    <Link href={`/admin/content/${content.id}/edit`}>
                      <span>{section?.label ?? content.type}</span>
                      <strong>
                        {draftTitles.get(content.id)?.trim() || '제목 없는 초안'}
                      </strong>
                      <small>
                        {content.status === 'draft' ? '초안' : content.status}
                      </small>
                      <time dateTime={content.updated_at}>
                        {new Intl.DateTimeFormat('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }).format(new Date(content.updated_at))}
                      </time>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="quiet-empty">
              아직 작성한 콘텐츠가 없습니다. 첫 지식 글부터 시작해 보세요.
            </p>
          )}
        </section>

        <section className="admin-next">
          <span>WORKFLOW</span>
          <div>
            <h2>원본부터 차곡차곡</h2>
            <p>
              새 콘텐츠에서 유형과 제목을 정한 뒤 초안을 작성하세요. 입력을
              멈추면 자동 저장되며, 발행 전에는 공개되지 않습니다.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
