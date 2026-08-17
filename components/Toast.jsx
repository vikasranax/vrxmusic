'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

export default function Toast() {
  const msg = useStore((s) => s.toast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!msg) { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, [msg]);

  if (!visible) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-panel border border-white/[0.08] backdrop-blur-xl text-[11px] uppercase tracking-[0.08em] text-sub">
      {msg}
    </div>
  );
}