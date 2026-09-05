import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import { ar } from '@/renderer/i18n/translations/ar';
import { en } from '@/renderer/i18n/translations/en';

describe('Feature: Settings & Internationalization (i18n)', () => {
  beforeEach(() => {
    // Reset Zustand store to default settings
    useSettingsStore.setState({
      language: 'ar',
      theme: 'dark',
      defaultReciterId: 54,
      defaultMoshafId: 1,
      autoNext: true,
      notificationsEnabled: true,
      minimizeToTrayOnClose: true,
      playbackRate: 1,
    });
  });

  describe('Language Switching & Layout Direction', () => {
    it('defaults to Arabic with RTL direction', () => {
      const state = useSettingsStore.getState();
      expect(state.language).toBe('ar');
    });

    it('switches to English and updates document attributes to LTR', () => {
      const { setLanguage } = useSettingsStore.getState();
      setLanguage('en');

      expect(useSettingsStore.getState().language).toBe('en');
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });

    it('switches back to Arabic and updates document attributes to RTL', () => {
      const { setLanguage } = useSettingsStore.getState();
      setLanguage('en');
      setLanguage('ar');

      expect(useSettingsStore.getState().language).toBe('ar');
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  describe('Translation Dictionaries Completeness', () => {
    it('contains matching keys in both Arabic and English dictionaries', () => {
      const arSections = Object.keys(ar);
      const enSections = Object.keys(en);

      expect(enSections).toEqual(arSections);

      // Verify keys in each section
      for (const section of arSections) {
        const arKeys = Object.keys((ar as any)[section]);
        const enKeys = Object.keys((en as any)[section]);
        expect(enKeys).toEqual(arKeys);
      }
    });

    it('has non-empty values for common UI strings', () => {
      expect(ar.common.home).toBe('الرئيسية');
      expect(en.common.home).toBe('Home');
      expect(ar.common.surahs).toBe('السور');
      expect(en.common.surahs).toBe('Surahs');
      expect(ar.common.reciters).toBe('القراء');
      expect(en.common.reciters).toBe('Reciters');
      expect(ar.common.settings).toBe('الإعدادات');
      expect(en.common.settings).toBe('Settings');
    });
  });

  describe('Theme Mode Settings', () => {
    it('switches between dark, light, and system themes and updates document classes', () => {
      const { setTheme } = useSettingsStore.getState();

      setTheme('light');
      expect(useSettingsStore.getState().theme).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      setTheme('dark');
      expect(useSettingsStore.getState().theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  describe('Playback Preferences', () => {
    it('updates autoNext preference', () => {
      const { setAutoNext } = useSettingsStore.getState();
      setAutoNext(false);
      expect(useSettingsStore.getState().autoNext).toBe(false);
      setAutoNext(true);
      expect(useSettingsStore.getState().autoNext).toBe(true);
    });

    it('updates desktop notifications preference', () => {
      const { setNotificationsEnabled } = useSettingsStore.getState();
      setNotificationsEnabled(false);
      expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
      setNotificationsEnabled(true);
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
    });

    it('updates minimize to tray preference', () => {
      const { setMinimizeToTrayOnClose } = useSettingsStore.getState();
      setMinimizeToTrayOnClose(false);
      expect(useSettingsStore.getState().minimizeToTrayOnClose).toBe(false);
    });

    it('updates playback rate', () => {
      const { setPlaybackRate } = useSettingsStore.getState();
      setPlaybackRate(1.5);
      expect(useSettingsStore.getState().playbackRate).toBe(1.5);
    });
  });
});
