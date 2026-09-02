import type { Surah, Reciter, Riwayah, Radio, RecentRead } from '@/shared/types';
import { QURAN_SURAHS } from '@/shared/constants/quran';

const BASE_URL = 'https://mp3quran.net/api/v3';
const CACHE_PREFIX = 'qurany_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getFromCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.error('Cache read error:', err);
    return null;
  }
}

function setInCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

export class Mp3QuranApi {
  /**
   * Fetch all 114 Suwar
   */
  static async getSuwar(language = 'ar'): Promise<Surah[]> {
    const cacheKey = `suwar_${language}`;
    const cached = getFromCache<Surah[]>(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      const res = await fetch(`${BASE_URL}/suwar?language=${language}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const suwar: Surah[] = json.suwar || [];
      if (suwar.length > 0) {
        setInCache(cacheKey, suwar);
        return suwar;
      }
    } catch (err) {
      console.warn('Failed to fetch suwar from API, using fallback catalog', err);
    }

    // Fallback to built-in full Quran metadata
    return QURAN_SURAHS.map((s) => ({
      id: s.id,
      name: s.name,
      name_en: s.englishName,
      name_translation: s.englishTranslation,
      start_page: s.startPage,
      end_page: s.endPage,
      makkia: s.makkia,
      ayah_count: s.ayahCount,
    }));
  }

  /**
   * Fetch reciters list with their associated Moshafs
   */
  static async getReciters(params?: {
    language?: string;
    reciter?: number;
    rewaya?: number;
    sura?: number;
  }): Promise<Reciter[]> {
    const language = params?.language || 'ar';
    const query = new URLSearchParams({ language });
    if (params?.reciter) query.append('reciter', String(params.reciter));
    if (params?.rewaya) query.append('rewaya', String(params.rewaya));
    if (params?.sura) query.append('sura', String(params.sura));

    const cacheKey = `reciters_${query.toString()}`;
    const cached = getFromCache<Reciter[]>(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      const res = await fetch(`${BASE_URL}/reciters?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const reciters: Reciter[] = json.reciters || [];
      if (reciters.length > 0) {
        setInCache(cacheKey, reciters);
      }
      return reciters;
    } catch (err) {
      console.error('Failed to fetch reciters:', err);
      // If network fails, return cached if available regardless of expiration
      const fallback = localStorage.getItem(CACHE_PREFIX + cacheKey);
      if (fallback) {
        return JSON.parse(fallback).data;
      }
      throw err;
    }
  }

  /**
   * Fetch all Riwayat (Narrations)
   */
  static async getRiwayat(language = 'ar'): Promise<Riwayah[]> {
    const cacheKey = `riwayat_${language}`;
    const cached = getFromCache<Riwayah[]>(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      const res = await fetch(`${BASE_URL}/riwayat?language=${language}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const riwayat: Riwayah[] = json.riwayat || [];
      if (riwayat.length > 0) {
        setInCache(cacheKey, riwayat);
      }
      return riwayat;
    } catch (err) {
      console.error('Failed to fetch riwayat:', err);
      return [];
    }
  }

  /**
   * Fetch Radio stations
   */
  static async getRadios(language = 'ar'): Promise<Radio[]> {
    const cacheKey = `radios_${language}`;
    const cached = getFromCache<Radio[]>(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      const res = await fetch(`${BASE_URL}/radios?language=${language}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const radios: Radio[] = json.radios || [];
      if (radios.length > 0) {
        setInCache(cacheKey, radios);
      }
      return radios;
    } catch (err) {
      console.error('Failed to fetch radios:', err);
      return [];
    }
  }

  /**
   * Fetch Recent Reads
   */
  static async getRecentReads(language = 'ar'): Promise<RecentRead[]> {
    const cacheKey = `recent_reads_${language}`;
    const cached = getFromCache<RecentRead[]>(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      const res = await fetch(`${BASE_URL}/recent_reads?language=${language}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const reads: RecentRead[] = json.recent_reads || [];
      if (reads.length > 0) {
        setInCache(cacheKey, reads);
      }
      return reads;
    } catch (err) {
      console.error('Failed to fetch recent reads:', err);
      return [];
    }
  }

  /**
   * Clear API cache
   */
  static clearCache(): void {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}
