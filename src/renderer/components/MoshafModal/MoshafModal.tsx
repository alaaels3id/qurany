import React, { useState, useMemo } from 'react';
import { X, Play, Pause, Search, Heart, List, LayoutGrid } from 'lucide-react';
import type { Reciter, Moshaf } from '@/shared/types';
import { QURAN_SURAHS } from '@/shared/constants/quran';
import { AudioUrlBuilder } from '@/renderer/services/mp3quran/urlBuilder';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';

interface MoshafModalProps {
  reciter: Reciter | null;
  onClose: () => void;
}

export const MoshafModal: React.FC<MoshafModalProps> = ({ reciter, onClose }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isFavoriteReciter, toggleFavoriteReciter } = useFavoritesStore();

  const [selectedMoshafIndex, setSelectedMoshafIndex] = useState(0);
  const [surahSearch, setSurahSearch] = useState('');
  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  if (!reciter) return null;

  const currentMoshaf: Moshaf | undefined = reciter.moshaf?.[selectedMoshafIndex] || reciter.moshaf?.[0];
  const isFavorite = isFavoriteReciter(reciter.id);

  // Parse available surahs from moshaf.surah_list ("1,2,3...114")
  const availableSurahIds = useMemo(() => {
    if (!currentMoshaf?.surah_list) return [];
    return currentMoshaf.surah_list
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }, [currentMoshaf]);

  const surahsForMoshaf = useMemo(() => {
    return QURAN_SURAHS.filter((s) => availableSurahIds.includes(s.id));
  }, [availableSurahIds]);

  const filteredSurahs = useMemo(() => {
    if (!surahSearch.trim()) return surahsForMoshaf;
    const query = surahSearch.trim().toLowerCase();
    return surahsForMoshaf.filter(
      (s) =>
        s.name.includes(query) ||
        s.englishName.toLowerCase().includes(query) ||
        String(s.id).includes(query)
    );
  }, [surahsForMoshaf, surahSearch]);

  const handlePlaySurah = (surah: typeof QURAN_SURAHS[0]) => {
    if (!currentMoshaf) return;

    // Build entire queue for this moshaf
    const queue = surahsForMoshaf.map((s) => ({
      surahId: s.id,
      surahName: s.name,
      reciterId: reciter.id,
      reciterName: reciter.name,
      moshafId: currentMoshaf.id,
      moshafName: currentMoshaf.name,
      server: currentMoshaf.server,
      audioUrl: AudioUrlBuilder.buildSurahUrl(currentMoshaf.server, s.id),
    }));

    const track = {
      type: 'surah' as const,
      surahId: surah.id,
      surahName: surah.name,
      reciterId: reciter.id,
      reciterName: reciter.name,
      moshafId: currentMoshaf.id,
      moshafName: currentMoshaf.name,
      server: currentMoshaf.server,
      audioUrl: AudioUrlBuilder.buildSurahUrl(currentMoshaf.server, surah.id),
    };

    playTrack(track, queue);
  };

  const handlePlayAll = () => {
    if (surahsForMoshaf.length > 0) {
      handlePlaySurah(surahsForMoshaf[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-white dark:from-brand-950/40 dark:via-dark-card dark:to-dark-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 dark:from-brand-700 dark:to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 font-bold text-xl font-amiri">
              {reciter.name[0] || 'ق'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo">
                  القارئ {reciter.name}
                </h2>
                <button
                  onClick={() => toggleFavoriteReciter(reciter.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                  title="المفضلة"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                متاح {reciter.moshaf?.length || 1} مصاحف وروايات • {availableSurahIds.length} سورة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>تشغيل الكل</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Moshafs / Riwayat Selector Tabs */}
        {reciter.moshaf && reciter.moshaf.length > 1 && (
          <div className="px-6 py-3 border-b border-slate-200/80 dark:border-white/5 flex items-center gap-2 overflow-x-auto bg-slate-50/80 dark:bg-dark-bg/40">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2">المصحف / الرواية:</span>
            {reciter.moshaf.map((moshaf, idx) => (
              <button
                key={moshaf.id || idx}
                onClick={() => setSelectedMoshafIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedMoshafIndex === idx
                    ? 'bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
              >
                {moshaf.name} ({moshaf.surah_total} سورة)
              </button>
            ))}
          </div>
        )}

        {/* Search within Reciter's Surahs & Layout Switcher */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/5 bg-slate-50/40 dark:bg-dark-bg/20 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={surahSearch}
              onChange={(e) => setSurahSearch(e.target.value)}
              placeholder="ابحث في سور هذا المصحف..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 flex-shrink-0">
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-all ${
                layout === 'list'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="عرض قائمة"
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
              title="عرض شبكي"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Surahs Container */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
            layout === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 gap-3'
              : 'space-y-2'
          }`}
        >
          {filteredSurahs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 col-span-full">
              لم يتم العثور على سورة تطابق البحث
            </div>
          ) : (
            filteredSurahs.map((surah) => {
              const isCurrent =
                currentTrack?.type === 'surah' &&
                currentTrack.surahId === surah.id &&
                currentTrack.reciterId === reciter.id &&
                currentTrack.moshafId === currentMoshaf?.id;

              return (
                <div
                  key={surah.id}
                  onClick={() => {
                    if (isCurrent) {
                      togglePlay();
                    } else {
                      handlePlaySurah(surah);
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer group hover:border-brand-500/40 hover:bg-slate-50 dark:hover:bg-white/5 ${
                    isCurrent
                      ? 'bg-brand-50/80 dark:bg-brand-500/15 border-brand-500/50 text-brand-700 dark:text-brand-400 font-bold'
                      : 'bg-slate-50/50 dark:bg-white/5 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300 group-hover:text-slate-800 dark:group-hover:bg-white/10 dark:group-hover:text-white'
                      }`}
                    >
                      {surah.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm font-amiri text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          سورة {surah.name}
                        </h4>
                        {layout === 'list' && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              surah.makkia === 1
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {surah.makkia === 1 ? 'مكية' : 'مدنية'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {surah.ayahCount} آية
                        {layout !== 'list' && (
                          <> • {surah.makkia === 1 ? 'مكية' : 'مدنية'}</>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {layout === 'list' && isCurrent && isPlaying && (
                      <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        جاري الاستماع
                      </span>
                    )}

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isCurrent && isPlaying
                          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                          : 'bg-slate-200/70 dark:bg-white/5 group-hover:bg-brand-500 group-hover:text-white text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current mr-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
