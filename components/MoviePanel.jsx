'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Check, Star, Trash2, Clock, Calendar, Info } from 'lucide-react';
import * as tmdb from '@/lib/tmdbApi';
import { useStore } from '@/lib/store';
import { img, imgOrig } from '@/lib/tmdbApi';

const TABS = [
  { id: 'search', label: 'Search' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'watched', label: 'Watched' },
];

export default function MoviePanel() {
  const open = useStore((s) => s.panelOpen);
  const setOpen = useStore((s) => s.setPanelOpen);
  const watchlist = useStore((s) => s.watchlist);
  const watched = useStore((s) => s.watched);
  const addToWatchlist = useStore((s) => s.addToWatchlist);
  const markWatched = useStore((s) => s.markWatched);
  const removeMovie = useStore((s) => s.removeMovie);
  const inList = useStore((s) => s.inList);
  const syncKey = useStore((s) => s.syncKey);
  const setSyncKey = useStore((s) => s.setSyncKey);
  const pullFromCloud = useStore((s) => s.pullFromCloud);
  const generateSyncKey = useStore((s) => s.generateSyncKey);
  const setToast = useStore((s) => s.setToast);

  const [tab, setTab] = useState('search');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailProv, setDetailProv] = useState(null);

  useEffect(() => {
    if (!open || tab !== 'search') return;
    let alive = true;
    setLoading(true);
    tmdb.trending()
      .then((r) => alive && setRows((r.results || []).map(tmdb.toMini)))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [open, tab]);

  useEffect(() => {
    if (!query.trim() || tab !== 'search') return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await tmdb.search(query);
        setRows((r.results || []).map(tmdb.toMini));
      } catch {}
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, tab]);

  const openDetail = async (m) => {
    setDetail(m);
    setDetailData(null);
    setDetailProv(null);
    try {
      const [data, provData] = await Promise.all([
        tmdb.details(m.id),
        tmdb.providers(m.id),
      ]);
      setDetailData(data);
      setDetailProv(provData);
    } catch (e) {
      console.log('Detail fetch error:', e);
    }
  };

  const handleOpenKey = () => {
    if (keyInput.trim().length >= 8) {
      setSyncKey(keyInput.trim());
      pullFromCloud().then(() => setToast('Watchlist synced'));
    } else {
      const newKey = generateSyncKey();
      setToast(`Your key: ${newKey}`);
      window.prompt('Copy this key to use on other devices:', newKey);
    }
  };

  const list = tab === 'watchlist' ? watchlist : tab === 'watched' ? watched : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass fixed right-3 top-3 z-50 flex h-[calc(100dvh-24px)] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a0d12]/90 sm:right-5 sm:top-5 sm:h-[calc(100dvh-40px)] sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${tab === t.id ? 'text-ink' : 'text-[#4a5568] hover:text-[#8a97a6]'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} className="text-[#4a5568] transition hover:text-ink">
                <X size={18} />
              </button>
            </div>

            {/* Key Sync */}
            <div className="border-b border-white/5 px-5 py-4">
              <p className="text-[11px] leading-relaxed text-[#4a5568]">
                Use the same private key on any browser to access this watchlist. Keep it somewhere safe.
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter a private key (8+ characters)"
                  className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-ink placeholder:text-[#3a4550] focus:outline-none focus:ring-1 focus:ring-[#34e1d6]/30"
                />
                <button
                  onClick={handleOpenKey}
                  className="rounded-lg bg-[#34e1d6] px-4 py-2 text-xs font-bold text-[#04181a] transition hover:bg-[#2bc4ba]"
                >
                  {keyInput.trim().length >= 8 ? 'Open' : 'Create'}
                </button>
              </div>
              {syncKey && <p className="mt-1.5 text-[10px] text-[#34e1d6]/70">Active key: {syncKey}</p>}
            </div>

            {/* Search */}
            {tab === 'search' && (
              <div className="border-b border-white/5 px-5 py-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full rounded-lg bg-white/5 py-2 pl-9 pr-4 text-xs text-ink placeholder:text-[#3a4550] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="thin-scroll flex-1 overflow-y-auto px-5 py-4">
              {tab === 'search' && (
                <>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#4a5568]">Trending this week</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-white/5" />)
                      : rows.map((m) => <MovieItem key={m.id} m={m} onClick={() => openDetail(m)} />)}
                  </div>
                </>
              )}

              {tab !== 'search' && (
                <div className="flex flex-col gap-2">
                  {list.length ? (
                    list.map((m) => <ListRow key={m.id} m={m} list={tab} onClick={() => openDetail(m)} />)
                  ) : (
                    <p className="py-10 text-center text-xs text-[#4a5568]">Nothing here yet.</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* DETAIL MODAL */}
          <DetailModal
            detail={detail}
            onClose={() => setDetail(null)}
            detailData={detailData}
            detailProv={detailProv}
            inList={inList}
            addToWatchlist={addToWatchlist}
            markWatched={markWatched}
          />
        </>
      )}
    </AnimatePresence>
  );
}

function MovieItem({ m, onClick }) {
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-lg text-left">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-black/40">
        {m.poster ? (
          <img src={img(m.poster, 'w342')} alt={m.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center text-[10px] text-[#4a5568]">no poster</div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="truncate text-[10px] font-semibold text-ink">{m.title}</p>
      </div>
    </button>
  );
}

function ListRow({ m, list, onClick }) {
  const removeMovie = useStore((s) => s.removeMovie);
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-lg bg-white/[0.02] p-2 text-left transition hover:bg-white/[0.04]">
      <img src={img(m.poster, 'w92')} alt="" className="h-16 w-11 flex-none rounded object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-ink">{m.title}</p>
        <p className="text-[10px] text-[#4a5568]">{m.year}</p>
      </div>
      <div onClick={(e) => { e.stopPropagation(); removeMovie(list, m.id); }} className="text-[#4a5568] hover:text-red-300">
        <Trash2 size={12} />
      </div>
    </button>
  );
}

function DetailModal({ detail, onClose, detailData, detailProv, inList, addToWatchlist, markWatched }) {
  if (!detail) return null;
  const st = inList(detail.id);
  const allProv = detailProv ? [...(detailProv.flatrate || []), ...(detailProv.rent || []), ...(detailProv.buy || [])] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f14] shadow-2xl"
      >
        {/* Backdrop */}
        <div className="relative h-48 w-full overflow-hidden sm:h-56">
          {detailData?.backdrop_path ? (
            <img src={imgOrig(detailData.backdrop_path)} alt="" className="h-full w-full object-cover opacity-50" />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-[#1a2330] to-[#0c0f14]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f14] via-[#0c0f14]/40 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-ink backdrop-blur transition hover:bg-black/70">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="relative -mt-16 px-6 pb-6">
          <div className="flex gap-4">
            <img src={img(detail.poster, 'w342')} alt={detail.title} className="h-32 w-22 flex-none rounded-lg object-cover shadow-lg sm:h-40" />
            <div className="mt-16 flex-1">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">{detail.title}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#8a97a6]">
                {detail.year && <span className="flex items-center gap-1"><Calendar size={11} />{detail.year}</span>}
                {detailData?.runtime > 0 && <span className="flex items-center gap-1"><Clock size={11} />{Math.floor(detailData.runtime / 60)}h {detailData.runtime % 60}m</span>}
                {detail.rating && <span className="flex items-center gap-1 text-[#f5c518]"><Star size={11} fill="currentColor" />{detail.rating.toFixed(1)}</span>}
              </div>
              {detailData?.tagline && <p className="mt-2 text-sm italic text-[#34e1d6]/80">"{detailData.tagline}"</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => addToWatchlist(detail)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${st.watchlist ? 'bg-[#34e1d6] text-[#04181a]' : 'bg-white/10 text-ink hover:bg-white/15'}`}
            >
              {st.watchlist ? <Check size={14} /> : <Plus size={14} />} Watchlist
            </button>
            <button
              onClick={() => markWatched(detail, 0)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${st.watched ? 'bg-[#34e1d6] text-[#04181a]' : 'bg-white/10 text-ink hover:bg-white/15'}`}
            >
              {st.watched ? <Check size={14} /> : <Star size={14} />} Mark Watched
            </button>
          </div>

          {/* Overview */}
          {detailData?.overview && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink">Overview</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8a97a6]">{detailData.overview}</p>
            </div>
          )}

          {/* Genres */}
          {detailData?.genres?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-ink">Genres</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {detailData.genres.map((g) => (
                  <span key={g.id} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-[#8a97a6]">{g.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Streaming on */}
          <div className="mt-5">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Info size={13} className="text-[#4a5568]" /> Streaming on
            </h3>
            {allProv.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {allProv.map((p) => (
                  <div key={p.provider_id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                    <img src={imgOrig(p.logo_path)} title={p.provider_name} className="h-6 w-6 rounded object-cover" />
                    <span className="text-[11px] text-[#8a97a6]">{p.provider_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[#4a5568]">No streaming info available for your region.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}