import React, { useState } from 'react';
import { Play, Pause, Clock, Flame, ChevronLeft, Mic2, Radio as RadioIcon, BookOpen, List, LayoutGrid } from 'lucide-react';
import type { Surah, Reciter, Radio, RecentRead } from '@/shared/types';
import { useHistoryStore } from '@/renderer/store/useHistoryStore';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';
import { AudioUrlBuilder } from '@/renderer/services/mp3quran/urlBuilder';
import { SurahCard } from '@/renderer/components/SurahCard/SurahCard';
import { ReciterCard } from '@/renderer/components/ReciterCard/ReciterCard';
import { RadioCard } from '@/renderer/components/RadioCard/RadioCard';
import { useTranslation } from '@/renderer/i18n';
import type { PageId } from '@/renderer/components/Sidebar/Sidebar';

interface HomeProps {
  surahs: Surah[];
  reciters: Reciter[];
  radios: Radio[];
  recentReads: RecentRead[];
  onNavigate: (page: PageId) => void;
  onSelectReciter: (reciter: Reciter) => void;
  onPlaySurahDirect: (surah: Surah) => void;
}

export const Home: React.FC<HomeProps> = ({
  surahs,
  reciters,
  radios,
  onNavigate,
  onSelectReciter,
  onPlaySurahDirect,
}) => {
  const { t, isRTL } = useTranslation();
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const { lastPlayed } = useHistoryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const isResumingCurrent =
    lastPlayed &&
    currentTrack?.type === 'surah' &&
    currentTrack.surahId === lastPlayed.surahId &&
    currentTrack.reciterId === lastPlayed.reciterId;

  const handleResumeLastPlayed = () => {
    if (!lastPlayed) return;
    if (isResumingCurrent) {
      togglePlay();
      return;
    }

    const audioUrl = AudioUrlBuilder.buildSurahUrl(lastPlayed.server, lastPlayed.surahId);
    playTrack(
      {
        type: 'surah',
        surahId: lastPlayed.surahId,
        surahName: lastPlayed.surahName,
        reciterId: lastPlayed.reciterId,
        reciterName: lastPlayed.reciterName,
        moshafId: lastPlayed.moshafId,
        moshafName: lastPlayed.moshafName,
        server: lastPlayed.server,
        audioUrl,
      },
      undefined,
      lastPlayed.positionSeconds || 0
    );
  };

  // Top popular surahs
  const quickSurahs = surahs.filter((s) => [1, 18, 36, 55, 67, 112].includes(s.id));
  const featuredReciters = reciters.slice(0, 4);
  const featuredRadios = radios.slice(0, 3);

  const chevronClass = `w-4 h-4 transition-transform ${isRTL ? '' : 'rotate-180'}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero: Continue Listening / Featured Card */}
      {lastPlayed ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-brand-950 dark:via-dark-card dark:to-dark-card border border-brand-500/25 p-8 shadow-md dark:shadow-2xl">
          <div className="absolute top-0 left-0 -mt-8 -ml-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('home.continueListening')}</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-cairo">
                  {t('home.surahTitle', { name: lastPlayed.surahName })}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {t('home.reciterWithMoshaf', {
                    reciter: lastPlayed.reciterName,
                    moshaf: lastPlayed.moshafName,
                  })}
                </p>
              </div>

              {lastPlayed.durationSeconds > 0 && (
                <div className="w-64 space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 dark:bg-brand-400 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (lastPlayed.positionSeconds / lastPlayed.durationSeconds) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 text-start">
                    {t('home.remainingMinutes', {
                      minutes: Math.max(
                        0,
                        Math.floor((lastPlayed.durationSeconds - lastPlayed.positionSeconds) / 60)
                      ),
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleResumeLastPlayed}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all"
              title={isResumingCurrent && isPlaying ? t('home.pausePlayback') : t('home.resumePlayback')}
            >
              {isResumingCurrent && isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white rtl:mr-1 ltr:ml-1" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-emerald-950/60 dark:via-dark-card dark:to-dark-card border border-brand-500/20 p-8 shadow-md dark:shadow-xl">
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">{t('home.bismillah')}</span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-cairo">
                {t('home.heroAyah')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('home.heroDesc')}
              </p>
            </div>
            <button
              onClick={() => onNavigate('surahs')}
              className="px-5 py-3 rounded-2xl bg-brand-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('home.browseSurahs')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Quick Access Surahs */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
              {t('home.featuredSurahs')}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 flex-shrink-0">
              <button
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded-lg transition-all ${
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
                className={`p-1.5 rounded-lg transition-all ${
                  layout === 'grid'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={t('home.gridView')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('surahs')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <span>{t('home.viewAllSurahs')}</span>
              <ChevronLeft className={chevronClass} />
            </button>
          </div>
        </div>

        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {quickSurahs.map((surah) => (
            <SurahCard
              key={surah.id}
              surah={surah}
              layout={layout}
              onPlayDirect={onPlaySurahDirect}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Featured Reciters */}
      {featuredReciters.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
                {t('home.featuredReciters')}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('reciters')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <span>{t('home.allRecitersAndMoshafs')}</span>
              <ChevronLeft className={chevronClass} />
            </button>
          </div>

          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
                : 'space-y-3'
            }
          >
            {featuredReciters.map((reciter) => (
              <ReciterCard
                key={reciter.id}
                reciter={reciter}
                layout={layout}
                onSelectReciter={onSelectReciter}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Live Radios */}
      {featuredRadios.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RadioIcon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
                {t('home.liveRadios')}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('radio')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <span>{t('home.allRadios')}</span>
              <ChevronLeft className={chevronClass} />
            </button>
          </div>

          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {featuredRadios.map((radio) => (
              <RadioCard key={radio.id} radio={radio} layout={layout} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
