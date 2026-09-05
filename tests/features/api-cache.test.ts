import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioUrlBuilder } from '@/renderer/services/mp3quran/urlBuilder';
import { Mp3QuranApi } from '@/renderer/services/mp3quran/api';

describe('Feature: API Caching & Audio URL Building', () => {
  describe('AudioUrlBuilder', () => {
    it('formats 1-digit surah IDs with 3 digits padding', () => {
      const url = AudioUrlBuilder.buildSurahUrl('https://server8.mp3quran.net/afs', 1);
      expect(url).toBe('https://server8.mp3quran.net/afs/001.mp3');
    });

    it('formats 2-digit surah IDs with 3 digits padding', () => {
      const url = AudioUrlBuilder.buildSurahUrl('https://server8.mp3quran.net/afs', 18);
      expect(url).toBe('https://server8.mp3quran.net/afs/018.mp3');
    });

    it('formats 3-digit surah IDs without extra padding', () => {
      const url = AudioUrlBuilder.buildSurahUrl('https://server8.mp3quran.net/afs', 114);
      expect(url).toBe('https://server8.mp3quran.net/afs/114.mp3');
    });

    it('handles trailing slash on server gracefully', () => {
      const url = AudioUrlBuilder.buildSurahUrl('https://server8.mp3quran.net/afs/', 55);
      expect(url).toBe('https://server8.mp3quran.net/afs/055.mp3');
    });

    it('returns empty string if server is missing', () => {
      expect(AudioUrlBuilder.buildSurahUrl('', 1)).toBe('');
    });
  });

  describe('Mp3QuranApi Cache', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('clears API cached keys on clearCache()', () => {
      localStorage.setItem('qurany_cache_suwar_ar', JSON.stringify({ data: [], timestamp: Date.now() }));
      localStorage.setItem('qurany_cache_reciters_language=ar', JSON.stringify({ data: [], timestamp: Date.now() }));
      localStorage.setItem('other_unrelated_key', 'value');

      Mp3QuranApi.clearCache();

      expect(localStorage.getItem('qurany_cache_suwar_ar')).toBeNull();
      expect(localStorage.getItem('qurany_cache_reciters_language=ar')).toBeNull();
      expect(localStorage.getItem('other_unrelated_key')).toBe('value');
    });

    it('falls back to built-in QURAN_SURAHS catalog if network fails', async () => {
      // Mock fetch failure and silence expected console.warn
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const suwar = await Mp3QuranApi.getSuwar('ar');
      expect(suwar.length).toBe(114);
      expect(suwar[0].id).toBe(1);
      expect(suwar[0].name).toBe('الفاتحة');
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
