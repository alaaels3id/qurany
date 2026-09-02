import { create } from 'zustand';
import type { PlaybackHistoryItem } from '@/shared/types';

interface HistoryState {
  history: PlaybackHistoryItem[];
  lastPlayed: PlaybackHistoryItem | null;
  addHistoryItem: (item: Omit<PlaybackHistoryItem, 'id' | 'playedAt'>) => void;
  updatePosition: (reciterId: number, moshafId: number, surahId: number, position: number, duration: number) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = 'qurany_history_v1';
const MAX_HISTORY_ITEMS = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        history: parsed.history || [],
        lastPlayed: parsed.lastPlayed || null,
      };
    }
  } catch (e) {
    console.error('Failed to load playback history', e);
  }
  return { history: [], lastPlayed: null };
}

function saveHistory(history: PlaybackHistoryItem[], lastPlayed: PlaybackHistoryItem | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history, lastPlayed }));
  } catch (e) {
    console.error('Failed to save playback history', e);
  }
}

export const useHistoryStore = create<HistoryState>((set) => {
  const initial = loadHistory();

  return {
    history: initial.history,
    lastPlayed: initial.lastPlayed,

    addHistoryItem: (item) => {
      const newItem: PlaybackHistoryItem = {
        ...item,
        id: `${item.reciterId}_${item.moshafId}_${item.surahId}`,
        playedAt: Date.now(),
      };

      set((state) => {
        // Remove existing entry for the same track if present
        const filtered = state.history.filter((h) => h.id !== newItem.id);
        const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(newHistory, newItem);
        return {
          history: newHistory,
          lastPlayed: newItem,
        };
      });
    },

    updatePosition: (reciterId, moshafId, surahId, position, duration) => {
      const trackId = `${reciterId}_${moshafId}_${surahId}`;
      set((state) => {
        const history = state.history.map((item) => {
          if (item.id === trackId) {
            return {
              ...item,
              positionSeconds: position,
              durationSeconds: duration || item.durationSeconds,
              playedAt: Date.now(),
            };
          }
          return item;
        });

        const lastPlayed =
          state.lastPlayed && state.lastPlayed.id === trackId
            ? {
                ...state.lastPlayed,
                positionSeconds: position,
                durationSeconds: duration || state.lastPlayed.durationSeconds,
                playedAt: Date.now(),
              }
            : state.lastPlayed;

        saveHistory(history, lastPlayed);
        return { history, lastPlayed };
      });
    },

    clearHistory: () => {
      saveHistory([], null);
      set({ history: [], lastPlayed: null });
    },
  };
});
