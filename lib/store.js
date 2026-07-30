import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export const useStore = create(
  persist(
    (set, get) => ({
      view: 'music',
      setView: (v) => set({ view: v }),

      status: 'idle',
      setStatus: (s) => set({ status: s }),
      volume: 70,
      muted: false,
      setVolume: (v) => set({ volume: v }),
      setMuted: (m) => set({ muted: m }),
      currentChannelId: 'alka',
      setCurrentChannelId: (id) => set({ currentChannelId: id }),
      currentTrack: { title: 'ETHERIX — continuous stream', badge: 'Live Stream', videoId: null },
      setCurrentTrack: (t) => set({ currentTrack: t }),

      sceneId: 'river',
      setSceneId: (id) => set({ sceneId: id }),
      autoSync: true,
      setAutoSync: (b) => set({ autoSync: b }),

      watchlist: [],
      watched: [],
      addToWatchlist: (m) => set((s) => ({
        watchlist: s.watchlist.some((x) => x.id === m.id) ? s.watchlist : [m, ...s.watchlist],
        watched: s.watched.filter((x) => x.id !== m.id),
      })),
      markWatched: (m, rating) => set((s) => ({
        watched: [{ ...m, rating: rating ?? 0, watchedAt: Date.now() }, ...s.watched.filter((x) => x.id !== m.id)],
        watchlist: s.watchlist.filter((x) => x.id !== m.id),
      })),
      setRating: (id, rating) => set((s) => ({ watched: s.watched.map((x) => (x.id === id ? { ...x, rating } : x)) })),
      removeMovie: (list, id) => set((s) => ({ [list]: s[list].filter((x) => x.id !== id) })),
      inList: (id) => { const s = get(); return { watchlist: s.watchlist.some((x) => x.id === id), watched: s.watched.some((x) => x.id === id) }; },
      setLists: ({ watchlist, watched }) => set({ watchlist, watched }),

      trackerOpen: false,
      setTrackerOpen: (b) => set({ trackerOpen: b }),
      toast: null,
      setToast: (t) => set({ toast: t }),
    }),
    {
      name: 'etherix-store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
      partialize: (s) => ({
        volume: s.volume, muted: s.muted, autoSync: s.autoSync, sceneId: s.sceneId,
        currentChannelId: s.currentChannelId, watchlist: s.watchlist, watched: s.watched,
      }),
    }
  )
);