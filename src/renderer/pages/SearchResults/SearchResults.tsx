import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Mic2, Radio as RadioIcon, X, Sparkles, List, LayoutGrid } from 'lucide-react';
import type { Surah, Reciter, Radio } from '@/shared/types';
import { SurahCard } from '@/renderer/components/SurahCard/SurahCard';
import { ReciterCard } from '@/renderer/components/ReciterCard/ReciterCard';
import { RadioCard } from '@/renderer/components/RadioCard/RadioCard';
import { matchesArabic } from '@/renderer/utils/search';

interface SearchResultsProps {
  query: string;
  surahs: Surah[];
  reciters: Reciter[];
  radios: Radio[];
  onClearSearch: () => void;
  onPlaySurahDirect: (surah: Surah) => void;
  onSelectReciter: (reciter: Reciter) => void;
  onOpenReciterPicker?: (surah: Surah) => void;
}

type SearchTab = 'all' | 'reciters' | 'surahs' | 'radios';

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  surahs,
  reciters,
  radios,
  onClearSearch,
  onPlaySurahDirect,
  onSelectReciter,
  onOpenReciterPicker,
}) => {
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  // Filter surahs
  const matchingSurahs = useMemo(() => {
    if (!query.trim()) return [];
    const trimmed = query.trim().toLowerCase();
    return surahs.filter((s) => {
      const matchAr = matchesArabic(s.name, query);
      const matchEn = s.name_en?.toLowerCase().includes(trimmed) || (s as any).englishName?.toLowerCase().includes(trimmed);
      const matchId = String(s.id) === trimmed || String(s.id) === query.trim();
      return matchAr || matchEn || matchId;
    });
  }, [surahs, query]);

  // Filter reciters
  const matchingReciters = useMemo(() => {
    if (!query.trim()) return [];
    return reciters.filter((r) => matchesArabic(r.name, query));
  }, [reciters, query]);

  // Filter radios
  const matchingRadios = useMemo(() => {
    if (!query.trim()) return [];
    return radios.filter((r) => matchesArabic(r.name, query));
  }, [radios, query]);

  const totalResults = matchingSurahs.length + matchingReciters.length + matchingRadios.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none pb-12">
      {/* Search Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-brand-950/50 dark:via-dark-card dark:to-dark-card border border-brand-500/25 shadow-md dark:shadow-none flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
              نتائج البحث عن: &ldquo;{query}&rdquo;
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            عثرنا على <span className="font-bold text-brand-600 dark:text-brand-400">{totalResults}</span> نتيجة مطابقة في السور والقراء والمحطات
          </p>
        </div>

        <button
          onClick={onClearSearch}
          className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm dark:shadow-none"
        >
          <X className="w-4 h-4" />
          <span>إلغاء البحث</span>
        </button>
      </div>

      {/* Tabs Filter Bar & Layout Switcher */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel w-fit overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              الكل ({totalResults})
            </button>

            {matchingReciters.length > 0 && (
              <button
                onClick={() => setActiveTab('reciters')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'reciters'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>القراء ({matchingReciters.length})</span>
              </button>
            )}

            {matchingSurahs.length > 0 && (
              <button
                onClick={() => setActiveTab('surahs')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'surahs'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>السور ({matchingSurahs.length})</span>
              </button>
            )}

            {matchingRadios.length > 0 && (
              <button
                onClick={() => setActiveTab('radios')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'radios'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <RadioIcon className="w-3.5 h-3.5" />
                <span>الإذاعات ({matchingRadios.length})</span>
              </button>
            )}
          </div>

          {/* Layout Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 flex-shrink-0">
            <button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-lg transition-all ${
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
              className={`p-2 rounded-lg transition-all ${
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
      )}

      {/* Empty State */}
      {totalResults === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <Sparkles className="w-8 h-8 opacity-40" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-cairo">
              لم يتم العثور على أي نتائج تطابق &ldquo;{query}&rdquo;
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              تأكد من كتابة اسم السورة أو القارئ بشكل صحيح، أو جرب البحث بكلمات أخرى.
            </p>
          </div>
          <button
            onClick={onClearSearch}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all"
          >
            العودة للصفحة السابقة
          </button>
        </div>
      )}

      {/* 1. Reciters Section */}
      {(activeTab === 'all' || activeTab === 'reciters') && matchingReciters.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
              القراء والمصاحف ({matchingReciters.length})
            </h4>
          </div>
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-3'
            }
          >
            {matchingReciters.map((reciter) => (
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

      {/* 2. Surahs Section */}
      {(activeTab === 'all' || activeTab === 'surahs') && matchingSurahs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500 dark:text-brand-400" />
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
              سور القرآن الكريم ({matchingSurahs.length})
            </h4>
          </div>
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-3'
            }
          >
            {matchingSurahs.map((surah) => (
              <SurahCard
                key={surah.id}
                surah={surah}
                layout={layout}
                onPlayDirect={onPlaySurahDirect}
                onOpenReciterPicker={onOpenReciterPicker}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Radios Section */}
      {(activeTab === 'all' || activeTab === 'radios') && matchingRadios.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <RadioIcon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
              إذاعات البث المباشر ({matchingRadios.length})
            </h4>
          </div>
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-3'
            }
          >
            {matchingRadios.map((radio) => (
              <RadioCard key={radio.id} radio={radio} layout={layout} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
