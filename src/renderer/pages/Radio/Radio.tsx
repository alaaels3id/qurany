import React, { useState, useMemo } from 'react';
import { Radio as RadioIcon, List, LayoutGrid } from 'lucide-react';
import type { Radio } from '@/shared/types';
import { RadioCard } from '@/renderer/components/RadioCard/RadioCard';
import { matchesArabic } from '@/renderer/utils/search';

interface RadioPageProps {
  radios: Radio[];
  searchQuery: string;
}

export const RadioPage: React.FC<RadioPageProps> = ({ radios, searchQuery }) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('list');

  const filteredRadios = useMemo(() => {
    if (!searchQuery.trim()) return radios;
    return radios.filter((r) => matchesArabic(r.name, searchQuery));
  }, [radios, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-emerald-950/40 dark:via-dark-card dark:to-dark-card border border-brand-500/20 shadow-md dark:shadow-none flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-cairo">
              محطات الإذاعة الإسلامية المباشرة
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            بث صوتي حي متواصل لتلاوات القرآن الكريم على مدار 24 ساعة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
            المحطات المتاحة: <span className="text-brand-600 dark:text-brand-400 font-bold">{filteredRadios.length}</span>
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
      </div>

      {/* Radios List / Grid */}
      {filteredRadios.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <RadioIcon className="w-8 h-8 opacity-40" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-300 font-cairo">
            لم يتم العثور على أي إذاعة
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">تأكد من كتابة اسم الإذاعة بشكل صحيح</p>
        </div>
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-3'
          }
        >
          {filteredRadios.map((radio) => (
            <RadioCard key={radio.id} radio={radio} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
};
