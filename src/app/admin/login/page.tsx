import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: '관리자 로그인',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main id="main-content" className="admin-login-page">
      <section>
        <Link href="/" className="admin-brand">
          DECHIVE
        </Link>
        <p className="eyebrow">PRIVATE EDITOR</p>
        <h1>관리자 로그인</h1>
        <p>Dechive의 원본 지식과 발행 기록을 관리합니다.</p>
        <LoginForm />
      </section>
    </main>
  );
}
