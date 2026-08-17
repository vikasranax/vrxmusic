'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import youtubeManager from '@/lib/youtubeManager';
import BackgroundScene from '@/components/BackgroundScene';
import TopBar from '@/components/TopBar';
import LeftRail from '@/components/LeftRail';
import Player from '@/components/Player';
import ChannelBar from '@/components/ChannelBar';
import PasteUrl from '@/components/PasteUrl';
import MoviePanel from '@/components/MoviePanel';
import Toast from '@/components/Toast';

export default function Page() {
  const [showMovies, setShowMovies] = useState(false);

  useEffect(() => {
    youtubeManager.init().then(() => {
      youtubeManager.playChannel('bollywood');
    });
    const { syncKey, pullFromCloud } = useStore.getState();
    if (syncKey) pullFromCloud();
  }, []);

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden font-sans text-ink">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, #0d1420 0%, #05070a 55%, #05070a 100%)' }}
      />
      <BackgroundScene />
      <div className="pointer-events-none fixed inset-0 z-[1] grain" />
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,.55) 100%)' }}
      />

      <div className="relative z-10 h-full">
        <TopBar onOpenMovies={() => setShowMovies(true)} />
        <LeftRail />
        <Player />
        <PasteUrl />
        <ChannelBar />
        <MoviePanel open={showMovies} onClose={() => setShowMovies(false)} />
        <Toast />
      </div>
    </main>
  );
}