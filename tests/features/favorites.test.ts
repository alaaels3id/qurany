import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';

describe('Feature: Favorites Management', () => {
  beforeEach(() => {
    useFavoritesStore.setState({
      favoriteSurahIds: [],
      favoriteReciterIds: [],
      favoriteRadioIds: [],
    });
  });

  describe('Surahs Favorites', () => {
    it('toggles surah favorite status correctly', () => {
      const { toggleFavoriteSurah } = useFavoritesStore.getState();

      expect(useFavoritesStore.getState().isFavoriteSurah(1)).toBe(false);

      // Add to favorites
      toggleFavoriteSurah(1);
      expect(useFavoritesStore.getState().isFavoriteSurah(1)).toBe(true);
      expect(useFavoritesStore.getState().favoriteSurahIds).toContain(1);

      // Remove from favorites
      toggleFavoriteSurah(1);
      expect(useFavoritesStore.getState().isFavoriteSurah(1)).toBe(false);
      expect(useFavoritesStore.getState().favoriteSurahIds).not.toContain(1);
    });

    it('can store multiple favorite surahs', () => {
      const { toggleFavoriteSurah } = useFavoritesStore.getState();
      toggleFavoriteSurah(1);
      toggleFavoriteSurah(18);
      toggleFavoriteSurah(36);

      expect(useFavoritesStore.getState().favoriteSurahIds).toEqual([1, 18, 36]);
    });
  });

  describe('Reciters Favorites', () => {
    it('toggles reciter favorite status correctly', () => {
      const { toggleFavoriteReciter } = useFavoritesStore.getState();

      expect(useFavoritesStore.getState().isFavoriteReciter(54)).toBe(false);

      toggleFavoriteReciter(54);
      expect(useFavoritesStore.getState().isFavoriteReciter(54)).toBe(true);

      toggleFavoriteReciter(54);
      expect(useFavoritesStore.getState().isFavoriteReciter(54)).toBe(false);
    });
  });

  describe('Radios Favorites', () => {
    it('toggles radio station favorite status correctly', () => {
      const { toggleFavoriteRadio } = useFavoritesStore.getState();

      expect(useFavoritesStore.getState().isFavoriteRadio(101)).toBe(false);

      toggleFavoriteRadio(101);
      expect(useFavoritesStore.getState().isFavoriteRadio(101)).toBe(true);

      toggleFavoriteRadio(101);
      expect(useFavoritesStore.getState().isFavoriteRadio(101)).toBe(false);
    });
  });
});
