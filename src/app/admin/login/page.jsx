import { redirect } from 'next/navigation';
import { getAuthorizedOwnerActor } from '@/features/admin/owner-auth';
import { createAdminDatabase } from '@/services/knowledge-drafts';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const { pool } = createAdminDatabase();
  try { if (await getAuthorizedOwnerActor(pool)) redirect('/admin'); } finally { await pool.end(); }

  return (
    <main className="min-h-dvh bg-stone-950 text-zinc-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-[0.34em] text-amber-200/55 uppercase">
          Dechive Private
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-header-serif)] text-4xl font-medium tracking-[0.04em] text-zinc-100">
          관리자 입장
        </h1>
        <p className="mt-5 text-sm leading-7 text-zinc-500">
          Dechive 콘텐츠와 방문 분석을 관리하는 owner 전용 공간입니다.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
