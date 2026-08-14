export const FALLBACK_QUEUE = [
  'jfKfPfyJRdk', 'DWcJFNfaw9c', 'rUxyKA_-grg', '5qap5aO4i9A', 'lTRiuFIWV54',
];

export const CHANNELS = [
  { id: 'bollywood', name: 'Indian Bus Driver', playlistId: 'PLVPt7YJKnZJALtkfMhJCuI2jWkaM_jwn8', seed: [],
    bg: '' }, // ← HOW TO ADD CUSTOM BACKGROUND: put '/bus.jpg' (file in /public) or a full https image URL
  { id: 'alka', name: 'Alka Nostalgia', playlistId: 'PLVPt7YJKnZJAeL4Qbh0Vx4-V208-hbGMZ', seed: [],
    bg: '' }, // ← e.g. '/alka.png'
  { id: 'bhojpuri', name: 'Bhojpuri Hits', playlistId: 'PLVPt7YJKnZJDA5lulZ5tFuQ5Jwxu-0U2B', seed: [], bg: '' },
  { id: 'remix', name: 'Remix', playlistId: 'PLG0iubOE1GCk', seed: [], bg: '' },
  { id: 'pop', name: 'Global Pop', playlistId: 'PLVPt7YJKnZJCUE9WQ0ffocb0NJJ5sHjcS', seed: [], bg: '' },
  { id: 'lofi', name: 'Lo-Fi Beats', playlistId: 'PLEPY8NcNUpYY', seed: [
    'jfKfPfyJRdk', 'DWcJFNfaw9c', 'lTRiuFIWV54', 'rUxyKA_-grg',
  ], bg: '' },
];

export const getChannel = (id) => CHANNELS.find((c) => c.id === id);