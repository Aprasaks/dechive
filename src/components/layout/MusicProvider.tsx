'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface MusicContextValue {
  playing: boolean;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue>({ playing: false, toggle: () => {} });
const MUSIC_TRACKS = Array.from(
  { length: 9 },
  (_, index) => `/audio/background-music${index + 1}.mp3`,
);

function getRandomTrack(currentSrc?: string) {
  if (MUSIC_TRACKS.length === 1) return MUSIC_TRACKS[0];

  const availableTracks = currentSrc
    ? MUSIC_TRACKS.filter((track) => !currentSrc.endsWith(track))
    : MUSIC_TRACKS;
  const randomIndex = Math.floor(Math.random() * availableTracks.length);

  return availableTracks[randomIndex] ?? MUSIC_TRACKS[0];
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(getRandomTrack());
    audio.loop = false;
    audio.volume = 0.3;
    const playNextTrack = () => {
      audio.src = getRandomTrack(audio.currentSrc);
      audio.play().catch(() => setPlaying(false));
    };

    audio.addEventListener('ended', playNextTrack);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('ended', playNextTrack);
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
      if (!audio.src) {
        audio.src = getRandomTrack();
      }

      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
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
