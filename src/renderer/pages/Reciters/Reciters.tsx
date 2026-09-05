import React, { useState, useMemo, useEffect } from 'react';
import { Mic2, Filter, List, LayoutGrid } from 'lucide-react';
import type { Reciter, Riwayah } from '@/shared/types';
import { ReciterCard } from '@/renderer/components/ReciterCard/ReciterCard';
import { matchesArabic } from '@/renderer/utils/search';
import { useTranslation } from '@/renderer/i18n';

interface RecitersProps {
  reciters: Reciter[];
  riwayat: Riwayah[];
  searchQuery: string;
  onSelectReciter: (reciter: Reciter) => void;
}

const ARABIC_LETTERS = [
  'الكل', 'أ', 'إ', 'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

const ENGLISH_LETTERS = [
  'All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const Reciters: React.FC<RecitersProps> = ({
  reciters,
  riwayat,
  searchQuery,
  onSelectReciter,
}) => {
  const { t, isRTL } = useTranslation();
  const letters = isRTL ? ARABIC_LETTERS : ENGLISH_LETTERS;
  const allLetterValue = isRTL ? 'الكل' : 'All';

  const [selectedLetter, setSelectedLetter] = useState<string>(allLetterValue);
  const [selectedRiwayah, setSelectedRiwayah] = useState<number | 'all'>('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');

  // Reset selected letter when switching languages
  useEffect(() => {
    setSelectedLetter(allLetterValue);
  }, [allLetterValue]);

  const filteredReciters = useMemo(() => {
    return reciters.filter((r) => {
      // Letter filter
      if (selectedLetter !== 'الكل' && selectedLetter !== 'All') {
        const firstLetter = r.name.trim()[0]?.toUpperCase();
        if (selectedLetter === 'أ' || selectedLetter === 'إ' || selectedLetter === 'ا') {
          if (!['أ', 'إ', 'ا', 'آ'].includes(firstLetter)) return false;
        } else if (firstLetter !== selectedLetter.toUpperCase()) {
          return false;
        }
      }

      // Riwayah filter
      if (selectedRiwayah !== 'all') {
        const hasRiwayah = r.moshaf?.some((m) => m.moshaf_type === selectedRiwayah);
        if (!hasRiwayah) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchAr = matchesArabic(r.name, searchQuery);
        const matchEn = r.name.toLowerCase().includes(query);
        if (!matchAr && !matchEn) return false;
      }

      return true;
    });
  }, [reciters, selectedLetter, selectedRiwayah, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Alphabet Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-3 rounded-2xl glass-panel pb-3">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`min-w-[34px] h-9 px-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              selectedLetter === letter
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Riwayat Dropdown Filter & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            <span>{t('reciters.riwayahOrMoshaf')}</span>
          </span>

          <select
            value={selectedRiwayah}
            onChange={(e) =>
              setSelectedRiwayah(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500/50 shadow-sm dark:shadow-none"
          >
            <option value="all" className="bg-white dark:bg-dark-card text-slate-800 dark:text-white">
              {t('reciters.allRiwayat')}
            </option>
            {riwayat.map((rw) => (
              <option key={rw.id} value={rw.id} className="bg-white dark:bg-dark-card text-slate-800 dark:text-white">
                {rw.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t('reciters.recitersCount')}{' '}
            <span className="text-brand-600 dark:text-brand-400 font-bold">{filteredReciters.length}</span>
          </div>

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
        </div>
      </div>

      {/* Reciters List / Grid */}
      {filteredReciters.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <Mic2 className="w-8 h-8 opacity-40" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-300 font-cairo">
            {t('reciters.noRecitersFound')}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('reciters.noRecitersFoundHint')}
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
          {filteredReciters.map((reciter) => (
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
  );
};
