import React from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Trash2,
  Keyboard,
  Info,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import { useHistoryStore } from '@/renderer/store/useHistoryStore';
import { Mp3QuranApi } from '@/renderer/services/mp3quran/api';

export const Settings: React.FC = () => {
  const {
    theme,
    setTheme,
    autoNext,
    setAutoNext,
    notificationsEnabled,
    setNotificationsEnabled,
    minimizeToTrayOnClose,
    setMinimizeToTrayOnClose,
  } = useSettingsStore();

  const { clearHistory } = useHistoryStore();

  const handleClearCache = () => {
    Mp3QuranApi.clearCache();
    alert('تم مسح الذاكرة المؤقتة (Cache) بنجاح.');
  };

  const handleClearHistory = () => {
    if (confirm('هل أنت متأكد من رغبتك في مسح سجل الاستماع؟')) {
      clearHistory();
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300 pb-12 select-none">
      {/* 1. Theme Settings */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 font-cairo">المظهر والسمة (Theme)</h3>
            <p className="text-xs text-slate-400">اختر النمط المناسب لواجهة التطبيق</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-bold">الوضع الداكن (افتراضي)</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-bold">الوضع الفاتح</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs font-bold">حسب نظام التشغيل</span>
          </button>
        </div>
      </div>

      {/* 2. Audio & Playback Preferences */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 font-cairo">تفضيلات التشغيل</h3>
            <p className="text-xs text-slate-400">خيارات الانتقال التلقائي والإشعارات</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Auto Next */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="text-sm font-semibold text-slate-200">التشغيل التلقائي (Auto Next)</div>
              <div className="text-xs text-slate-400">الانتقال تلقائياً إلى السورة التالية عند انتهاء الحالية</div>
            </div>
            <button
              onClick={() => setAutoNext(!autoNext)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                autoNext ? 'bg-brand-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoNext ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="text-sm font-semibold text-slate-200">إشعارات النظام (Desktop Notifications)</div>
              <div className="text-xs text-slate-400">عرض إشعار عند تغيير السورة أو بدء تلاوة جديدة</div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-brand-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Minimize to Tray */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="text-sm font-semibold text-slate-200">التصغير إلى شريط المهام (System Tray)</div>
              <div className="text-xs text-slate-400">إبقاء التطبيق يعمل في الخلفية عند إغلاق النافذة</div>
            </div>
            <button
              onClick={() => setMinimizeToTrayOnClose(!minimizeToTrayOnClose)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                minimizeToTrayOnClose ? 'bg-brand-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  minimizeToTrayOnClose ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Global Shortcuts Reference */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 font-cairo">اختصارات لوحة المفاتيح</h3>
            <p className="text-xs text-slate-400">تحكم بالتشغيل حتى أثناء استخدام تطبيقات أخرى</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-slate-300">تشغيل / إيقاف مؤقت</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300">
                MediaPlayPause
              </kbd>
              <span className="text-xs text-slate-400">أو</span>
              <kbd className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300">
                Alt + Space
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-slate-300">السورة التالية</span>
            <kbd className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300">
              MediaNextTrack
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-slate-300">السورة السابقة</span>
            <kbd className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300">
              MediaPreviousTrack
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-slate-300">التحكم بالصوت</span>
            <kbd className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300">
              مفاتيح الصوت بالنظام
            </kbd>
          </div>
        </div>
      </div>

      {/* 4. Cache and Data Maintenance */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 font-cairo">إدارة البيانات والذاكرة المؤقتة</h3>
            <p className="text-xs text-slate-400">تحديث بيانات القراء والمصاحف ومسح السجل</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>تحديث وتفريغ كاش API</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح سجل الاستماع</span>
          </button>
        </div>
      </div>

      {/* 5. App Info */}
      <div className="p-6 rounded-3xl bg-dark-card/40 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-slate-400" />
          <div>
            <div className="text-sm font-bold text-slate-200">قرآني - Quran Desktop v1.0.0</div>
            <div className="text-xs text-slate-400">
              مدعوم بواسطة MP3Quran API v3 • مصمم بنظام Electron.js و React و TypeScript
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
