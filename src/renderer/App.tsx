import React, { useState, useEffect } from 'react';
import type { Surah, Reciter, Riwayah, Radio, RecentRead } from '@/shared/types';
import { Mp3QuranApi } from './services/mp3quran/api';
import { AudioUrlBuilder } from './services/mp3quran/urlBuilder';
import { usePlayerStore } from './store/usePlayerStore';
import { Sidebar, PageId } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
import { MoshafModal } from './components/MoshafModal/MoshafModal';
import { ReciterPickerModal } from './components/ReciterPickerModal/ReciterPickerModal';

// Pages
import { Home } from './pages/Home/Home';
import { Surahs } from './pages/Surahs/Surahs';
import { Reciters } from './pages/Reciters/Reciters';
import { RadioPage } from './pages/Radio/Radio';
import { Favorites } from './pages/Favorites/Favorites';
import { Settings } from './pages/Settings/Settings';
import { SearchResults } from './pages/SearchResults/SearchResults';
import { Skeleton } from './components/Skeleton/Skeleton';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [riwayat, setRiwayat] = useState<Riwayah[]>([]);
  const [radios, setRadios] = useState<Radio[]>([]);
  const [recentReads, setRecentReads] = useState<RecentRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedSurahForReciter, setSelectedSurahForReciter] = useState<Surah | null>(null);

  const { initAudioListeners, playTrack } = usePlayerStore();

  // Initialize Audio & Listeners on mount
  useEffect(() => {
    initAudioListeners();
  }, [initAudioListeners]);

  // Load API Catalog Data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const [suwarData, recitersData, riwayatData, radiosData, readsData] = await Promise.all([
          Mp3QuranApi.getSuwar(),
          Mp3QuranApi.getReciters(),
          Mp3QuranApi.getRiwayat(),
          Mp3QuranApi.getRadios(),
          Mp3QuranApi.getRecentReads(),
        ]);

        if (isMounted) {
          setSurahs(suwarData);
          setReciters(recitersData);
          setRiwayat(riwayatData);
          setRadios(radiosData);
          setRecentReads(readsData);
        }
      } catch (error) {
        console.error('Error loading Quran catalog data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Quick play surah using default or first available reciter
  const handlePlaySurahDirect = (surah: Surah) => {
    // Pick first available reciter (or Mishary Alafasy if present)
    const reciter =
      reciters.find((r) => r.id === 54) ||
      reciters.find((r) =>
        r.moshaf?.some((m) => {
          const list = m.surah_list?.split(',').map((id) => parseInt(id.trim(), 10));
          return list?.includes(surah.id);
        })
      ) ||
      reciters[0];

    if (!reciter || !reciter.moshaf || reciter.moshaf.length === 0) return;

    const moshaf =
      reciter.moshaf.find((m) => {
        const list = m.surah_list?.split(',').map((id) => parseInt(id.trim(), 10));
        return list?.includes(surah.id);
      }) || reciter.moshaf[0];

    const audioUrl = AudioUrlBuilder.buildSurahUrl(moshaf.server, surah.id);

    playTrack({
      type: 'surah',
      surahId: surah.id,
      surahName: surah.name,
      reciterId: reciter.id,
      reciterName: reciter.name,
      moshafId: moshaf.id,
      moshafName: moshaf.name,
      server: moshaf.server,
      audioUrl,
    });
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* 1. Permanent Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          setSearchQuery('');
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-3xl" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
              </div>
            </div>
          ) : searchQuery.trim() ? (
            <SearchResults
              query={searchQuery}
              surahs={surahs}
              reciters={reciters}
              radios={radios}
              onClearSearch={() => setSearchQuery('')}
              onPlaySurahDirect={handlePlaySurahDirect}
              onSelectReciter={setSelectedReciter}
              onOpenReciterPicker={setSelectedSurahForReciter}
            />
          ) : (
            <>
              {currentPage === 'home' && (
                <Home
                  surahs={surahs}
                  reciters={reciters}
                  radios={radios}
                  recentReads={recentReads}
                  onNavigate={setCurrentPage}
                  onSelectReciter={setSelectedReciter}
                  onPlaySurahDirect={handlePlaySurahDirect}
                />
              )}

              {currentPage === 'surahs' && (
                <Surahs
                  surahs={surahs}
                  searchQuery={searchQuery}
                  onPlayDirect={handlePlaySurahDirect}
                  onOpenReciterPicker={setSelectedSurahForReciter}
                />
              )}

              {currentPage === 'reciters' && (
                <Reciters
                  reciters={reciters}
                  riwayat={riwayat}
                  searchQuery={searchQuery}
                  onSelectReciter={setSelectedReciter}
                />
              )}

              {currentPage === 'radio' && (
                <RadioPage radios={radios} searchQuery={searchQuery} />
              )}

              {currentPage === 'favorites' && (
                <Favorites
                  surahs={surahs}
                  reciters={reciters}
                  radios={radios}
                  onPlaySurahDirect={handlePlaySurahDirect}
                  onOpenReciterPicker={setSelectedSurahForReciter}
                  onSelectReciter={setSelectedReciter}
                />
              )}

              {currentPage === 'settings' && <Settings />}
            </>
          )}
        </main>

        {/* 3. Persistent Bottom Audio Player */}
        <AudioPlayer />
      </div>

      {/* Reciter Details & Moshaf Modal */}
      {selectedReciter && (
        <MoshafModal
          reciter={selectedReciter}
          onClose={() => setSelectedReciter(null)}
        />
      )}

      {/* Reciter Picker for Specific Surah Modal */}
      {selectedSurahForReciter && (
        <ReciterPickerModal
          surah={selectedSurahForReciter}
          reciters={reciters}
          onClose={() => setSelectedSurahForReciter(null)}
        />
      )}
    </div>
  );
};
