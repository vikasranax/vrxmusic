'use client';
import { Waves, Droplet, TreePine, Mountain, Gem, CloudRain, Image as ImageIcon, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { SCENE_ORDER, SCENES } from '@/lib/scenes';

const ICONS = [Waves, Droplet, TreePine, Mountain, Gem, CloudRain];

export default function LeftRail() {
  const sceneId = useStore((s) => s.sceneId);
  const setSceneId = useStore((s) => s.setSceneId);
  const bgMode = useStore((s) => s.bgMode);
  const setCustomBg = useStore((s) => s.setCustomBg);

  const setImageBg = () => {
    const url = window.prompt('Paste image URL for background:');
    if (url?.trim()) setCustomBg(url.trim());
  };

  const clearImage = () => setSceneId('river');

  return (
    <div className="absolute left-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 sm:left-6 sm:gap-4">
      {SCENE_ORDER.map((id, i) => {
        const Icon = ICONS[i] || Waves;
        const active = id === sceneId && bgMode === 'scene';
        return (
          <div key={id} className="flex items-center gap-3">
            <button
              title={id}
              onClick={() => setSceneId(id)}
              className={`grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 sm:h-12 sm:w-12
              ${active
                  ? 'border-[#34e1d6]/50 bg-[#34e1d6]/10 text-[#34e1d6] shadow-[0_0_20px_-4px_rgba(52,225,214,.4)]'
                  : 'border-white/5 bg-[rgba(8,11,16,.4)] text-[#4a5568] hover:border-white/15 hover:text-[#8a97a6]'
              }`}
            >
              <Icon size={18} />
            </button>
            {active && (
              <span className="whitespace-nowrap text-[11px] font-medium tracking-wider text-[#8a97a6] sm:text-xs">
                {SCENES[id].name}
              </span>
            )}
          </div>
        );
      })}

      <div className="my-1 h-px w-10 bg-white/5" />

      {bgMode === 'image' ? (
        <button onClick={clearImage} title="Back to 3D"
          className="grid h-11 w-11 place-items-center rounded-full border border-[#34e1d6]/30 bg-[#34e1d6]/10 text-[#34e1d6] backdrop-blur-md transition hover:bg-[#34e1d6]/20 sm:h-12 sm:w-12">
          <X size={16} />
        </button>
      ) : (
        <button onClick={setImageBg} title="Set image background"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/5 bg-[rgba(8,11,16,.4)] text-[#4a5568] backdrop-blur-md transition hover:border-white/15 hover:text-[#8a97a6] sm:h-12 sm:w-12">
          <ImageIcon size={16} />
        </button>
      )}
    </div>
  );
}