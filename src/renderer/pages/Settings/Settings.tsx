import React, { useState, useEffect } from 'react';
import {
  Languages,
  Sun,
  Moon,
  Monitor,
  Trash2,
  Keyboard,
  Info,
  Sparkles,
  Volume2,
  RefreshCw,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import { useHistoryStore } from '@/renderer/store/useHistoryStore';
import { Mp3QuranApi } from '@/renderer/services/mp3quran/api';
import { useTranslation } from '@/renderer/i18n';
import type { UpdateStatusPayload } from '@/shared/types';

export const Settings: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    autoNext,
    setAutoNext,
    notificationsEnabled,
    setNotificationsEnabled,
    minimizeToTrayOnClose,
    setMinimizeToTrayOnClose,
  } = useSettingsStore();

  const { t, isRTL } = useTranslation();
  const { clearHistory } = useHistoryStore();

  // Auto Updater State
  const [updateStatus, setUpdateStatus] = useState<UpdateStatusPayload>({
    status: 'idle',
    currentVersion: '1.1.0',
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.updater) {
      window.electronAPI.updater.getStatus().then((status) => {
        if (status) setUpdateStatus(status);
      }).catch(console.error);

      const cleanup = window.electronAPI.updater.onStatusChange((status) => {
        setUpdateStatus(status);
        if (status.status !== 'checking') {
          setIsChecking(false);
        }
      });
      return cleanup;
    }
  }, []);

  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    if (window.electronAPI?.updater) {
      try {
        await window.electronAPI.updater.check();
      } catch (e) {
        console.error(e);
        setIsChecking(false);
      }
    } else {
      setTimeout(() => {
        setIsChecking(false);
        setUpdateStatus((prev) => ({
          ...prev,
          status: 'not-available',
        }));
      }, 1000);
    }
  };

  const handleDownloadUpdate = async () => {
    if (window.electronAPI?.updater) {
      try {
        await window.electronAPI.updater.download();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleInstallUpdate = () => {
    if (window.electronAPI?.updater) {
      window.electronAPI.updater.install();
    }
  };

  const handleClearCache = () => {
    Mp3QuranApi.clearCache();
    alert(t('settings.clearCacheAlert'));
  };

  const handleClearHistory = () => {
    if (confirm(t('settings.clearHistoryConfirm'))) {
      clearHistory();
    }
  };

  const getSwitchTransform = (active: boolean) => {
    if (!active) return 'translate-x-0';
    return isRTL ? '-translate-x-6' : 'translate-x-6';
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300 pb-12 select-none">
      {/* 1. Language Settings */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
              {t('settings.languageTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.languageDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setLanguage('ar')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              language === 'ar'
                ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 shadow-md shadow-brand-500/10 font-bold'
                : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-base font-bold font-cairo">العربية</span>
            <span className="text-xs opacity-75">{t('settings.arabic')}</span>
          </button>

          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              language === 'en'
                ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 shadow-md shadow-brand-500/10 font-bold'
                : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-base font-bold font-sans">English</span>
            <span className="text-xs opacity-75">{t('settings.english')}</span>
          </button>
        </div>
      </div>

      {/* 2. Theme Settings */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
              {t('settings.themeTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.themeDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 shadow-md shadow-brand-500/10 font-bold'
                : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-bold">{t('settings.darkTheme')}</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 shadow-md shadow-brand-500/10 font-bold'
                : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-bold">{t('settings.lightTheme')}</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 shadow-md shadow-brand-500/10 font-bold'
                : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs font-bold">{t('settings.systemTheme')}</span>
          </button>
        </div>
      </div>

      {/* 3. Audio & Playback Preferences */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
              {t('settings.playbackPrefsTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.playbackPrefsDesc')}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Auto Next */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t('settings.autoNextTitle')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('settings.autoNextDesc')}
              </div>
            </div>
            <button
              onClick={() => setAutoNext(!autoNext)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                autoNext ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${getSwitchTransform(autoNext)}`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t('settings.notificationsTitle')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('settings.notificationsDesc')}
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${getSwitchTransform(notificationsEnabled)}`}
              />
            </button>
          </div>

          {/* Minimize to Tray */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t('settings.minimizeToTrayTitle')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('settings.minimizeToTrayDesc')}
              </div>
            </div>
            <button
              onClick={() => setMinimizeToTrayOnClose(!minimizeToTrayOnClose)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                minimizeToTrayOnClose ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${getSwitchTransform(minimizeToTrayOnClose)}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Global Shortcuts Reference */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
              {t('settings.shortcutsTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.shortcutsDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('settings.shortcutPlayPause')}
            </span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-slate-200/80 dark:bg-black/40 border border-slate-300/80 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-slate-300 shadow-sm dark:shadow-none">
                MediaPlayPause
              </kbd>
              <span className="text-xs text-slate-400 dark:text-slate-500">{t('settings.shortcutOr')}</span>
              <kbd className="px-2 py-1 rounded bg-slate-200/80 dark:bg-black/40 border border-slate-300/80 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-slate-300 shadow-sm dark:shadow-none">
                Alt + Space
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('settings.shortcutNext')}
            </span>
            <kbd className="px-2 py-1 rounded bg-slate-200/80 dark:bg-black/40 border border-slate-300/80 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-slate-300 shadow-sm dark:shadow-none">
              MediaNextTrack
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('settings.shortcutPrev')}
            </span>
            <kbd className="px-2 py-1 rounded bg-slate-200/80 dark:bg-black/40 border border-slate-300/80 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-slate-300 shadow-sm dark:shadow-none">
              MediaPreviousTrack
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('settings.shortcutVolume')}
            </span>
            <kbd className="px-2 py-1 rounded bg-slate-200/80 dark:bg-black/40 border border-slate-300/80 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-slate-300 shadow-sm dark:shadow-none">
              {t('settings.shortcutVolumeKeys')}
            </kbd>
          </div>
        </div>
      </div>

      {/* 5. Cache and Data Maintenance */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
              {t('settings.dataMaintenanceTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.dataMaintenanceDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{t('settings.clearCacheBtn')}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('settings.clearHistoryBtn')}</span>
          </button>
        </div>
      </div>

      {/* 6. Software Updates */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400">
              <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
                {t('settings.updatesTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('settings.updatesDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckForUpdates}
            disabled={isChecking || updateStatus.status === 'downloading'}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-brand-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? t('settings.checkingForUpdates') : t('settings.checkForUpdatesBtn')}</span>
          </button>
        </div>

        {/* Current Version & Status Display */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {t('settings.installedVersion')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold">
                v{updateStatus.currentVersion}
              </span>
            </div>

            {/* Status Feedback */}
            {updateStatus.status === 'not-available' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('settings.latestVersionInstalled')}</span>
              </div>
            )}

            {updateStatus.status === 'checking' && (
              <div className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{t('settings.connectingToUpdateServer')}</span>
              </div>
            )}

            {updateStatus.status === 'error' && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{updateStatus.error || t('settings.updateCheckError')}</span>
              </div>
            )}
          </div>

          {/* Update Available Banner */}
          {updateStatus.status === 'available' && (
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-sm">
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{t('settings.newVersionAvailable', { version: updateStatus.updateInfo?.version || '' })}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('settings.updateInfoDesc')}
                </p>
              </div>

              <button
                onClick={handleDownloadUpdate}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>{t('settings.downloadUpdateNow')}</span>
              </button>
            </div>
          )}

          {/* Downloading Progress Bar */}
          {updateStatus.status === 'downloading' && updateStatus.progress && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{t('settings.downloadingUpdateProgress', { percent: Math.round(updateStatus.progress.percent) })}</span>
                <span>
                  {t('settings.downloadSpeedStats', {
                    transferred: (updateStatus.progress.transferred / 1024 / 1024).toFixed(1),
                    total: (updateStatus.progress.total / 1024 / 1024).toFixed(1),
                    speed: (updateStatus.progress.bytesPerSecond / 1024 / 1024).toFixed(1),
                  })}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${updateStatus.progress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Downloaded and Ready to Install */}
          {updateStatus.status === 'downloaded' && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('settings.updateDownloadedReady')}</span>
              </div>

              <button
                onClick={handleInstallUpdate}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('settings.restartAndInstall')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7. App Info */}
      <div className="p-6 rounded-3xl bg-slate-100/70 dark:bg-dark-card/40 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-slate-400" />
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t('settings.appInfoTitle', { version: updateStatus.currentVersion })}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.appInfoDesc')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
