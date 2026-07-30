export const FALLBACK_QUEUE = [
  'kJQP7kiw5Fk', 'RgKAFK5djSk', 'OPf0YbXqDm0', 'JGwWNGJdvx8', 'fRh_vgS2dFE',
  'CevxZvSJLk8', 'hT_nvWreIhg', 'YQHsXMglC9A', 'pRpeEdMmmQ0', '9bZkp7q19f0',
];

export const CHANNELS = [
  { id: 'bollywood', name: 'Bollywood Essentials', playlistId: '', seed: [] },
  { id: 'alka',      name: 'Alka Nostalgia',       playlistId: '', seed: [] },
  { id: 'bhojpuri',  name: 'Bhojpuri Hits',        playlistId: '', seed: [] },
  { id: 'edm',       name: 'EDM Chill',            playlistId: '', seed: [] },
  { id: 'pop',       name: 'Global Pop',           playlistId: '', seed: [] },
  { id: 'lofi',      name: 'Lo-Fi Beats',          playlistId: '', seed: [] },
];

export const getChannel = (id) => CHANNELS.find((c) => c.id === id);