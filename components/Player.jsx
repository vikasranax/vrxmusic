'use client';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { CHANNELS } from '@/lib/playlistData';
import youtubeManager from '@/lib/youtubeManager';

export default function Player({ onAdd }) {
  const status = useStore((s) => s.status);
  const volume = useStore((s) => s.volume);
  const muted = useStore((s) => s.muted);
  const track = useStore((s) => s.currentTrack);
  const channelId = useStore((s) => s.currentChannelId);
  const setVolume = useStore((s) => s.setVolume);
  const setMuted = useStore((s) => s.setMuted);

  const playing = status === 'playing' || status === 'loading';

  const onVol = (e) => { const v = +e.target.value; setVolume(v); setMuted(v === 0); youtubeManager.setVolume(v); };
  const onMute = () => { const m = !muted; setMuted(m); youtubeManager.applyMute(m); };

  return (
    <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="glass absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-6">
      <button onClick={() => youtubeManager.togglePlay()} className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-ink transition hover:border-accent/50 sm:h-[46px] sm:w-[46px]">
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <button onClick={() => youtubeManager.next()} className="shrink-0 text-dim transition hover:text-ink"><SkipForward size={18} /></button>

      <div className="min-w-0">
        <div className="max-w-[140px] truncate text-xs font-bold sm:max-w-[180px] sm:text-sm">{track.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-faint sm:mt-1 sm:text-xs"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_8px_#34e1d6]" />{track.badge}</div>
      </div>

      {/* pills: horizontally scrollable on mobile */}
      <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto pb-1">
        {CHANNELS.map((c) => (
          <button key={c.id} onClick={() => youtubeManager.playChannel(c.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:px-4 sm:py-2 sm:text-xs
            ${c.id === channelId ? 'bg-accent text-accent-ink' : 'bg-white/5 text-dim hover:text-ink'}`}>{c.name}</button>
        ))}
      </div>

      <button onClick={onAdd} title="Custom stream" className="hidden h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-white/10 text-dim transition hover:text-accent sm:grid">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
      </button>

      {/* volume: hidden on small phones, shown on sm+ */}
      <div className="hidden items-center gap-2.5 text-dim sm:flex">
        <button onClick={onMute}>{muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        <input type="range" min={0} max={100} value={muted ? 0 : volume} onChange={onVol} className="w-24 sm:w-28" />
      </div>
    </motion.div>
  );
}