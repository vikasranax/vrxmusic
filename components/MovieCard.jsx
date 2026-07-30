'use client';
import { Plus, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { img } from '@/lib/tmdbApi';
import { useStore } from '@/lib/store';
import { cardHover } from '@/lib/motion';

export default function MovieCard({ m, onOpen }) {
  const inList = useStore((s) => s.inList);
  const addToWatchlist = useStore((s) => s.addToWatchlist);
  const markWatched = useStore((s) => s.markWatched);
  const st = inList(m.id);

  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover"
      className="group relative overflow-hidden rounded-xl border border-white/8 bg-panel">
      <button onClick={() => onOpen(m)} className="block w-full">
        <div className="aspect-[2/3] w-full overflow-hidden bg-black/40">
          {m.poster ? <img src={img(m.poster, 'w342')} alt={m.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            : <div className="grid h-full place-items-center text-faint">no poster</div>}
        </div>
      </button>
      <div className="p-2.5">
        <div className="truncate text-[13px] font-semibold">{m.title}</div>
        <div className="text-[11px] text-faint">{m.year || '—'}</div>
      </div>
      <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
        <button title="Watchlist" onClick={() => addToWatchlist(m)}
          className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur ${st.watchlist ? 'bg-accent text-accent-ink' : 'bg-black/60 text-ink'}`}>
          {st.watchlist ? <Check size={15} /> : <Plus size={15} />}
        </button>
        <button title="Mark watched" onClick={() => markWatched(m, 0)}
          className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur ${st.watched ? 'bg-accent text-accent-ink' : 'bg-black/60 text-ink'}`}>
          <Star size={15} fill={st.watched ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  );
}