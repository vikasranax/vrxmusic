const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const REGION = process.env.NEXT_PUBLIC_TMDB_REGION || 'IN';
const BASE = 'https://api.themoviedb.org/3';

async function get(path, params = {}) {
  if (!KEY) throw new Error('Missing NEXT_PUBLIC_TMDB_API_KEY');
  const qs = new URLSearchParams({ api_key: KEY, ...params });
  const r = await fetch(`${BASE}${path}?${qs}`);
  if (!r.ok) throw new Error('TMDB ' + r.status);
  return r.json();
}

export const img = (p, w = 'w500') => (p ? `https://image.tmdb.org/t/p/${w}${p}` : null);
export const imgOrig = (p) => (p ? `https://image.tmdb.org/t/p/original${p}` : null);

// ── Movies ─────────────────────────────────────────────
export const trending = () => get('/trending/movie/week');
export const latest = () => get('/movie/now_playing');
export const upcoming = () => get('/movie/upcoming');
export const search = (q) => get('/search/movie', { query: q });
export const details = (id) => get(`/movie/${id}`);          // ← was missing (streaming bug)

// ── TV Shows / Series ──────────────────────────────────
export const trendingTv = () => get('/trending/tv/week');
export const popularTv = () => get('/tv/popular');
export const topRatedTv = () => get('/tv/top_rated');
export const onTheAirTv = () => get('/tv/on_the_air');
export const searchTv = (q) => get('/search/tv', { query: q });
export const detailsTv = (id) => get(`/tv/${id}`);           // ← for series detail modal

// ── Watch providers (falls back to US if region empty) ──
function pick(data) {
  const r = (data.results && (data.results[REGION] || data.results.US)) || null;
  if (!r) return { flatrate: [], rent: [], buy: [] };
  const uniq = (arr) => { const m = new Map(); (arr || []).forEach((p) => m.set(p.provider_id, p)); return [...m.values()]; };
  return { flatrate: uniq(r.flatrate), rent: uniq(r.rent), buy: uniq(r.buy) };
}

export async function providers(id) {
  const data = await get(`/movie/${id}/watch/providers`);
  return pick(data);
}

export async function tvProviders(id) {
  const data = await get(`/tv/${id}/watch/providers`);
  return pick(data);
}

// ── Mappers ────────────────────────────────────────────
export const toMini = (m) => ({
  id: m.id, title: m.title || m.name, year: (m.release_date || m.first_air_date || '').slice(0, 4),
  poster: m.poster_path, rating: m.vote_average, mediaType: 'movie',
});

export const toMiniTv = (m) => ({
  id: m.id, title: m.name, year: (m.first_air_date || '').slice(0, 4),
  poster: m.poster_path, rating: m.vote_average, mediaType: 'tv',
});