'use client';
import { useEffect, useState } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';

export default function MoviePanel({ open, onClose }) {
  const [tab, setTab] = useState('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(() => setResults([]), 300); // hook your TMDB search here
    return () => clearTimeout(t);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[50] md:inset-auto md:right-3 md:top-3 md:bottom-24 md:w-[270px] md:z-[30]">
      <div className="md:hidden absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 bottom-0 md:inset-0 w-full md:w-auto flex flex-col bg-panel-strong backdrop-blur-2xl border-l md:border border-white/[0.06] rounded-none md:rounded-[10px] overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-[18px] pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex gap-4">
            {['search', 'watchlist', 'watched'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-[11px] uppercase tracking-[0.08em] pb-1 transition border-b
                  ${tab === t ? 'text-ink border-accent' : 'text-muted border-transparent hover:text-sub'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition"><X size={14} /></button>
        </div>

        <div className="mx-4 sm:mx-[18px] mt-3 flex items-center gap-1.5 text-[9.5px] text-muted">
          <span className="h-[5px] w-[5px] rounded-full bg-accent" />
          Synced across devices — key active
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-[18px] py-3">
          {tab === 'search' && (
            <div className="relative mb-3">
              <SearchIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search films…"
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-md pl-7 pr-3 py-1.5 text-[11px] text-ink placeholder:text-muted focus:outline-none focus:border-accent/40"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-[5px] bg-gradient-to-br from-[#20242a] to-[#12141a] border border-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}