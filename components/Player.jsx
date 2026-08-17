'use client';
import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import youtubeManager from '@/lib/youtubeManager';

export default function Player() {
  const status = useStore((s) => s.status);
  const volume = useStore((s) => s.volume);
  const muted = useStore((s) => s.muted);
  const track = useStore((s) => s.currentTrack);
  const channelId = useStore((s) => s.currentChannelId);
  const setVolume = useStore((s) => s.setVolume);
  const setMuted = useStore((s) => s.setMuted);

  const [prog, setProg] = useState({ current: 0, duration: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setProg(youtubeManager.getProgress()), 1000);
    return () => clearInterval(t);
  }, []);

  const playing = status === 'playing' || status === 'loading';
  const remix = channelId === 'remix';
  const thumb = track.videoId ? `https://i.ytimg.com/vi/${track.videoId}/default.jpg` : null;
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  const onPlayPause = () => {
    if (!youtubeManager.isEngineStarted()) { youtubeManager.startEngine(); return; }
    youtubeManager.togglePlay();
  };
  const onVol = (e) => { const v = +e.target.value; setVolume(v); setMuted(v === 0); youtubeManager.setVolume(v); };
  const onMute = () => { const m = !muted; setMuted(m); youtubeManager.applyMute(m); };

  return (
    <div
      className="absolute left-0 right-0 z-[20] pointer-events-none"
      style={{ bottom: 'clamp(76px, 12vh, 110px)' }}
      onMouseEnter={() => canHover && setExpanded(true)}
      onMouseLeave={() => canHover && setExpanded(false)}
    >
      <div className="pointer-events-auto mx-auto w-fit px-2 py-1.5 sm:px-2.5 sm:py-2 flex items-center gap-3 sm:gap-4 rounded-full bg-panel border border-white/[0.07] backdrop-blur-xl transition-all duration-300">
        <div className={`relative h-8 w-8 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border border-white/[0.08] bg-gradient-to-br from-[#223333] to-[#111122] ${remix ? 'animate-pump' : playing ? 'animate-spin-slow' : ''}`}>
          {thumb ? (
            <img src={thumb} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted"><Music2 size={14} /></div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => youtubeManager.prev()} className="text-sub hover:text-ink transition"><SkipBack size={16} fill="currentColor" /></button>
          <button
            onClick={onPlayPause}
            className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-ink text-canvas shadow-glow transition hover:scale-105"
          >
            {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={() => youtubeManager.next()} className="text-sub hover:text-ink transition"><SkipForward size={16} fill="currentColor" /></button>
        </div>

        <div className={`hidden sm:flex items-center gap-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-w-[360px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <input
            type="range" min={0} max={Math.max(prog.duration, 1)}
            value={Math.min(prog.current, prog.duration)}
            onChange={(e) => youtubeManager.seek(+e.target.value)}
            className="seek w-24 sm:w-32"
          />
          <button onClick={onMute} className="text-muted hover:text-ink transition">
            {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input type="range" min={0} max={100} value={muted ? 0 : volume} onChange={onVol} className="seek w-16" />
        </div>
      </div>
    </div>
  );
}