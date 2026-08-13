'use client';
export default function Wordmark() {
  return (
    <div className="absolute left-6 top-5 z-20 select-none sm:left-8 sm:top-6">
      <div className="font-display text-[clamp(22px,3vw,36px)] font-light uppercase tracking-[0.35em] text-[#9aa5b1]">
        AETHERIA
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.45em] text-[#4a5568] sm:text-[11px]">
        VRX MUSIC
      </div>
    </div>
  );
}