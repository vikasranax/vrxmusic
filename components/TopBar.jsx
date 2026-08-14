'use client';
import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function TopBar() {
  const setPanelOpen = useStore((s) => s.setPanelOpen);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 24-hour format
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-4 sm:px-8 sm:pt-5">
      {/* left — time & date */}
      <div className="select-none">
        <div className="font-mono text-lg font-medium tracking-[0.2em] text-ink sm:text-xl">{time}</div>
        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#4a5568]">{date}</div>
      </div>

      {/* center — wordmark */}
      <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none text-center sm:top-5">
        <div className="font-display text-sm font-light uppercase tracking-[0.45em] text-[#9aa5b1] sm:text-base">Aetheria</div>
        <div className="mt-0.5 text-[9px] uppercase tracking-[0.5em] text-[#4a5568]">VRX Music</div>
      </div>

      {/* right — movies */}
      <button
        onClick={() => setPanelOpen(true)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a97a6] backdrop-blur-md transition hover:border-[#34e1d6]/40 hover:text-[#34e1d6]"
      >
        <Film size={13} /> Movies
      </button>
    </div>
  );
}