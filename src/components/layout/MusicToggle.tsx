'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useMusicContext } from './MusicProvider';

export default function MusicToggle({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { playing, toggle } = useMusicContext();
  const activeClass = tone === 'light' ? 'text-[#111111]' : 'text-white';
  const inactiveClass = tone === 'light'
    ? 'text-[#777777] hover:text-[#111111]'
    : 'text-zinc-400 hover:text-zinc-200';

  return (
    <button
      onClick={toggle}
      aria-label={playing ? '음악 끄기' : '음악 켜기'}
      className={`transition-colors ${playing ? activeClass : inactiveClass}`}
    >
      {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  );
}
