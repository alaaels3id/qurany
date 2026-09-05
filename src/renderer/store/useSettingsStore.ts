import { create } from 'zustand';
import type { AppSettings, ThemeMode } from '@/shared/types';

interface SettingsState extends AppSettings {
  setLanguage: (language: 'ar' | 'en') => void;
  setTheme: (theme: ThemeMode) => void;
  setDefaultReciter: (reciterId: number, moshafId: number) => void;
  setAutoNext: (autoNext: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setMinimizeToTrayOnClose: (enabled: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}

const STORAGE_KEY = 'qurany_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar',
  theme: 'dark',
  defaultReciterId: 54, // Mishary Rashid Alafasy
  defaultMoshafId: 1,
  autoNext: true,
  notificationsEnabled: true,
  minimizeToTrayOnClose: true,
  playbackRate: 1,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export const useSettingsStore = create<SettingsState>((set) => {
  const initial = loadSettings();

  // Apply initial theme and language to documentElement
  if (typeof document !== 'undefined') {
    document.documentElement.lang = initial.language || 'ar';
    document.documentElement.dir = initial.language === 'en' ? 'ltr' : 'rtl';

    if (initial.theme === 'dark' || (initial.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    ...initial,

    setLanguage: (language: 'ar' | 'en') => {
      set((state) => {
        const next = { ...state, language };
        saveSettings(next);

        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
          document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
        }

        return { language };
      });
    },

    setTheme: (theme: ThemeMode) => {
      set((state) => {
        const next = { ...state, theme };
        saveSettings(next);

        if (typeof document !== 'undefined') {
          if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
          }
        }

        return { theme };
      });
    },

    setDefaultReciter: (defaultReciterId: number, defaultMoshafId: number) => {
      set((state) => {
        const next = { ...state, defaultReciterId, defaultMoshafId };
        saveSettings(next);
        return { defaultReciterId, defaultMoshafId };
      });
    },

    setAutoNext: (autoNext: boolean) => {
      set((state) => {
        const next = { ...state, autoNext };
        saveSettings(next);
        return { autoNext };
      });
    },

    setNotificationsEnabled: (notificationsEnabled: boolean) => {
      set((state) => {
        const next = { ...state, notificationsEnabled };
        saveSettings(next);
        return { notificationsEnabled };
      });
    },

    setMinimizeToTrayOnClose: (minimizeToTrayOnClose: boolean) => {
      set((state) => {
        const next = { ...state, minimizeToTrayOnClose };
        saveSettings(next);
        return { minimizeToTrayOnClose };
      });
    },

    setPlaybackRate: (playbackRate: number) => {
      set((state) => {
        const next = { ...state, playbackRate };
        saveSettings(next);
        return { playbackRate };
      });
    },
  };
});
