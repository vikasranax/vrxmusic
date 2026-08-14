'use client';
import { useState } from 'react';
import { Waves, Droplet, TreePine, Mountain, Gem, CloudRain, Youtube, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { SCENE_ORDER, SCENES } from '@/lib/scenes';
import youtubeManager from '@/lib/youtubeManager';

const ICONS = { river: Waves, ocean: Droplet, forest: TreePine, mountain: Mountain, glacier: Gem, rain: CloudRain };

// bus & alka are channel-default backgrounds only — not manual rail buttons
const RAIL_SCENES = SCENE_ORDER.filter((id) => id !== 'bus' && id !== 'alka');

export default function LeftRail() {
  const sceneId = useStore((s) => s.sceneId);
  const setSceneId = useStore((s) => s.setSceneId);
  const bgMode = useStore((s) => s.bgMode);
  const setCustomBg = useStore((s) => s.setCustomBg);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [val, setVal] = useState('');

  const setImageBg = () => {
    const url = window.prompt('Paste image URL for background:');
    if (url?.trim()) setCustomBg(url.trim());
  };

  const go = () => {
    if (val.trim()) {
      youtubeManager.playUrl(val.trim());
      setVal('');
      setPasteOpen(false);
    }
  };

  return (
    <div className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2.5 sm:left-6 sm:gap-3">
      {RAIL_SCENES.map((id) => {
        const Icon = ICONS[id] || Waves;
        const active = id === sceneId && bgMode === 'scene';
        return (
          <div key={id} className="flex items-center gap-3">
            <button
              title={SCENES[id].name}
              onClick={() => setSceneId(id)}
              className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 sm:h-11 sm:w-11
              ${active
                ? 'border-[#34e1d6]/50 bg-[#34e1d6]/10 text-[#34e1d6] shadow-[0_0_20px_-4px_rgba(52,225,214,.4)]'
                : 'border-white/5 bg-[rgba(8,11,16,.4)] text-[#4a5568] hover:border-white/15 hover:text-[#8a97a6]'}`}
            >
              <Icon size={16} />
            </button>
            {active && (
              <span className="whitespace-nowrap text-[10px] font-medium tracking-wider text-[#8a97a6] sm:text-xs">
                {SCENES[id].name}
              </span>
            )}
          </div>
        );
      })}

      <div className="my-1 h-px w-10 bg-white/5" />

      {/* YouTube — paste link */}
      <div className="relative">
        <button
          onClick={() => setPasteOpen((o) => !o)}
          title="Paste YouTube link"
          className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition sm:h-11 sm:w-11
          ${pasteOpen
            ? 'border-red-400/50 bg-red-500/10 text-red-400'
            : 'border-white/5 bg-[rgba(8,11,16,.4)] text-[#4a5568] hover:border-white/15 hover:text-[#8a97a6]'}`}
        >
          {pasteOpen ? <X size={16} /> : <Youtube size={16} />}
        </button>

        {pasteOpen && (
          <div className="glass absolute bottom-0 left-12 flex w-64 items-center gap-2 rounded-xl border border-white/5 p-2 sm:w-72">
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && go()}
              placeholder="Paste YouTube URL…"
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-ink placeholder:text-[#3a4550] focus:outline-none"
            />
            <button
              onClick={go}
              className="rounded-lg bg-[#34e1d6] px-3 py-2 text-xs font-bold text-[#04181a] transition hover:bg-[#2bc4ba]"
            >
              Play
            </button>
          </div>
        )}
      </div>

      {/* custom image background */}
      {bgMode === 'image' ? (
        <button
          onClick={() => setSceneId('river')}
          title="Back to 3D scenes"
          className="grid h-10 w-10 place-items-center rounded-full border border-[#34e1d6]/30 bg-[#34e1d6]/10 text-[#34e1d6] backdrop-blur-md transition hover:bg-[#34e1d6]/20 sm:h-11 sm:w-11"
        >
          <X size={14} />
        </button>
      ) : (
        <button
          onClick={setImageBg}
          title="Set image background"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/5 bg-[rgba(8,11,16,.4)] text-[#4a5568] backdrop-blur-md transition hover:border-white/15 hover:text-[#8a97a6] sm:h-11 sm:w-11"
        >
          <ImageIcon size={14} />
        </button>
      )}
    </div>
  );
}