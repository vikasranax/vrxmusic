'use client';
import { Waves, Droplet, TreePine, Mountain, Gem, CloudRain, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { SCENE_ORDER } from '@/lib/scenes';

const ICONS = [Waves, Droplet, TreePine, Mountain, Gem, CloudRain];

export default function LeftRail() {
  const sceneId = useStore((s) => s.sceneId);
  const setSceneId = useStore((s) => s.setSceneId);
  const autoSync = useStore((s) => s.autoSync);
  const setAutoSync = useStore((s) => s.setAutoSync);

  return (
    <div className="absolute left-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4">
      {SCENE_ORDER.map((id, i) => {
        const Icon = ICONS[i] || Waves;
        const on = id === sceneId;
        return (
          <button key={id} title={id} onClick={() => { setSceneId(id); setAutoSync(false); }}
            className={`grid h-[46px] w-[46px] place-items-center rounded-full border backdrop-blur transition
            ${on ? 'border-accent/55 bg-accent/10 text-accent shadow-[0_0_22px_-6px_rgba(52,225,214,.5)]' : 'border-white/10 bg-[rgba(8,11,16,.5)] text-dim hover:text-ink hover:border-white/20'}`}>
            <Icon size={19} />
          </button>
        );
      })}
      <button title={autoSync ? 'Auto-sync ON' : 'Auto-sync OFF'} onClick={() => setAutoSync(!autoSync)}
        className={`grid h-[46px] w-[46px] place-items-center rounded-full border backdrop-blur transition
        ${autoSync ? 'border-accent/40 text-accent' : 'border-white/10 text-faint hover:text-dim'}`}>
        <Sparkles size={18} />
      </button>
    </div>
  );
}