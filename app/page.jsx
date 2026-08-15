'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import youtubeManager from '@/lib/youtubeManager';
import BackgroundScene from '@/components/BackgroundScene';
import TopBar from '@/components/TopBar';
import LeftRail from '@/components/LeftRail';
import Player from '@/components/Player';
import MoviePanel from '@/components/MoviePanel';
import Toast from '@/components/Toast';

export default function Page() {
  useEffect(() => {
    // Indian Bus (bollywood) auto-starts shuffled on open.
    // Prefer resuming the last channel instead? Use:
    // const ch = useStore.getState().currentChannelId || 'bollywood';
    const ch = 'bollywood';

    youtubeManager.init().then(() => {
      youtubeManager.playChannel(ch); // plays muted if browser blocks audio, unmutes on first click/keypress
    });

    const { syncKey, pullFromCloud } = useStore.getState();
    if (syncKey) pullFromCloud();
  }, []);

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#05070a] text-ink">
      <BackgroundScene />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(120%_90%_at_50%_0%,transparent_45%,rgba(5,7,10,.7))]" />
      <div className="relative z-10 h-full">
        <TopBar />
        <LeftRail />
        <Player />
        <MoviePanel />
        <Toast />
      </div>
    </main>
  );
}