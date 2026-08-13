'use client';
import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import youtubeManager from '@/lib/youtubeManager';

const PasteUrl = forwardRef(function PasteUrl(_, ref) {
  const [val, setVal] = useState('');
  const [open, setOpen] = useState(false);

  const go = () => {
    if (val.trim()) {
      youtubeManager.playUrl(val.trim());
      setVal('');
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Paste YouTube URL"
        className="glass absolute bottom-24 right-7 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/5 text-[#4a5568] transition hover:text-[#8a97a6] sm:h-12 sm:w-12"
      >
        {open ? <X size={18} /> : <span className="text-lg font-light">+</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass absolute bottom-40 right-7 z-30 flex w-72 items-center gap-2 rounded-xl border border-white/5 p-2 sm:w-80"
          >
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && go()}
              placeholder="Paste YouTube URL..."
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-ink placeholder:text-[#3a4550] focus:outline-none"
            />
            <button
              onClick={go}
              className="rounded-lg bg-[#34e1d6] px-4 py-2 text-xs font-bold text-[#04181a] transition hover:bg-[#2bc4ba]"
            >
              Play
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
export default PasteUrl;