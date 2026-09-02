import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  ListMusic,
  Heart,
  Radio as RadioIcon,
  Sparkles,
  Gauge,
} from 'lucide-react';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';
import { useFavoritesStore } from '@/renderer/store/useFavoritesStore';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hours = Math.floor(mins / 60);

  if (hours > 0) {
    const remMins = mins % 60;
    return `${hours}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const AudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    progress,
    duration,
    volume,
    isMuted,
    playbackRate,
    repeatMode,
    autoNext,
    queue,
    queueIndex,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setRepeatMode,
    toggleAutoNext,
    playTrack,
  } = usePlayerStore();

  const { isFavoriteSurah, toggleFavoriteSurah, isFavoriteRadio, toggleFavoriteRadio } =
    useFavoritesStore();

  const [showQueue, setShowQueue] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!currentTrack) {
    return (
      <div className="h-24 glass-player flex items-center justify-between px-8 text-slate-500 dark:text-slate-400 select-none border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Sparkles className="w-5 h-5 opacity-60" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">لم يتم اختيار تلاوة بعد</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">اختر سورة أو قارئ أو محطة إذاعية للبدء</div>
          </div>
        </div>
      </div>
    );
  }

  const isRadio = currentTrack.type === 'radio';
  const isFavorite = isRadio
    ? currentTrack.radioId
      ? isFavoriteRadio(currentTrack.radioId)
      : false
    : currentTrack.surahId
    ? isFavoriteSurah(currentTrack.surahId)
    : false;

  const handleFavoriteToggle = () => {
    if (isRadio && currentTrack.radioId) {
      toggleFavoriteRadio(currentTrack.radioId);
    } else if (currentTrack.surahId) {
      toggleFavoriteSurah(currentTrack.surahId);
    }
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <>
      <div className="h-24 glass-player flex items-center justify-between px-8 z-30 relative select-none border-t border-slate-200/80 dark:border-white/5">
        {/* Left: Track Details */}
        <div className="flex items-center gap-4 w-1/4 min-w-[240px]">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 dark:from-brand-900 dark:to-emerald-700/80 border border-brand-500/30 flex items-center justify-center text-white shadow-lg shadow-brand-500/10 flex-shrink-0">
            {isRadio ? (
              <RadioIcon className="w-7 h-7 text-white dark:text-emerald-300" />
            ) : (
              <span className="font-amiri font-bold text-2xl text-white dark:text-emerald-200">
                {currentTrack.surahId || 'ق'}
              </span>
            )}

            {/* Active Soundwave Indicator */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center gap-0.5 px-2 backdrop-blur-[1px]">
                <span className="w-1 bg-emerald-400 rounded-full animate-wave" style={{ animationDelay: '0s' }} />
                <span className="w-1 bg-emerald-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-emerald-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 font-cairo truncate">
                {isRadio ? currentTrack.radioName : `سورة ${currentTrack.surahName || ''}`}
              </h4>
              <button
                onClick={handleFavoriteToggle}
                title="إضافة للمفضلة"
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              {isRadio ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  بث مباشر
                </span>
              ) : (
                <>
                  <span>{currentTrack.reciterName}</span>
                  {currentTrack.moshafName && (
                    <span className="text-slate-400 dark:text-slate-500">• {currentTrack.moshafName}</span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center justify-center max-w-xl w-full px-4">
          <div className="flex items-center gap-5 mb-1.5">
            {/* Repeat Mode */}
            {!isRadio && (
              <button
                onClick={cycleRepeatMode}
                title={
                  repeatMode === 'off'
                    ? 'التكرار متوقف'
                    : repeatMode === 'one'
                    ? 'تكرار السورة الحالية'
                    : 'تكرار القائمة بالكامل'
                }
                className={`p-2 rounded-xl text-xs transition-colors ${
                  repeatMode !== 'off'
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            )}

            {/* Previous Track */}
            <button
              onClick={prevTrack}
              disabled={isRadio || queue.length === 0}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-600 transition-transform active:scale-95"
              title="السورة السابقة"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all duration-150"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white mr-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              disabled={isRadio || queue.length === 0}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-600 transition-transform active:scale-95"
              title="السورة التالية"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Auto Next Indicator */}
            {!isRadio && (
              <button
                onClick={toggleAutoNext}
                title={autoNext ? 'التشغيل التلقائي مفعل' : 'التشغيل التلقائي معطل'}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  autoNext
                    ? 'border-brand-500/40 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                AUTO
              </button>
            )}
          </div>

          {/* Progress Timeline */}
          {!isRadio ? (
            <div className="w-full flex items-center gap-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono w-10 text-left">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono w-10 text-right">
                {formatTime(duration)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>البث الصوتي المباشر مستمر</span>
            </div>
          )}
        </div>

        {/* Right: Volume, Speed & Queue Drawer Toggle */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[240px]">
          {/* Playback Speed dropdown */}
          {!isRadio && (
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-all"
                title="سرعة التلاوة"
              >
                <Gauge className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full mb-2 left-0 w-28 bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-1 z-50">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 px-3 py-1 font-semibold">السرعة</div>
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackRate(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        playbackRate === speed
                          ? 'bg-brand-500/15 text-brand-700 dark:text-brand-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {speed}x {speed === 1 && '(عادي)'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Volume Control */}
          <div className="flex items-center gap-2 group">
            <button
              onClick={toggleMute}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-brand-500"
            />
          </div>

          {/* Queue Drawer Toggle */}
          {!isRadio && (
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2.5 rounded-xl border transition-all ${
                showQueue
                  ? 'bg-brand-500/15 text-brand-700 dark:text-brand-400 border-brand-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/10'
              }`}
              title="قائمة الانتظار (Queue)"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Queue Drawer Overlay */}
      {showQueue && !isRadio && (
        <div className="absolute bottom-24 left-6 w-96 max-h-[480px] bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-4 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-brand-500 dark:text-brand-400" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 font-cairo">
                قائمة التشغيل ({queue.length})
              </h3>
            </div>
            <button
              onClick={() => setShowQueue(false)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              إغلاق
            </button>
          </div>

          <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-white/5">
            {queue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                لا توجد سور في قائمة التشغيل
              </div>
            ) : (
              queue.map((item, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <button
                    key={`${item.surahId}_${idx}`}
                    onClick={() => {
                      playTrack(
                        {
                          type: 'surah',
                          surahId: item.surahId,
                          surahName: item.surahName,
                          reciterId: item.reciterId,
                          reciterName: item.reciterName,
                          moshafId: item.moshafId,
                          moshafName: item.moshafName,
                          server: item.server,
                          audioUrl: item.audioUrl,
                        },
                        queue
                      );
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all group ${
                      isCurrent
                        ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/20 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono ${
                          isCurrent
                            ? 'bg-brand-500 text-white'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}
                      >
                        {item.surahId}
                      </span>
                      <div>
                        <div className="text-sm font-semibold">سورة {item.surahName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          {item.reciterName}
                        </div>
                      </div>
                    </div>

                    {isCurrent && isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 dark:bg-brand-400 animate-ping mr-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};
