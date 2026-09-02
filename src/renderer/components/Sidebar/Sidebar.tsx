import React from 'react';
import {
  Home,
  BookOpen,
  Mic2,
  Radio as RadioIcon,
  Heart,
  Settings,
  Sparkles,
} from 'lucide-react';

export type PageId = 'home' | 'surahs' | 'reciters' | 'radio' | 'favorites' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const navItems = [
    { id: 'home' as PageId, label: 'الرئيسية', icon: Home },
    { id: 'surahs' as PageId, label: 'السور', icon: BookOpen },
    { id: 'reciters' as PageId, label: 'القراء', icon: Mic2 },
    { id: 'radio' as PageId, label: 'الراديو والبث', icon: RadioIcon },
    { id: 'favorites' as PageId, label: 'المفضلة', icon: Heart },
    { id: 'settings' as PageId, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-dark-sidebar border-l border-white/5 flex flex-col h-full select-none z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-xl">
          <Sparkles className="w-5 h-5 text-emerald-100" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-100 tracking-wide flex items-center gap-1.5 font-cairo">
            قرآني
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-sans">
              Desktop
            </span>
          </h1>
          <p className="text-xs text-slate-400">تلاوات القرآن الكريم</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          التصفح والاستماع
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Information Card */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-brand-950/40 to-dark-card border border-brand-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-brand-300">متصل بـ MP3Quran</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          أكثر من 200 قارئ، ومئات المصاحف والإذاعات المباشرة.
        </p>
      </div>
    </aside>
  );
};
