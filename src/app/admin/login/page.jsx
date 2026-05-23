import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/adminAuth';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (isValidAdminSession(session)) {
    redirect('/admin/analytics');
  }

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
          오늘 Dechive에 남은 방문 흔적을 확인하기 위한 조용한 관측실입니다.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
