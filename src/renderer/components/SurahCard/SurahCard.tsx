import React from 'react';
import { Play, Pause, Heart, User } from 'lucide-react';
import type { Surah } from '@/shared/types';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';
import { useTranslation } from '@/renderer/i18n';

interface SurahCardProps {
  surah: Surah;
  onPlayDirect: (surah: Surah) => void;
  onOpenReciterPicker?: (surah: Surah) => void;
  layout?: 'grid' | 'list';
}

export const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  onPlayDirect,
  onOpenReciterPicker,
  layout = 'grid',
}) => {
  const { t, isRTL } = useTranslation();
  const { isFavoriteSurah, toggleFavoriteSurah } = useFavoritesStore();
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();

  const isFavorite = isFavoriteSurah(surah.id);
  const isCurrentSurah =
    currentTrack?.type === 'surah' && currentTrack.surahId === surah.id;

  const isMakki = surah.makkia === 1;
  const displayName = isRTL ? surah.name : (surah.name_en || (surah as any).englishName || surah.name);
  const secondaryName = isRTL ? (surah.name_en || (surah as any).englishName || '') : surah.name;

  if (layout === 'list') {
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-2xl glass-panel transition-all duration-200 group hover:border-brand-500/40 hover:bg-slate-50/50 dark:hover:bg-white/5 ${
          isCurrentSurah ? 'border-brand-500/50 bg-brand-50/50 dark:bg-brand-500/10' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-amiri font-bold text-lg border transition-all ${
              isCurrentSurah
                ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/30'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 group-hover:border-brand-500/30 group-hover:text-brand-600 dark:group-hover:text-brand-400'
            }`}
          >
            {surah.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo">
                {t('common.surah')} {displayName}
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isMakki
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {isMakki ? t('common.makki') : t('common.madani')}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{surah.ayah_count || '—'} {t('common.ayah')}</span>
              {surah.start_page && (
                <>
                  <span>•</span>
                  <span>{t('common.page')} {surah.start_page}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenReciterPicker && (
            <button
              onClick={() => onOpenReciterPicker(surah)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title={t('common.chooseReciterAndMoshaf')}
            >
              <User className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
              <span>{t('common.chooseReciter')}</span>
            </button>
          )}

          <button
            onClick={() => toggleFavoriteSurah(surah.id)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
            title={isFavorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>

          <button
            onClick={() => {
              if (isCurrentSurah) {
                togglePlay();
              } else {
                onPlayDirect(surah);
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isCurrentSurah && isPlaying
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-brand-500 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200 dark:border-white/10 hover:border-brand-400'
            }`}
            title={isCurrentSurah && isPlaying ? t('common.pause') : t('common.play')}
          >
            {isCurrentSurah && isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current rtl:mr-0.5 ltr:ml-0.5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Grid Layout (Default)
  return (
    <div
      className={`p-5 rounded-2xl glass-panel transition-all duration-300 relative group hover:border-brand-500/40 hover:bg-slate-50/50 dark:hover:bg-white/5 hover:-translate-y-1 flex flex-col justify-between ${
        isCurrentSurah
          ? 'border-brand-500/60 bg-gradient-to-b from-brand-50/70 to-white dark:from-brand-950/20 dark:to-dark-card shadow-lg shadow-brand-500/5'
          : ''
      }`}
    >
      <div>
        {/* Top bar: Number & Favorite */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm border transition-all ${
              isCurrentSurah
                ? 'bg-brand-500 text-white border-brand-400'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 group-hover:border-brand-500/30 group-hover:text-brand-600 dark:group-hover:text-brand-400'
            }`}
          >
            {surah.id}
          </span>

          <div className="flex items-center gap-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isMakki
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isMakki ? t('common.makki') : t('common.madani')}
            </span>

            <button
              onClick={() => toggleFavoriteSurah(surah.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
              title={isFavorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Surah Name & Transliteration */}
        <div className="mb-4 text-start">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-amiri group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors">
            {t('common.surah')} {displayName}
          </h3>
          {secondaryName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              {secondaryName}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata & Play Controls */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between">
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          <div>{surah.ayah_count || '—'} {t('common.ayah')}</div>
          {surah.start_page && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500">{t('common.page')} {surah.start_page}</div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenReciterPicker && (
            <button
              onClick={() => onOpenReciterPicker(surah)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
              title={t('common.chooseReciterAndMoshaf')}
            >
              <User className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              if (isCurrentSurah) {
                togglePlay();
              } else {
                onPlayDirect(surah);
              }
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isCurrentSurah && isPlaying
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-brand-500 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200 dark:border-white/10 hover:border-brand-400'
            }`}
            title={isCurrentSurah && isPlaying ? t('common.pause') : t('common.play')}
          >
            {isCurrentSurah && isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current rtl:mr-0.5 ltr:ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
