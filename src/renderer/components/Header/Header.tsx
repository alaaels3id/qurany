import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import { useTranslation } from '@/renderer/i18n';
import type { PageId } from '../Sidebar/Sidebar';

interface HeaderProps {
  currentPage: PageId;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  searchQuery,
  onSearchChange,
}) => {
  const { theme, setTheme } = useSettingsStore();
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('dark');
  };

  const handleToggleFullscreen = async () => {
    if (window.electronAPI?.app?.toggleFullscreen) {
      try {
        const isFS = await window.electronAPI.app.toggleFullscreen();
        setIsFullscreen(isFS);
        return;
      } catch (e) {
        console.error('Electron fullscreen error:', e);
      }
    }

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-dark-bg/60 backdrop-blur-md sticky top-0 z-10 shadow-sm dark:shadow-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo flex items-center gap-2">
          {searchQuery.trim() ? t('common.searchResults') : t(`header.titles.${currentPage}`)}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {searchQuery.trim()
            ? t('header.descriptions.searchResults')
            : t(`header.descriptions.${currentPage}`)}
        </p>
      </div>

      {/* Center Search Bar */}
      {currentPage !== 'settings' && (
        <div className="relative w-80 max-w-full">
          <Search className="w-4 h-4 text-slate-400 absolute rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="w-full rtl:pl-4 rtl:pr-10 ltr:pr-4 ltr:pl-10 py-2 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500/60 focus:bg-white dark:focus:bg-white/10 transition-all shadow-inner dark:shadow-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white px-1"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={handleToggleTheme}
          title={t('header.toggleTheme')}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 dark:text-slate-200" />
          )}
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={handleToggleFullscreen}
          title={isFullscreen ? t('header.exitFullscreen') : t('header.toggleFullscreen')}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};

