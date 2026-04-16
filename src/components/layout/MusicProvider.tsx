'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface MusicContextValue {
  playing: boolean;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue>({ playing: false, toggle: () => {} });

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio('/audio/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <MusicContext.Provider value={{ playing, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  return useContext(MusicContext);
}
