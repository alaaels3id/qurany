import React, { useState, useMemo } from 'react';
import { Heart, BookOpen, Mic2, Radio as RadioIcon, List, LayoutGrid } from 'lucide-react';
import type { Surah, Reciter, Radio } from '@/shared/types';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';
import { SurahCard } from '@/renderer/components/SurahCard/SurahCard';
import { ReciterCard } from '@/renderer/components/ReciterCard/ReciterCard';
import { RadioCard } from '@/renderer/components/RadioCard/RadioCard';
import { useTranslation } from '@/renderer/i18n';

interface FavoritesProps {
  surahs: Surah[];
  reciters: Reciter[];
  radios: Radio[];
  onPlaySurahDirect: (surah: Surah) => void;
  onOpenReciterPicker: (surah: Surah) => void;
  onSelectReciter: (reciter: Reciter) => void;
}

type TabType = 'surahs' | 'reciters' | 'radios';

export const Favorites: React.FC<FavoritesProps> = ({
  surahs,
  reciters,
  radios,
  onPlaySurahDirect,
  onOpenReciterPicker,
  onSelectReciter,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('surahs');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const { favoriteSurahIds, favoriteReciterIds, favoriteRadioIds } = useFavoritesStore();

  const favoriteSurahs = useMemo(() => {
    return surahs.filter((s) => favoriteSurahIds.includes(s.id));
  }, [surahs, favoriteSurahIds]);

  const favoriteRecitersList = useMemo(() => {
    return reciters.filter((r) => favoriteReciterIds.includes(r.id));
  }, [reciters, favoriteReciterIds]);

  const favoriteRadiosList = useMemo(() => {
    return radios.filter((r) => favoriteRadioIds.includes(r.id));
  }, [radios, favoriteRadioIds]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Tab Switcher & Layout Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'surahs'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('favorites.tabSurahs', { count: favoriteSurahs.length })}</span>
          </button>

          <button
            onClick={() => setActiveTab('reciters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reciters'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Mic2 className="w-4 h-4" />
            <span>{t('favorites.tabReciters', { count: favoriteRecitersList.length })}</span>
          </button>

          <button
            onClick={() => setActiveTab('radios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'radios'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <RadioIcon className="w-4 h-4" />
            <span>{t('favorites.tabRadios', { count: favoriteRadiosList.length })}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 flex-shrink-0">
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
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'surahs' && (
        <div>
          {favoriteSurahs.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                <Heart className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-300 font-cairo">
                {t('favorites.noFavoriteSurahs')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('favorites.noFavoriteSurahsHint')}
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
              {favoriteSurahs.map((surah) => (
                <SurahCard
                  key={surah.id}
                  surah={surah}
                  layout={layout}
                  onPlayDirect={onPlaySurahDirect}
                  onOpenReciterPicker={onOpenReciterPicker}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reciters' && (
        <div>
          {favoriteRecitersList.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                <Mic2 className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-300 font-cairo">
                {t('favorites.noFavoriteReciters')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('favorites.noFavoriteRecitersHint')}
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
              {favoriteRecitersList.map((reciter) => (
                <ReciterCard
                  key={reciter.id}
                  reciter={reciter}
                  layout={layout}
                  onSelectReciter={onSelectReciter}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'radios' && (
        <div>
          {favoriteRadiosList.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                <RadioIcon className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-300 font-cairo">
                {t('favorites.noFavoriteRadios')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('favorites.noFavoriteRadiosHint')}
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
              {favoriteRadiosList.map((radio) => (
                <RadioCard key={radio.id} radio={radio} layout={layout} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
