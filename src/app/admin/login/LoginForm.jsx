'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      router.push('/admin/analytics');
      router.refresh();
    } catch {
      setError('잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <label className="block">
        <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">ID</span>
        <input
          name="id"
          value={id}
          onChange={(event) => setId(event.target.value)}
          autoComplete="username"
          className="mt-2 w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-amber-500/45"
          placeholder="admin"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
          Password
        </span>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="mt-2 w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-amber-500/45"
          placeholder="••••••••"
          required
        />
      </label>

      {error ? (
        <p className="border border-amber-500/20 bg-amber-950/10 px-4 py-3 text-sm text-amber-200/85">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold tracking-[0.2em] text-amber-100 uppercase transition-colors hover:border-amber-400/55 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? '확인 중' : '들어가기'}
      </button>
    </form>
  );
}
