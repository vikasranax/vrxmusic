'use client';
import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import youtubeManager from '@/lib/youtubeManager';

const PasteUrl = forwardRef(function PasteUrl(_, ref) {
  const [val, setVal] = useState('');
  const go = () => { if (val.trim()) { youtubeManager.playUrl(val.trim()); setVal(''); } };
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
      className="glass absolute bottom-24 right-24 z-20 flex items-center gap-2 rounded-full py-2 pl-5 pr-2">
      <input value={val} onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        placeholder="Paste YouTube URL…"
        className="w-44 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none sm:w-52" />
      <button onClick={go} className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-ink transition hover:bg-accent-deep">Play</button>
    </motion.div>
  );
});
export default PasteUrl;