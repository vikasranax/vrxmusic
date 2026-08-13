'use client';
import { Play, Pause, SkipForward, Volume2, VolumeX, Plus, Film } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CHANNELS } from '@/lib/playlistData';
import youtubeManager from '@/lib/youtubeManager';

export default function Player() {
  const status = useStore((s) => s.status);
  const volume = useStore((s) => s.volume);
  const muted = useStore((s) => s.muted);
  const track = useStore((s) => s.currentTrack);
  const channelId = useStore((s) => s.currentChannelId);
  const setVolume = useStore((s) => s.setVolume);
  const setMuted = useStore((s) => s.setMuted);
  const setPanelOpen = useStore((s) => s.setPanelOpen);

  const playing = status === 'playing' || status === 'loading';

  const onVol = (e) => {
    const v = +e.target.value;
    setVolume(v);
    setMuted(v === 0);
    youtubeManager.setVolume(v);
  };
  const onMute = () => {
    const m = !muted;
    setMuted(m);
    youtubeManager.applyMute(m);
  };

  return (
    <div className="glass absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
      <button
        onClick={() => youtubeManager.togglePlay()}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-ink transition hover:bg-white/10 sm:h-11 sm:w-11"
      >
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </button>

      <button onClick={() => youtubeManager.next()} className="shrink-0 text-[#4a5568] transition hover:text-[#8a97a6]">
        <SkipForward size={18} />
      </button>

      <div className="min-w-0">
        <div className="max-w-[160px] truncate text-xs font-semibold text-[#c7d0da] sm:max-w-[240px] sm:text-sm">
          {track.title}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#4a5568] sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34e1d6]" />
          {track.badge}
        </div>
      </div>

      <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto py-1">
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => youtubeManager.playChannel(c.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold transition sm:px-4 sm:py-2 sm:text-xs
            ${c.id === channelId ? 'bg-[#34e1d6] text-[#04181a]' : 'bg-white/5 text-[#4a5568] hover:bg-white/10 hover:text-[#8a97a6]'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => setPanelOpen(true)}
        title="Movies & Watchlist"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/5 bg-white/5 text-[#4a5568] transition hover:border-[#34e1d6]/30 hover:text-[#34e1d6] sm:h-10 sm:w-10"
      >
        <Film size={16} />
      </button>

      <button onClick={() => {}} title="Add custom" className="hidden h-8 w-8 shrink-0 place-items-center rounded-full text-[#4a5568] transition hover:text-ink sm:grid">
        <Plus size={16} />
      </button>

      <div className="hidden items-center gap-2 text-[#4a5568] sm:flex">
        <button onClick={onMute}>
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input type="range" min={0} max={100} value={muted ? 0 : volume} onChange={onVol} className="w-20 sm:w-28" />
      </div>
    </div>
  );
}