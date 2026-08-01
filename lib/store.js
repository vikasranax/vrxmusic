import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from './supabase';

const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

let pushTimer = null;
function debouncePush(fn, ms = 1200) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(fn, ms);
}

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
      currentChannelId: 'lofi',
      setCurrentChannelId: (id) => set({ currentChannelId: id }),
      currentTrack: { title: 'VRX Music — continuous stream', badge: 'Live Stream', videoId: null },
      setCurrentTrack: (t) => set({ currentTrack: t }),

      sceneId: 'forest',
      setSceneId: (id) => set({ sceneId: id, bgMode: 'scene' }),
      autoSync: true,
      setAutoSync: (b) => set({ autoSync: b }),

      bgMode: 'scene',
      customBg: '',
      setCustomBg: (url) => set({ customBg: url, bgMode: 'image' }),

      syncKey: '',
      setSyncKey: (k) => set({ syncKey: k }),

      watchlist: [],
      watched: [],

      addToWatchlist: (m) => {
        set((s) => ({
          watchlist: s.watchlist.some((x) => x.id === m.id) ? s.watchlist : [m, ...s.watchlist],
          watched: s.watched.filter((x) => x.id !== m.id),
        }));
        get()._push();
      },
      markWatched: (m, rating) => {
        set((s) => ({
          watched: [{ ...m, rating: rating ?? 0, watchedAt: Date.now() }, ...s.watched.filter((x) => x.id !== m.id)],
          watchlist: s.watchlist.filter((x) => x.id !== m.id),
        }));
        get()._push();
      },
      setRating: (id, rating) => {
        set((s) => ({ watched: s.watched.map((x) => (x.id === id ? { ...x, rating } : x)) }));
        get()._push();
      },
      removeMovie: (list, id) => {
        set((s) => ({ [list]: s[list].filter((x) => x.id !== id) }));
        get()._push();
      },
      inList: (id) => {
        const s = get();
        return { watchlist: s.watchlist.some((x) => x.id === id), watched: s.watched.some((x) => x.id === id) };
      },
      setLists: ({ watchlist, watched }) => {
        set({ watchlist, watched });
        get()._push();
      },

      _push: () => {
        debouncePush(async () => {
          if (!supabase) return;
          const { syncKey, watchlist, watched } = get();
          if (!syncKey) return;
          await supabase.from('lists').upsert({
            sync_key: syncKey,
            watchlist,
            watched,
            updated_at: new Date().toISOString(),
          });
        });
      },

      pullFromCloud: async () => {
        if (!supabase) return;
        const { syncKey } = get();
        if (!syncKey) return;
        const { data, error } = await supabase
          .from('lists')
          .select('*')
          .eq('sync_key', syncKey)
          .single();
        if (error && error.code !== 'PGRST116') {
          console.log('Sync fetch error:', error.message);
          return;
        }
        if (data) {
          set({
            watchlist: Array.isArray(data.watchlist) ? data.watchlist : [],
            watched: Array.isArray(data.watched) ? data.watched : [],
          });
        }
      },

      generateSyncKey: () => {
        const key = 'vrx-' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
        set({ syncKey: key });
        return key;
      },

      trackerOpen: false,
      setTrackerOpen: (b) => set({ trackerOpen: b }),
      toast: null,
      setToast: (t) => set({ toast: t }),
    }),
    {
      name: 'vrx-music-store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
      partialize: (s) => ({
        volume: s.volume, muted: s.muted, autoSync: s.autoSync, sceneId: s.sceneId,
        currentChannelId: s.currentChannelId, watchlist: s.watchlist, watched: s.watched,
        customBg: s.customBg, bgMode: s.bgMode, syncKey: s.syncKey,
      }),
    }
  )
);