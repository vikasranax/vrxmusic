export const SCENES = {
  river:    { name: 'Flowing River',     wire: '#1f6f8b', fog: '#06222e', amp: 0.35, speed: 0.60, density: 0.045 },
  ocean:    { name: 'Open Ocean',        wire: '#155e75', fog: '#04182a', amp: 0.70, speed: 0.95, density: 0.030 },
  forest:   { name: 'Deep Forest',       wire: '#1f7a4d', fog: '#06180f', amp: 0.25, speed: 0.40, density: 0.060 },
  valley:   { name: 'Lush Valley',       wire: '#3f8f3f', fog: '#0a1a0c', amp: 0.30, speed: 0.50, density: 0.050 },
  glacier:  { name: 'Glacier & Ice',     wire: '#7fb7d6', fog: '#081820', amp: 0.20, speed: 0.30, density: 0.040 },
  mountain: { name: 'Snowy Peaks',       wire: '#9fb3c8', fog: '#0a1018', amp: 0.50, speed: 0.35, density: 0.035 },
};

export const SCENE_ORDER = ['river', 'ocean', 'forest', 'mountain', 'glacier', 'valley'];

export const CHANNEL_SCENE = {
  bollywood: 'river', alka: 'river', bhojpuri: 'valley',
  edm: 'glacier', pop: 'ocean', lofi: 'forest',
};