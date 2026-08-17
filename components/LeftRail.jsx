'use client';
import { Waves, Circle, MountainSnow, TreePine, Mountain, CloudRain, Bus, Mic } from 'lucide-react';
import { useStore } from '@/lib/store';

const SCENES = [
  { id: 'river',    icon: Waves,        label: 'River'    },
  { id: 'ocean',    icon: Circle,       label: 'Ocean'    },
  { id: 'glacier',  icon: MountainSnow, label: 'Glacier'  },
  { id: 'forest',   icon: TreePine,     label: 'Forest'   },
  { id: 'mountain', icon: Mountain,     label: 'Mountain' },
  { id: 'rain',     icon: CloudRain,    label: 'Rain'     },
];
const EXTRAS = [
  { id: 'bus',  icon: Bus, label: 'Bus'  },
  { id: 'alka', icon: Mic, label: 'Alka' },
];

function RailButton({ scene, sceneId, setSceneId }) {
  const Icon = scene.icon;
  const active = sceneId === scene.id;
  return (
    <button
      onClick={() => setSceneId(scene.id)}
      className="group flex items-center gap-2.5"
      aria-label={scene.label}
    >
      <span className={`grid h-4 w-4 place-items-center transition ${active ? 'text-accent' : 'text-muted group-hover:text-sub'}`}>
        <Icon size={14} strokeWidth={1.5} />
      </span>
      {active && (
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
          {scene.label}
        </span>
      )}
    </button>
  );
}

export default function LeftRail() {
  const sceneId = useStore((s) => s.sceneId);
  const setSceneId = useStore((s) => s.setSceneId);

  return (
    <>
      {/* Desktop rail */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[15] hidden md:flex flex-col gap-5">
        {SCENES.map((s) => (
          <RailButton key={s.id} scene={s} sceneId={sceneId} setSceneId={setSceneId} />
        ))}
        <span className="ml-2 h-4 w-px bg-white/[0.08]" />
        {EXTRAS.map((s) => (
          <RailButton key={s.id} scene={s} sceneId={sceneId} setSceneId={setSceneId} />
        ))}
      </div>

      {/* Mobile: horizontal scene dots */}
      <div className="absolute top-[66px] left-0 right-0 z-[15] flex md:hidden justify-center gap-4">
        {[...SCENES, ...EXTRAS].map((s) => {
          const Icon = s.icon;
          const active = sceneId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSceneId(s.id)}
              className={`${active ? 'text-accent' : 'text-muted'} transition`}
              aria-label={s.label}
            >
              <Icon size={13} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </>
  );
}