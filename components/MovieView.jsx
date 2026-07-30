'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListVideo, Tv, Film } from 'lucide-react';
import * as tmdb from '@/lib/tmdbApi';
import { useStore } from '@/lib/store';
import { viewSwap } from '@/lib/motion';
import MovieCard from './MovieCard';

const MOVIE_TABS = [
  { id: 'trending', label: 'Top Trending', fn: tmdb.trending },
  { id: 'latest', label: 'Latest Release', fn: tmdb.latest },
  { id: 'upcoming', label: 'Upcoming', fn: tmdb.upcoming },
];

const TV_TABS = [
  { id: 'tvTrending', label: 'TV Trending', fn: tmdb.trendingTv },
  { id: 'tvPopular', label: 'TV Popular', fn: tmdb.popularTv },
  { id: 'tvTop', label: 'TV Top Rated', fn: tmdb.topRatedTv },
];

export default function MovieView() {
  const setTrackerOpen = useStore((s) => s.setTrackerOpen);
  const setToast = useStore((s) => s.setToast);
  const [mediaType, setMediaType] = useState('movie');
  const [tab, setTab] = useState('trending');
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const tabs = mediaType === 'movie' ? MOVIE_TABS : TV_TABS;

  // reset tab when switching movie/tv
  useEffect(() => {
    setTab(tabs[0].id);
  }, [mediaType]);

  // search
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        if (mediaType === 'movie') {
          const r = await tmdb.search(query);
          setRows((r.results || []).map(tmdb.toMini));
        } else {
          const r = await tmdb.searchTv(query);
          setRows((r.results || []).map(tmdb.toMiniTv));
        }
      } catch { setToast('Search failed'); }
      setLoading(false);
    }, 320);
    return () => clearTimeout(t);
  }, [query, mediaType]);

  // browse tabs
  useEffect(() => {
    if (query.trim()) return;
    let alive = true;
    setLoading(true);

    const current = tabs.find((t) => t.id === tab) || tabs[0];
    current.fn()
      .then((r) => {
        if (!alive) return;
        const mapper = mediaType === 'movie' ? tmdb.toMini : tmdb.toMiniTv;
        setRows((r.results || []).map(mapper));
      })
      .catch(() => alive && setToast('Could not load'))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [tab, mediaType, query]);

  return (
    <motion.div key="indrisma" variants={viewSwap} initial="initial" animate="animate" exit="exit"
      className="thin-scroll absolute inset-0 z-10 overflow-y-auto px-6 pb-28 pt-7 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="font-display text-2xl tracking-[0.3em] text-[#cfd6dd]">INDRISMA</div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-faint">minimal movie & tv tracker</div>
          </div>
          <div className="relative ml-auto w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${mediaType === 'movie' ? 'films' : 'shows'}…`}
              className="glass w-full rounded-full py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-faint focus:outline-none" />
          </div>
          <button onClick={() => setTrackerOpen(true)}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/50">
            <ListVideo size={16} /> My Lists
          </button>
        </div>

        {/* Movies / TV Toggle */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <button onClick={() => setMediaType('movie')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${mediaType === 'movie' ? 'bg-accent text-accent-ink' : 'text-dim hover:text-ink'}`}>
              <Film size={14} /> Movies
            </button>
            <button onClick={() => setMediaType('tv')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${mediaType === 'tv' ? 'bg-accent text-accent-ink' : 'text-dim hover:text-ink'}`}>
              <Tv size={14} /> TV Shows
            </button>
          </div>
        </div>

        {!query && (
          <div className="mt-4 flex gap-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${tab === t.id ? 'bg-accent text-accent-ink' : 'glass text-dim hover:text-ink'}`}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading ? Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
          )) : rows.map((m) => (
            <MovieCard key={`${mediaType}-${m.id}`} m={m} onOpen={() => {}} />
          ))}
        </div>
        {!loading && !rows.length && <p className="py-16 text-center text-sm text-faint">No results.</p>}
      </div>
    </motion.div>
  );
}