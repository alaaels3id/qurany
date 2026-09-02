import { create } from 'zustand';

interface FavoritesState {
  favoriteSurahIds: number[];
  favoriteReciterIds: number[];
  favoriteRadioIds: number[];
  toggleFavoriteSurah: (id: number) => void;
  isFavoriteSurah: (id: number) => boolean;
  toggleFavoriteReciter: (id: number) => void;
  isFavoriteReciter: (id: number) => boolean;
  toggleFavoriteRadio: (id: number) => void;
  isFavoriteRadio: (id: number) => boolean;
}

const STORAGE_KEY = 'qurany_favorites_v1';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load favorites', e);
  }
  return {
    favoriteSurahIds: [1, 18, 36, 55, 67, 112], // Default favorites (Fatihah, Kahf, Yasin, Rahman, Mulk, Ikhlas)
    favoriteReciterIds: [],
    favoriteRadioIds: [],
  };
}

function saveFavorites(state: { favoriteSurahIds: number[]; favoriteReciterIds: number[]; favoriteRadioIds: number[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

export const useFavoritesStore = create<FavoritesState>((set, get) => {
  const initial = loadFavorites();

  return {
    favoriteSurahIds: initial.favoriteSurahIds || [],
    favoriteReciterIds: initial.favoriteReciterIds || [],
    favoriteRadioIds: initial.favoriteRadioIds || [],

    toggleFavoriteSurah: (id: number) => {
      set((state) => {
        const exists = state.favoriteSurahIds.includes(id);
        const next = exists
          ? state.favoriteSurahIds.filter((item) => item !== id)
          : [...state.favoriteSurahIds, id];
        const updated = { ...state, favoriteSurahIds: next };
        saveFavorites(updated);
        return { favoriteSurahIds: next };
      });
    },

    isFavoriteSurah: (id: number) => {
      return get().favoriteSurahIds.includes(id);
    },

    toggleFavoriteReciter: (id: number) => {
      set((state) => {
        const exists = state.favoriteReciterIds.includes(id);
        const next = exists
          ? state.favoriteReciterIds.filter((item) => item !== id)
          : [...state.favoriteReciterIds, id];
        const updated = { ...state, favoriteReciterIds: next };
        saveFavorites(updated);
        return { favoriteReciterIds: next };
      });
    },

    isFavoriteReciter: (id: number) => {
      return get().favoriteReciterIds.includes(id);
    },

    toggleFavoriteRadio: (id: number) => {
      set((state) => {
        const exists = state.favoriteRadioIds.includes(id);
        const next = exists
          ? state.favoriteRadioIds.filter((item) => item !== id)
          : [...state.favoriteRadioIds, id];
        const updated = { ...state, favoriteRadioIds: next };
        saveFavorites(updated);
        return { favoriteRadioIds: next };
      });
    },

    isFavoriteRadio: (id: number) => {
      return get().favoriteRadioIds.includes(id);
    },
  };
});
