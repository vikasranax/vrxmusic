'use client';
import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CHANNELS } from '@/lib/playlistData';
import youtubeManager from '@/lib/youtubeManager';

const fmt = (s) => {
  if (!isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export default function Player() {
  const status = useStore((s) => s.status);
  const volume = useStore((s) => s.volume);
  const muted = useStore((s) => s.muted);
  const track = useStore((s) => s.currentTrack);
  const channelId = useStore((s) => s.currentChannelId);
  const setVolume = useStore((s) => s.setVolume);
  const setMuted = useStore((s) => s.setMuted);

  const [prog, setProg] = useState({ current: 0, duration: 0 });
  useEffect(() => {
    const t = setInterval(() => setProg(youtubeManager.getProgress()), 1000);
    return () => clearInterval(t);
  }, []);

  const playing = status === 'playing' || status === 'loading';
  const remix = channelId === 'remix';
  const chName = CHANNELS.find((c) => c.id === channelId)?.name || '';
  const thumb = track.videoId ? `https://i.ytimg.com/vi/${track.videoId}/default.jpg` : null;

  const onPlayPause = () => {
    if (!youtubeManager.isEngineStarted()) { youtubeManager.startEngine(); return; }
    youtubeManager.togglePlay();
  };
  const onVol = (e) => { const v = +e.target.value; setVolume(v); setMuted(v === 0); youtubeManager.setVolume(v); };
  const onMute = () => { const m = !muted; setMuted(m); youtubeManager.applyMute(m); };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/5 bg-[rgba(8,11,16,.82)] backdrop-blur-xl">
      <style>{`
        @keyframes vrx-spin { to { transform: rotate(360deg); } }
        @keyframes vrx-pump { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
        .vrx-spin { animation: vrx-spin 8s linear infinite; }
        .vrx-pump { animation: vrx-pump .5s ease-in-out infinite; }
      `}</style>

      {/* transport row — like your reference image */}
      <div className="flex items-center gap-3 px-4 pt-3 sm:gap-4 sm:px-6">
        <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 ${remix ? 'vrx-pump' : playing ? 'vrx-spin' : ''}`}>
          {thumb ? (
            <img src={thumb} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-white/5 text-[#4a5568]"><Music2 size={14} /></div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{track.title}</p>
          <p className="mt-0.5 truncate text-[11px] text-[#8a97a6]">{chName}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#4a5568]">{fmt(prog.current)}</span>
            <input
              type="range" min={0} max={Math.max(prog.duration, 1)}
              value={Math.min(prog.current, prog.duration)}
              onChange={(e) => youtubeManager.seek(+e.target.value)}
              className="flex-1"
            />
            <span className="font-mono text-[9px] text-[#4a5568]">{fmt(prog.duration)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <button onClick={() => youtubeManager.prev()} className="text-white/60 transition hover:text-white"><SkipBack size={20} /></button>
          <button
            onClick={onPlayPause}
            className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#05070a] shadow-lg transition hover:scale-105"
          >
            {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={() => youtubeManager.next()} className="text-white/60 transition hover:text-white"><SkipForward size={20} /></button>
        </div>

        <div className="hidden shrink-0 items-center gap-2 text-[#4a5568] sm:flex">
          <button onClick={onMute}>{muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
          <input type="range" min={0} max={100} value={muted ? 0 : volume} onChange={onVol} className="w-20" />
        </div>
      </div>

      {/* playlists listed BELOW */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => youtubeManager.playChannel(c.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition
            ${c.id === channelId ? 'bg-[#34e1d6] text-[#04181a]' : 'bg-white/5 text-[#4a5568] hover:bg-white/10 hover:text-[#8a97a6]'}`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}