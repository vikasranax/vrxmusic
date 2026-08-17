'use client';
import { useState } from 'react';
import { Link2, Play, X } from 'lucide-react';
import youtubeManager from '@/lib/youtubeManager';
import { useStore } from '@/lib/store';

export default function PasteUrl() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const setToast = useStore((s) => s.setToast);

  const submit = () => {
    if (!url.trim()) return;
    youtubeManager.playUrl(url.trim());
    setToast('Loading YouTube link…');
    setUrl('');
    setOpen(false);
  };

  return (
    <div className="absolute bottom-16 sm:bottom-14 right-4 sm:right-8 z-[25] flex items-center gap-2">
      {open && (
        <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-panel/80 backdrop-blur-xl pl-4 pr-1.5 py-1.5">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Paste YouTube URL…"
            className="w-40 sm:w-56 bg-transparent text-[11px] text-ink placeholder:text-muted focus:outline-none"
          />
          <button onClick={submit} className="grid h-6 w-6 place-items-center rounded-full bg-accent text-canvas" aria-label="Play link">
            <Play size={10} fill="currentColor" />
          </button>
          <button onClick={() => setOpen(false)} className="text-muted hover:text-ink" aria-label="Close">
            <X size={12} />
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur-xl transition
          ${open ? 'border-accent/40 text-accent bg-panel' : 'border-white/[0.07] text-sub bg-panel/60 hover:text-ink'}`}
        aria-label="Paste YouTube URL"
      >
        <Link2 size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}