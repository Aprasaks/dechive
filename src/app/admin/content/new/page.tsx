import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOwner } from '@/lib/auth/require-owner';
import { logout } from '../../actions';
import { NewContentForm } from './NewContentForm';

export const metadata: Metadata = {
  title: '새 콘텐츠',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function NewContentPage() {
  const { user } = await requireOwner();

  return (
    <main id="main-content" className="admin-page">
      <header className="admin-topbar">
        <Link href="/admin" className="admin-brand">
          DECHIVE
        </Link>
        <div>
          <span>{user.email}</span>
          <form action={logout}>
            <button type="submit">로그아웃</button>
          </form>
        </div>
      </header>

      <section className="admin-shell new-content-page">
        <Link className="admin-back-link" href="/admin">
          ← 콘텐츠 관리
        </Link>
        <div className="admin-heading">
          <div>
            <p className="eyebrow">NEW CONTENT</p>
            <h1>새 콘텐츠</h1>
            <p>유형과 제목만 정하면 바로 초안 작성을 시작합니다.</p>
          </div>
        </div>
        <NewContentForm />
      </section>
    </main>
  );
}
