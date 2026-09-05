import { describe, it, expect } from 'vitest';
import { normalizeArabic, matchesArabic } from '@/renderer/utils/search';

describe('Feature: Arabic & Global Search Normalization', () => {
  describe('normalizeArabic()', () => {
    it('removes diacritics (tashkeel)', () => {
      const input = 'الْحَمْدُ لِلَّـهِ رَبِّ الْعَالَمِينَ';
      const normalized = normalizeArabic(input);
      expect(normalized).not.toContain('َ');
      expect(normalized).not.toContain('ُ');
      expect(normalized).not.toContain('ِ');
      expect(normalized).not.toContain('ّ');
      expect(normalized).not.toContain('ْ');
    });

    it('unifies different forms of Alef (أ, إ, آ, ٱ -> ا)', () => {
      expect(normalizeArabic('إبراهيم')).toBe('ابراهيم');
      expect(normalizeArabic('أحمد')).toBe('احمد');
      expect(normalizeArabic('آل عمران')).toBe('ال عمران');
    });

    it('unifies Ta Marbuta (ة -> ه)', () => {
      expect(normalizeArabic('البقرة')).toBe('البقره');
      expect(normalizeArabic('الفاتحة')).toBe('الفاتحه');
    });

    it('unifies Alef Maqsura and Yaa (ى, ي -> ي)', () => {
      expect(normalizeArabic('موسى')).toBe('موسي');
      expect(normalizeArabic('هدى')).toBe('هدي');
    });
  });

  describe('matchesArabic()', () => {
    it('matches with and without diacritics', () => {
      expect(matchesArabic('الرَّحْمَـٰن', 'الرحمن')).toBe(true);
      expect(matchesArabic('سُورَةُ الْفَاتِحَةِ', 'الفاتحة')).toBe(true);
      expect(matchesArabic('سورة الفاتحة', 'الفاتحه')).toBe(true);
    });

    it('matches compound names regardless of spaces (e.g. عبد الباسط vs عبدالباسط)', () => {
      expect(matchesArabic('عبد الباسط عبد الصمد', 'عبدالباسط')).toBe(true);
      expect(matchesArabic('عبدالباسط عبدالصمد', 'عبد الباسط')).toBe(true);
      expect(matchesArabic('مشاري راشد العفاسي', 'العفاسي')).toBe(true);
      expect(matchesArabic('مشاري راشد العفاسي', 'مشاري')).toBe(true);
    });

    it('returns false when query does not match', () => {
      expect(matchesArabic('سورة الكهف', 'البقرة')).toBe(false);
      expect(matchesArabic('محمود خليل الحصري', 'المنشاوي')).toBe(false);
    });

    it('handles empty or whitespace query gracefully', () => {
      expect(matchesArabic('سورة يوسف', '')).toBe(true);
      expect(matchesArabic('سورة يوسف', '   ')).toBe(true);
      expect(matchesArabic('', 'يوسف')).toBe(false);
    });
  });
});
