'use client';
export default function Wordmark() {
  return (
    <div className="absolute left-6 top-5 z-20 flex items-center gap-3 select-none sm:left-8 sm:top-7 sm:gap-4">
      <img
        src="/logo.png"
        alt="VRX"
        className="h-8 w-auto object-contain sm:h-10"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div>
        <div className="font-display font-light uppercase tracking-[0.3em] text-[clamp(16px,2.2vw,26px)] text-[#cfd6dd]">
          VRX Music
        </div>
        <div className="mt-0.5 font-display text-[10px] uppercase tracking-[0.34em] text-faint sm:mt-1 sm:text-[11px]">
          Personal Sound Sanctuary
        </div>
      </div>
    </div>
  );
}