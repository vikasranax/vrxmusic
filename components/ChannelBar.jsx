'use client';
import { CHANNELS } from '@/lib/playlistData';
import { useStore } from '@/lib/store';
import youtubeManager from '@/lib/youtubeManager';

export default function ChannelBar() {
  const channelId = useStore((s) => s.currentChannelId);

  return (
    <div className="absolute bottom-0 inset-x-0 z-[15] border-t border-white/[0.05] bg-panel/55 backdrop-blur-xl">
      <div className="no-scrollbar flex gap-5 sm:gap-6 overflow-x-auto px-5 sm:px-8 py-2.5 pb-4 sm:pb-3">
        {CHANNELS.map((c) => {
          const active = c.id === channelId;
          return (
            <button
              key={c.id}
              onClick={() => youtubeManager.playChannel(c.id)}
              className={`shrink-0 whitespace-nowrap text-[10px] uppercase tracking-[0.07em] pb-1 transition border-b
                ${active
                  ? 'text-ink border-accent'
                  : 'text-muted border-transparent hover:text-sub'}`}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}