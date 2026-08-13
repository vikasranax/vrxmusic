export const SCENES = {
  river:    { name: 'Flowing River',  wire: '#1a5a6e', fog: '#050a0f', amp: 0.30, speed: 0.55, density: 0.050 },
  ocean:    { name: 'Open Ocean',     wire: '#0f3a52', fog: '#03080f', amp: 0.60, speed: 0.85, density: 0.035 },
  forest:   { name: 'Deep Forest',    wire: '#1a5a3a', fog: '#040a06', amp: 0.20, speed: 0.35, density: 0.065 },
  mountain: { name: 'Snowy Peaks',    wire: '#5a7a8a', fog: '#080c12', amp: 0.45, speed: 0.30, density: 0.040 },
  glacier:  { name: 'Glacier',        wire: '#4a7a9a', fog: '#060a10', amp: 0.15, speed: 0.25, density: 0.045 },
  rain:     { name: 'Midnight Rain',  wire: '#3a5a7a', fog: '#04060a', amp: 0.12, speed: 0.80, density: 0.075 },
};

export const SCENE_ORDER = ['river', 'ocean', 'forest', 'mountain', 'glacier', 'rain'];

export const CHANNEL_SCENE = {
  bollywood: 'river', alka: 'river', bhojpuri: 'forest',
  edm: 'glacier', pop: 'ocean', lofi: 'forest',
};