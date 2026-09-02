import React from 'react';
import { Mic2, BookOpen, Heart, ChevronLeft } from 'lucide-react';
import type { Reciter } from '@/shared/types';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';

interface ReciterCardProps {
  reciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
}

export const ReciterCard: React.FC<ReciterCardProps> = ({ reciter, onSelectReciter }) => {
  const { isFavoriteReciter, toggleFavoriteReciter } = useFavoritesStore();
  const isFavorite = isFavoriteReciter(reciter.id);

  const moshafCount = reciter.moshaf?.length || 0;
  const moshafNames = reciter.moshaf?.map((m) => m.name).join(' • ') || 'مصحف مرتل';

  return (
    <div
      onClick={() => onSelectReciter(reciter)}
      className="p-5 rounded-2xl glass-panel transition-all duration-300 relative group hover:border-brand-500/40 hover:bg-slate-50/50 dark:hover:bg-white/5 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 dark:from-brand-900 dark:to-emerald-700/60 border border-brand-500/20 flex items-center justify-center text-white dark:text-emerald-300 font-bold group-hover:scale-105 transition-transform shadow-md shadow-brand-500/10">
            <Mic2 className="w-5 h-5" />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteReciter(reciter.id);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {reciter.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-4" title={moshafNames}>
          {moshafNames}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
          <span>{moshafCount} {moshafCount === 1 ? 'مصحف' : 'مصاحف'}</span>
        </span>

        <span className="text-brand-600 dark:text-brand-400 font-medium flex items-center gap-0.5 group-hover:-translate-x-1 transition-transform">
          <span>عرض السور</span>
          <ChevronLeft className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
