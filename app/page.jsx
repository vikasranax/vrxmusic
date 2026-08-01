'use client';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Film, Waves } from 'lucide-react';
import { useStore } from '@/lib/store';
import youtubeManager from '@/lib/youtubeManager';
import BackgroundScene from '@/components/BackgroundScene';
import Wordmark from '@/components/Wordmark';
import LeftRail from '@/components/LeftRail';
import PasteUrl from '@/components/PasteUrl';
import Player from '@/components/Player';
import MovieView from '@/components/MovieView';
import MovieDrawer from '@/components/MovieDrawer';
import Toast from '@/components/Toast';
import { viewSwap } from '@/lib/motion';

function MusicView() {
  const pasteRef = useRef(null);
  const focusPaste = () => pasteRef.current?.querySelector('input')?.focus();
  return (
    <motion.div key="etherix" variants={viewSwap} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
      <Wordmark />
      <LeftRail />
      <PasteUrl ref={pasteRef} />
      <Player onAdd={focusPaste} />
    </motion.div>
  );
}

function FilmToggle() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const isMusic = view === 'music';
  return (
    <button onClick={() => setView(isMusic ? 'movies' : 'music')} title={isMusic ? 'Open INDRISMA' : 'Back to ETHERIX'}
      className="glass absolute bottom-24 right-7 z-30 grid h-[54px] w-[54px] place-items-center rounded-full text-dim transition hover:scale-105 hover:text-accent">
      {isMusic ? <Film size={22} /> : <Waves size={22} />}
    </button>
  );
}

export default function Page() {
  const view = useStore((s) => s.view);

  useEffect(() => {
    youtubeManager.init();
    // Autoplay lofi after a short delay so the YT script can load
    const t = setTimeout(() => {
      youtubeManager.playChannel('lofi');
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#05070a] text-ink">
      <BackgroundScene />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(120%_90%_at_50%_0%,transparent_40%,rgba(5,7,10,.6))]" />
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {view === 'music' ? <MusicView /> : <MovieView />}
        </AnimatePresence>
        <FilmToggle />
        <MovieDrawer />
        <Toast />
      </div>
    </main>
  );
}