import React, { useState, useMemo } from 'react';
import { Heart, BookOpen, Mic2, Radio as RadioIcon } from 'lucide-react';
import type { Surah, Reciter, Radio } from '@/shared/types';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';
import { SurahCard } from '@/renderer/components/SurahCard/SurahCard';
import { ReciterCard } from '@/renderer/components/ReciterCard/ReciterCard';
import { RadioCard } from '@/renderer/components/RadioCard/RadioCard';

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
  const [activeTab, setActiveTab] = useState<TabType>('surahs');
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
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel w-fit">
        <button
          onClick={() => setActiveTab('surahs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'surahs'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>السور المفضلة ({favoriteSurahs.length})</span>
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
          <span>القراء المفضلون ({favoriteRecitersList.length})</span>
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
          <span>الإذاعات المفضلة ({favoriteRadiosList.length})</span>
        </button>
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
                لا توجد سور في المفضلة بعد
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                انقر على أيقونة القلب في بطاقة السورة لإضافتها هنا
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteSurahs.map((surah) => (
                <SurahCard
                  key={surah.id}
                  surah={surah}
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
                لا يوجد قراء في المفضلة بعد
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                انقر على أيقونة القلب في بطاقة القارئ للوصول السريع إليه
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteRecitersList.map((reciter) => (
                <ReciterCard
                  key={reciter.id}
                  reciter={reciter}
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
                لا توجد إذاعات في المفضلة بعد
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                انقر على أيقونة القلب بجانب الإذاعة لإضافتها للمفضلة
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteRadiosList.map((radio) => (
                <RadioCard key={radio.id} radio={radio} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
