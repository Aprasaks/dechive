'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="border border-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-zinc-400 uppercase transition-colors hover:border-amber-500/35 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Logout
    </button>
  );
}
