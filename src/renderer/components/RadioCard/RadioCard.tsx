import React from 'react';
import { Radio as RadioIcon, Play, Pause, Heart, Activity } from 'lucide-react';
import type { Radio } from '@/shared/types';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';

interface RadioCardProps {
  radio: Radio;
  layout?: 'grid' | 'list';
}

export const RadioCard: React.FC<RadioCardProps> = ({ radio, layout = 'grid' }) => {
  const { currentTrack, isPlaying, playRadio, togglePlay } = usePlayerStore();
  const { isFavoriteRadio, toggleFavoriteRadio } = useFavoritesStore();

  const isCurrent = currentTrack?.type === 'radio' && currentTrack.radioId === radio.id;
  const isFavorite = isFavoriteRadio(radio.id);

  const handlePlayToggle = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playRadio(radio.id, radio.name, radio.url);
    }
  };

  if (layout === 'list') {
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-2xl glass-panel transition-all duration-200 group hover:border-brand-500/40 hover:bg-slate-50/50 dark:hover:bg-white/5 ${
          isCurrent
            ? 'border-brand-500/60 bg-gradient-to-r from-brand-50/70 to-white dark:from-brand-950/20 dark:to-dark-card shadow-md shadow-brand-500/5'
            : ''
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 transition-all ${
              isCurrent
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400'
            }`}
          >
            <RadioIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                {radio.name}
              </h3>
              {isCurrent && isPlaying && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  مباشر
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>إذاعة إسلامية</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 mr-4">
          <button
            onClick={() => toggleFavoriteRadio(radio.id)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>

          <button
            onClick={handlePlayToggle}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isCurrent && isPlaying
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-brand-500 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200 dark:border-white/10 hover:border-brand-400'
            }`}
            title={isCurrent && isPlaying ? 'إيقاف البث' : 'تشغيل البث'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current mr-0.5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-2xl glass-panel transition-all duration-300 relative group hover:border-brand-500/40 hover:bg-slate-50/50 dark:hover:bg-white/5 hover:-translate-y-1 flex flex-col justify-between ${
        isCurrent
          ? 'border-brand-500/60 bg-gradient-to-b from-brand-50/70 to-white dark:from-brand-950/20 dark:to-dark-card shadow-lg shadow-brand-500/5'
          : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
              isCurrent
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400'
            }`}
          >
            <RadioIcon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {isCurrent && isPlaying && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                مباشر
              </span>
            )}

            <button
              onClick={() => toggleFavoriteRadio(radio.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
              title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo mb-2 group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors">
          {radio.name}
        </h3>
      </div>

      <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>إذاعة إسلامية</span>
        </div>

        <button
          onClick={handlePlayToggle}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isCurrent && isPlaying
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
              : 'bg-slate-100 dark:bg-white/5 hover:bg-brand-500 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200 dark:border-white/10 hover:border-brand-400'
          }`}
          title={isCurrent && isPlaying ? 'إيقاف البث' : 'تشغيل البث'}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current mr-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
