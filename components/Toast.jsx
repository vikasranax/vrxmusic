'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/lib/store';

export default function Toast() {
  const toast = useStore((s) => s.toast);
  const setToast = useStore((s) => s.setToast);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); } }, [toast]);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="glass fixed bottom-28 left-1/2 z-[60] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm text-ink">
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}