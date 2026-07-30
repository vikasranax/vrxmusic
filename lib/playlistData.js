export const FALLBACK_QUEUE = [
  'kJQP7kiw5Fk', 'RgKAFK5djSk', 'OPf0YbXqDm0', 'JGwWNGJdvx8', 'fRh_vgS2dFE',
  'CevxZvSJLk8', 'hT_nvWreIhg', 'YQHsXMglC9A', 'pRpeEdMmmQ0', '9bZkp7q19f0',
];

export const CHANNELS = [
  { id: 'bollywood', name: 'Bollywood Essentials', playlistId: 'PLVPt7YJKnZJALtkfMhJCuI2jWkaM_jwn8', seed: [] },
  { id: 'alka',      name: 'Alka Nostalgia',       playlistId: 'PLVPt7YJKnZJAeL4Qbh0Vx4-V208-hbGMZ', seed: [] },
  { id: 'bhojpuri',  name: 'Bhojpuri Hits',        playlistId: 'PLVPt7YJKnZJDA5lulZ5tFuQ5Jwxu-0U2B', seed: [] },
  { id: 'edm',       name: 'Mu2ic',                playlistId: 'PLVPt7YJKnZJCUE9WQ0ffocb0NJJ5sHjcS', seed: [] },
  { id: 'pop',       name: 'Remix',                playlistId: 'PLG0iubOE1GCk', seed: [] },
  { id: 'lofi',      name: 'Lo-Fi Beats',          playlistId: 'PLEPY8NcNUpYY', seed: [] },
];

export const getChannel = (id) => CHANNELS.find((c) => c.id === id);