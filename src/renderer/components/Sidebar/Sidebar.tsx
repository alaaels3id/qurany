import React, { useState, useEffect } from 'react';
import appLogo from '@/assets/icon.png';
import {
  Home,
  BookOpen,
  Mic2,
  Radio as RadioIcon,
  Heart,
  Settings,
} from 'lucide-react';

export type PageId = 'home' | 'surahs' | 'reciters' | 'radio' | 'favorites' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const [logoError, setLogoError] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial & periodic connectivity check
    const checkConnection = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      try {
        const res = await fetch('https://mp3quran.net/api/v3/radios?language=ar', {
          method: 'GET',
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });
        setIsOnline(res.ok);
      } catch {
        if (!navigator.onLine) {
          setIsOnline(false);
        }
      }
    };

    const interval = setInterval(checkConnection, 20000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);
  const navItems = [
    { id: 'home' as PageId, label: 'الرئيسية', icon: Home },
    { id: 'surahs' as PageId, label: 'السور', icon: BookOpen },
    { id: 'reciters' as PageId, label: 'القراء', icon: Mic2 },
    { id: 'radio' as PageId, label: 'الراديو والبث', icon: RadioIcon },
    { id: 'favorites' as PageId, label: 'المفضلة', icon: Heart },
    { id: 'settings' as PageId, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-dark-sidebar border-l border-slate-200/80 dark:border-white/5 flex flex-col h-full select-none z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-200/80 dark:border-white/5">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-brand-500/15 border border-brand-500/30 flex-shrink-0 bg-emerald-50 dark:bg-dark-card flex items-center justify-center relative">
          {logoError ? (
            <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          ) : (
            <img
              src={appLogo}
              alt="Quran Desktop"
              className="w-full h-full object-cover"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-wide flex items-center gap-1.5 font-cairo">
            قرآني
            <span className="text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-sans">
              Free
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">تلاوات القرآن الكريم</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          التصفح والاستماع
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive
                ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Information Card */}
      <div
        className={`p-4 m-3 rounded-2xl border shadow-sm transition-all duration-300 ${isOnline
          ? 'bg-gradient-to-b from-brand-50 to-slate-100/80 dark:from-brand-950/40 dark:to-dark-card border-brand-500/20'
          : 'bg-gradient-to-b from-rose-50 to-slate-100/80 dark:from-rose-950/30 dark:to-dark-card border-rose-500/30'
          }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
            />
          </span>
          <span
            className={`text-xs font-semibold ${isOnline
              ? 'text-brand-700 dark:text-brand-300'
              : 'text-rose-600 dark:text-rose-400'
              }`}
          >
            {isOnline ? 'متصل بـ MP3Quran' : 'غير متصل بالإنترنت'}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {isOnline
            ? 'أكثر من 200 قارئ، ومئات المصاحف والإذاعات المباشرة.'
            : 'يرجى التحقق من اتصالك بالإنترنت للاستماع للتلاوات.'}
        </p>
      </div>
    </aside>
  );
};
