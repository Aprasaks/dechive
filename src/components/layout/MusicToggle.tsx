'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useMusicContext } from './MusicProvider';

export default function MusicToggle() {
  const { playing, toggle } = useMusicContext();

  return (
    <button
      onClick={toggle}
      aria-label={playing ? '음악 끄기' : '음악 켜기'}
      className={`transition-colors ${playing ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
    >
      {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  );
}
