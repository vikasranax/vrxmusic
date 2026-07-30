'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trash2, Download, Upload, Tv } from 'lucide-react';
import { useStore } from '@/lib/store';
import { img, imgOrig, providers, tvProviders } from '@/lib/tmdbApi';
import { drawer } from '@/lib/motion';
import { exportLists, importLists } from '@/lib/storage';

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className={n <= value ? 'text-accent' : 'text-faint'}>
          <Star size={14} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

function Row({ m, list }) {
  const setRating = useStore((s) => s.setRating);
  const removeMovie = useStore((s) => s.removeMovie);
  const [prov, setProv] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setOpen((o) => !o);
    if (!prov) {
      const data = m.mediaType === 'tv' ? await tvProviders(m.id) : await providers(m.id);
      setProv(data);
    }
  };
  const logos = prov ? [...(prov.flatrate || []), ...(prov.rent || []), ...(prov.buy || [])] : [];

  return (
    <div className="border-b border-white/6 py-3">
      <div className="flex items-center gap-3">
        <img src={img(m.poster, 'w92')} alt="" className="h-14 w-10 flex-none rounded object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{m.title}</div>
          <div className="text-[11px] text-faint">{m.year}</div>
          {list === 'watched' && <div className="mt-1"><Stars value={m.rating || 0} onChange={(r) => setRating(m.id, r)} /></div>}
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={load} title="Where to watch" className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-dim hover:text-accent"><Tv size={14} /></button>
          <button onClick={() => removeMovie(list, m.id)} title="Remove" className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-dim hover:text-red-300"><Trash2 size={14} /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-2 flex flex-wrap items-center gap-2 pl-[52px]">
              {logos.length ? logos.map((p) => (
                <img key={p.provider_id} src={imgOrig(p.logo_path)} title={p.provider_name} className="h-7 w-7 rounded border border-white/10 object-cover" />
              )) : <span className="text-[11px] text-faint">No providers in your region.</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MovieDrawer() {
  const open = useStore((s) => s.trackerOpen);
  const setOpen = useStore((s) => s.setTrackerOpen);
  const watchlist = useStore((s) => s.watchlist);
  const watched = useStore((s) => s.watched);
  const setLists = useStore((s) => s.setLists);
  const setToast = useStore((s) => s.setToast);
  const [tab, setTab] = useState('watchlist');
  const list = tab === 'watchlist' ? watchlist : watched;

  const onImport = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try { const data = await importLists(f); setLists(data); setToast('Lists imported'); }
    catch { setToast('Import failed'); }
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <motion.aside variants={drawer} initial="hidden" animate="show" exit="hidden"
            className="glass thin-scroll fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/8 p-5">
              <div>
                <div className="font-display text-lg tracking-[0.2em] text-accent">INDRISMA</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-faint">my lists</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => exportLists({ watchlist, watched })} title="Export" className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-dim hover:text-accent"><Download size={15} /></button>
                <label title="Import" className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-white/10 text-dim hover:text-accent"><Upload size={15} /><input type="file" accept="application/json" className="hidden" onChange={onImport} /></label>
                <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-dim hover:text-ink"><X size={15} /></button>
              </div>
            </div>

            <div className="flex gap-2 p-4">
              {['watchlist', 'watched'].map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${tab === t ? 'bg-accent text-accent-ink' : 'bg-white/5 text-dim'}`}>
                  {t} ({t === 'watchlist' ? watchlist.length : watched.length})
                </button>
              ))}
            </div>

            <div className="px-5 pb-8">
              {list.length ? list.map((m) => <Row key={`${m.mediaType || 'movie'}-${m.id}`} m={m} list={tab} />)
                : <p className="py-10 text-center text-sm text-faint">Nothing here yet — add movies or shows from the INDRISMA view.</p>}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}