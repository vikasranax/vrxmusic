// Replace these IDs with your own YouTube video IDs. 
// These are popular lofi/live tracks that usually stay up.
export const FALLBACK_QUEUE = [
  'jfKfPfyJRdk', // lofi girl radio
  'DWcJFNfaw9c', // chill beats
  'rUxyKA_-grg', // lofi mix
  '5qap5aO4i9A', // study beats
  'lTRiuFIWV54', // relax lofi
];

export const CHANNELS = [
  { id: 'bollywood', name: 'Bollywood Essentials', playlistId: 'PLVPt7YJKnZJALtkfMhJCuI2jWkaM_jwn8', seed: [] },
  { id: 'alka',      name: 'Alka Nostalgia',       playlistId: 'PLVPt7YJKnZJAeL4Qbh0Vx4-V208-hbGMZ', seed: [] },
  { id: 'bhojpuri',  name: 'Bhojpuri Hits',        playlistId: 'PLVPt7YJKnZJDA5lulZ5tFuQ5Jwxu-0U2B', seed: [] },
  { id: 'remix',     name: 'Remix',                playlistId: 'PLG0iubOE1GCk', seed: [] },
  { id: 'pop',       name: 'Global Pop',           playlistId: 'PLVPt7YJKnZJCUE9WQ0ffocb0NJJ5sHjcS', seed: [] },
  { id: 'lofi',      name: 'Lo-Fi Beats',          playlistId: 'PLEPY8NcNUpYY', seed: [
    'jfKfPfyJRdk', // English lofi radio
    'DWcJFNfaw9c', // English chill
    'lTRiuFIWV54', // Hindi lofi mix (replace with real ID if needed)
    'rUxyKA_-grg', // Bhojpuri/Desi lofi (replace with real ID if needed)
  ]},
];

export const getChannel = (id) => CHANNELS.find((c) => c.id === id);