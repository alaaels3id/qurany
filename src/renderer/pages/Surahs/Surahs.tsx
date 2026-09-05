import React, { useState, useMemo } from 'react';
import { LayoutGrid, List, Sparkles, Filter } from 'lucide-react';
import type { Surah } from '@/shared/types';
import { SurahCard } from '@/renderer/components/SurahCard/SurahCard';
import { matchesArabic } from '@/renderer/utils/search';
import { useTranslation } from '@/renderer/i18n';

interface SurahsProps {
  surahs: Surah[];
  searchQuery: string;
  onPlayDirect: (surah: Surah) => void;
  onOpenReciterPicker: (surah: Surah) => void;
}

export const Surahs: React.FC<SurahsProps> = ({
  surahs,
  searchQuery,
  onPlayDirect,
  onOpenReciterPicker,
}) => {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [typeFilter, setTypeFilter] = useState<'all' | 'makki' | 'madani'>('all');

  const filteredSurahs = useMemo(() => {
    return surahs.filter((s) => {
      // Type Filter
      if (typeFilter === 'makki' && s.makkia !== 1) return false;
      if (typeFilter === 'madani' && s.makkia !== 0) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = matchesArabic(s.name, query);
        const matchesEn = s.name_en?.toLowerCase().includes(query) || (s as any).englishName?.toLowerCase().includes(query);
        const matchesId = String(s.id) === query || String(s.id).includes(query);
        if (!matchesName && !matchesEn && !matchesId) return false;
      }

      return true;
    });
  }, [surahs, typeFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Filters & Layout Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500 dark:text-brand-400 rtl:mr-1 ltr:ml-1" />
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {t('surahs.filterAll')}
          </button>
          <button
            onClick={() => setTypeFilter('makki')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'makki'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {t('surahs.filterMakki')}
          </button>
          <button
            onClick={() => setTypeFilter('madani')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'madani'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {t('surahs.filterMadani')}
          </button>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setLayout('grid')}
            className={`p-2 rounded-lg transition-all ${
              layout === 'grid'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={t('home.gridView')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('list')}
            className={`p-2 rounded-lg transition-all ${
              layout === 'list'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={t('home.listView')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Surahs Container */}
      {filteredSurahs.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <Sparkles className="w-8 h-8 opacity-40" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-300 font-cairo">
            {t('surahs.noSurahsFound')}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('surahs.noSurahsFoundHint')}
          </p>
        </div>
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-3'
          }
        >
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.id}
              surah={surah}
              layout={layout}
              onPlayDirect={onPlayDirect}
              onOpenReciterPicker={onOpenReciterPicker}
            />
          ))}
        </div>
      )}
    </div>
  );
};
