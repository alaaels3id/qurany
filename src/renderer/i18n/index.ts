import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import { ar } from './translations/ar';
import { en } from './translations/en';

export type TranslationResources = typeof ar;

// Helper to get nested value from object by dot-path
function getNestedValue(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function useTranslation() {
  const language = useSettingsStore((state) => state.language) || 'ar';
  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const translations = language === 'en' ? en : ar;

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = getNestedValue(translations, key);
    // Fallback to Arabic if key not found in chosen language
    if (!text && language !== 'ar') {
      text = getNestedValue(ar, key);
    }

    if (!text) {
      return key;
    }

    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, val]) => {
        return acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      }, text);
    }

    return text;
  };

  return {
    t,
    language,
    isRTL,
    dir,
  };
}
