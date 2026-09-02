import React, { useState, useMemo } from 'react';
import { X, Play, Pause, Search, Heart } from 'lucide-react';
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

        {/* Search within Reciter's Surahs */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/5 bg-slate-50/40 dark:bg-dark-bg/20">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={surahSearch}
              onChange={(e) => setSurahSearch(e.target.value)}
              placeholder="ابحث في سور هذا المصحف..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500/50"
            />
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSurahs.map((surah) => {
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
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer group hover:border-brand-500/40 hover:bg-slate-50 dark:hover:bg-white/5 ${
                  isCurrent
                    ? 'bg-brand-50/80 dark:bg-brand-500/15 border-brand-500/50 text-brand-700 dark:text-brand-400 font-bold'
                    : 'bg-slate-50/50 dark:bg-white/5 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isCurrent
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:text-white'
                    }`}
                  >
                    {surah.id}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm font-amiri text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      سورة {surah.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {surah.ayahCount} آية • {surah.makkia === 1 ? 'مكية' : 'مدنية'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent && isPlaying
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-200/70 dark:bg-white/5 group-hover:bg-brand-500 group-hover:text-white text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCurrent && isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current mr-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
