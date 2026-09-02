import { create } from 'zustand';
import type { ActiveTrack, QueueItem, RepeatMode } from '@/shared/types';
import { useHistoryStore } from './useHistoryStore';
import { useSettingsStore } from './useSettingsStore';

// Create a single global audio instance
let audioElement: HTMLAudioElement | null = null;
let lastProgressSave = 0;

function getAudio(): HTMLAudioElement {
  if (!audioElement && typeof window !== 'undefined') {
    audioElement = new Audio();
    audioElement.preload = 'auto';
  }
  return audioElement!;
}

interface PlayerStoreState {
  currentTrack: ActiveTrack | null;
  queue: QueueItem[];
  queueIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  autoNext: boolean;

  // Actions
  playTrack: (track: ActiveTrack, queue?: QueueItem[], initialPosition?: number) => void;
  playRadio: (radioId: number, radioName: string, streamUrl: string) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleAutoNext: () => void;
  setQueue: (queue: QueueItem[], startIndex?: number) => void;
  initAudioListeners: () => void;
}

export const usePlayerStore = create<PlayerStoreState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  isLoading: false,
  progress: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  repeatMode: 'off',
  autoNext: true,

  initAudioListeners: () => {
    const audio = getAudio();

    audio.onplay = () => {
      set({ isPlaying: true });
      const current = get().currentTrack;
      if (current && window.electronAPI) {
        const title = current.type === 'radio' ? (current.radioName || 'إذاعة') : (current.surahName || 'سورة');
        const sub = current.type === 'radio' ? 'بث مباشر' : current.reciterName;
        window.electronAPI.tray.updateTrackInfo(title, sub, true);
      }
    };

    audio.onpause = () => {
      set({ isPlaying: false });
      const current = get().currentTrack;
      if (current && window.electronAPI) {
        const title = current.type === 'radio' ? (current.radioName || 'إذاعة') : (current.surahName || 'سورة');
        const sub = current.type === 'radio' ? 'بث مباشر' : current.reciterName;
        window.electronAPI.tray.updateTrackInfo(title, sub, false);
      }
    };

    audio.onwaiting = () => {
      set({ isLoading: true });
    };

    audio.onplaying = () => {
      set({ isLoading: false, isPlaying: true });
    };

    audio.onloadedmetadata = () => {
      set({ duration: audio.duration || 0, isLoading: false });
    };

    audio.ontimeupdate = () => {
      const currentPos = audio.currentTime;
      const duration = audio.duration || 0;
      set({ progress: currentPos });

      // Save position to history throttled every 4 seconds
      const now = Date.now();
      if (now - lastProgressSave > 4000) {
        lastProgressSave = now;
        const current = get().currentTrack;
        if (current && current.type === 'surah' && current.reciterId && current.moshafId && current.surahId) {
          useHistoryStore.getState().updatePosition(
            current.reciterId,
            current.moshafId,
            current.surahId,
            Math.floor(currentPos),
            Math.floor(duration)
          );
        }
      }
    };

    audio.onended = () => {
      const { repeatMode, autoNext } = get();

      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
        return;
      }

      if (autoNext) {
        get().nextTrack();
      } else {
        set({ isPlaying: false, progress: 0 });
      }
    };

    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      set({ isPlaying: false, isLoading: false });
    };

    // Listen to OS media key events from Electron main process
    if (window.electronAPI) {
      window.electronAPI.onMediaAction((action) => {
        switch (action) {
          case 'toggle':
            get().togglePlay();
            break;
          case 'play':
            get().resume();
            break;
          case 'pause':
            get().pause();
            break;
          case 'next':
            get().nextTrack();
            break;
          case 'prev':
            get().prevTrack();
            break;
        }
      });
    }
  },

  playTrack: (track, queue, initialPosition = 0) => {
    const audio = getAudio();
    audio.src = track.audioUrl;
    audio.currentTime = initialPosition;
    audio.playbackRate = get().playbackRate;
    audio.volume = get().isMuted ? 0 : get().volume;

    set({
      currentTrack: track,
      isLoading: true,
      progress: initialPosition,
    });

    if (queue) {
      const index = queue.findIndex(
        (q) => q.surahId === track.surahId && q.reciterId === track.reciterId && q.moshafId === track.moshafId
      );
      set({ queue, queueIndex: index !== -1 ? index : 0 });
    }

    audio
      .play()
      .then(() => {
        set({ isPlaying: true, isLoading: false });

        // Add to history
        if (track.type === 'surah' && track.reciterId && track.moshafId && track.surahId) {
          useHistoryStore.getState().addHistoryItem({
            reciterId: track.reciterId,
            reciterName: track.reciterName || '',
            moshafId: track.moshafId,
            moshafName: track.moshafName || '',
            surahId: track.surahId,
            surahName: track.surahName || '',
            server: track.server || '',
            positionSeconds: initialPosition,
            durationSeconds: 0,
          });
        }

        // Send native notification if enabled
        if (useSettingsStore.getState().notificationsEnabled && window.electronAPI) {
          const title = track.surahName ? `سورة ${track.surahName}` : 'تشغيل السورة';
          const body = track.reciterName ? `القارئ: ${track.reciterName}` : 'بدأ الاستماع للقرآن الكريم';
          window.electronAPI.notifications.show(title, body);
        }
      })
      .catch((err) => {
        console.error('Failed to play audio:', err);
        set({ isPlaying: false, isLoading: false });
      });
  },

  playRadio: (radioId, radioName, streamUrl) => {
    const audio = getAudio();
    const track: ActiveTrack = {
      type: 'radio',
      radioId,
      radioName,
      audioUrl: streamUrl,
    };

    audio.src = streamUrl;
    audio.currentTime = 0;
    audio.playbackRate = 1;
    audio.volume = get().isMuted ? 0 : get().volume;

    set({
      currentTrack: track,
      queue: [],
      queueIndex: -1,
      isLoading: true,
      progress: 0,
      duration: 0,
    });

    audio
      .play()
      .then(() => {
        set({ isPlaying: true, isLoading: false });
        if (useSettingsStore.getState().notificationsEnabled && window.electronAPI) {
          window.electronAPI.notifications.show('إذاعة القرآن الكريم', `تم تشغيل ${radioName}`);
        }
      })
      .catch((err) => {
        console.error('Failed to play radio stream:', err);
        set({ isPlaying: false, isLoading: false });
      });
  },

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().resume();
    }
  },

  pause: () => {
    const audio = getAudio();
    audio.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    const audio = getAudio();
    if (audio.src) {
      audio.play().catch(console.error);
    }
  },

  seek: (seconds: number) => {
    const audio = getAudio();
    if (audio.src && get().currentTrack?.type !== 'radio') {
      audio.currentTime = seconds;
      set({ progress: seconds });
    }
  },

  nextTrack: () => {
    const { queue, queueIndex, repeatMode } = get();
    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return; // reached end of queue
      }
    }

    const nextItem = queue[nextIndex];
    if (nextItem) {
      const track: ActiveTrack = {
        type: 'surah',
        surahId: nextItem.surahId,
        surahName: nextItem.surahName,
        reciterId: nextItem.reciterId,
        reciterName: nextItem.reciterName,
        moshafId: nextItem.moshafId,
        moshafName: nextItem.moshafName,
        server: nextItem.server,
        audioUrl: nextItem.audioUrl,
      };
      set({ queueIndex: nextIndex });
      get().playTrack(track, queue);
    }
  },

  prevTrack: () => {
    const { queue, queueIndex, progress } = get();
    const audio = getAudio();

    // If played more than 4 seconds, restart current track first
    if (progress > 4) {
      audio.currentTime = 0;
      set({ progress: 0 });
      return;
    }

    if (queue.length === 0) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevItem = queue[prevIndex];
    if (prevItem) {
      const track: ActiveTrack = {
        type: 'surah',
        surahId: prevItem.surahId,
        surahName: prevItem.surahName,
        reciterId: prevItem.reciterId,
        reciterName: prevItem.reciterName,
        moshafId: prevItem.moshafId,
        moshafName: prevItem.moshafName,
        server: prevItem.server,
        audioUrl: prevItem.audioUrl,
      };
      set({ queueIndex: prevIndex });
      get().playTrack(track, queue);
    }
  },

  setVolume: (volume: number) => {
    const audio = getAudio();
    const clamped = Math.max(0, Math.min(1, volume));
    audio.volume = clamped;
    set({ volume: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    const audio = getAudio();
    const { isMuted, volume } = get();
    if (isMuted) {
      audio.volume = volume || 0.8;
      set({ isMuted: false });
    } else {
      audio.volume = 0;
      set({ isMuted: true });
    }
  },

  setPlaybackRate: (rate: number) => {
    const audio = getAudio();
    audio.playbackRate = rate;
    set({ playbackRate: rate });
    useSettingsStore.getState().setPlaybackRate(rate);
  },

  setRepeatMode: (repeatMode: RepeatMode) => {
    set({ repeatMode });
  },

  toggleAutoNext: () => {
    const next = !get().autoNext;
    set({ autoNext: next });
    useSettingsStore.getState().setAutoNext(next);
  },

  setQueue: (queue: QueueItem[], startIndex = 0) => {
    set({ queue, queueIndex: startIndex });
  },
}));
