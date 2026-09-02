import React, { useState, useMemo } from 'react';
import { X, Search, Mic2, Play } from 'lucide-react';
import type { Surah, Reciter } from '@/shared/types';
import { AudioUrlBuilder } from '@/renderer/services/mp3quran/urlBuilder';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';

interface ReciterPickerModalProps {
  surah: Surah | null;
  reciters: Reciter[];
  onClose: () => void;
}

export const ReciterPickerModal: React.FC<ReciterPickerModalProps> = ({
  surah,
  reciters,
  onClose,
}) => {
  const { playTrack } = usePlayerStore();
  const [search, setSearch] = useState('');

  if (!surah) return null;

  // Filter reciters who actually have this surah
  const availableReciters = useMemo(() => {
    return reciters.filter((r) => {
      if (!r.moshaf || r.moshaf.length === 0) return false;
      return r.moshaf.some((m) => {
        if (!m.surah_list) return false;
        const list = m.surah_list.split(',').map((id) => parseInt(id.trim(), 10));
        return list.includes(surah.id);
      });
    });
  }, [reciters, surah.id]);

  const filteredReciters = useMemo(() => {
    if (!search.trim()) return availableReciters;
    const query = search.trim().toLowerCase();
    return availableReciters.filter((r) => r.name.toLowerCase().includes(query));
  }, [availableReciters, search]);

  const handleSelectReciter = (reciter: Reciter) => {
    // Find the moshaf that contains this surah
    const moshaf = reciter.moshaf.find((m) => {
      const list = m.surah_list.split(',').map((id) => parseInt(id.trim(), 10));
      return list.includes(surah.id);
    }) || reciter.moshaf[0];

    if (!moshaf) return;

    const audioUrl = AudioUrlBuilder.buildSurahUrl(moshaf.server, surah.id);
    const track = {
      type: 'surah' as const,
      surahId: surah.id,
      surahName: surah.name,
      reciterId: reciter.id,
      reciterName: reciter.name,
      moshafId: moshaf.id,
      moshafName: moshaf.name,
      server: moshaf.server,
      audioUrl,
    };

    playTrack(track);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200 select-none">
      <div className="bg-dark-card border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-cairo">
              اختيار القارئ لسورة {surah.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اختر القارئ المفضل للاستماع إلى هذه السورة
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/5 bg-dark-bg/20">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن اسم القارئ..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500/40"
            />
          </div>
        </div>

        {/* Reciters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-white/5">
          {filteredReciters.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              لم يتم العثور على قارئ يطابق البحث
            </div>
          ) : (
            filteredReciters.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => handleSelectReciter(reciter)}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-right transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-400 transition-all">
                    <Mic2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-brand-400 transition-colors">
                      {reciter.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {reciter.moshaf?.[0]?.name || 'المصحف المرتل'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تشغيل</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
