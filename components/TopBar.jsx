'use client';
import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';

export default function TopBar({ onOpenMovies }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).toUpperCase();

  return (
    <div className="absolute top-0 inset-x-0 z-[20] flex items-start justify-between px-5 pt-6 sm:px-8">
      <div className="hidden sm:block">
        <div className="font-mono text-[17px] font-medium tracking-[0.12em] text-ink">{hh}:{mm}</div>
        <div className="mt-1 font-mono text-[9.5px] tracking-[0.2em] text-muted">{dateStr}</div>
      </div>
      <div className="font-mono text-[13px] tracking-[0.1em] text-ink sm:hidden">{hh}:{mm}</div>

      <div className="absolute left-1/2 top-5 sm:top-6 flex -translate-x-1/2 items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full border border-accent animate-breathe" />
        <span className="font-serif text-[15px] sm:text-[20px] font-light tracking-[0.13em] text-ink">INDRISMA</span>
      </div>

      <button
        onClick={onOpenMovies}
        className="flex items-center gap-1.5 text-sub text-[10.5px] uppercase-tight hover:text-ink transition"
      >
        <Film size={12} strokeWidth={1.5} />
        <span className="hidden sm:inline">Watchlist</span>
      </button>
    </div>
  );
}