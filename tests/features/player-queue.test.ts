import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '@/renderer/store/usePlayerStore';

describe('Feature: Audio Player & Queue Management', () => {
  beforeEach(() => {
    usePlayerStore.setState({
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
    });
  });

  describe('Playback & State', () => {
    it('initializes with null current track', () => {
      const state = usePlayerStore.getState();
      expect(state.currentTrack).toBeNull();
      expect(state.isPlaying).toBe(false);
    });

    it('plays a surah track and updates currentTrack', async () => {
      const { playTrack } = usePlayerStore.getState();

      const track = {
        type: 'surah' as const,
        surahId: 1,
        surahName: 'الفاتحة',
        reciterId: 54,
        reciterName: 'مشاري العفاسي',
        moshafId: 1,
        moshafName: 'حفص عن عاصم',
        server: 'https://server8.mp3quran.net/afs/',
        audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
      };

      playTrack(track);
      await Promise.resolve(); // flush audio.play() promise

      const state = usePlayerStore.getState();
      expect(state.currentTrack).toEqual(track);
      expect(state.isPlaying).toBe(true);
    });

    it('plays radio stream and updates currentTrack with radio type', () => {
      const { playRadio } = usePlayerStore.getState();

      playRadio(101, 'إذاعة القرآن الكريم - القاهرة', 'https://stream.radiojar.com/8s5u8tpdtwzuv');

      const state = usePlayerStore.getState();
      expect(state.currentTrack?.type).toBe('radio');
      expect(state.currentTrack?.radioId).toBe(101);
      expect(state.currentTrack?.radioName).toBe('إذاعة القرآن الكريم - القاهرة');
    });

    it('toggles pause and resume', async () => {
      const { playTrack, pause, resume } = usePlayerStore.getState();

      playTrack({
        type: 'surah' as const,
        surahId: 1,
        surahName: 'الفاتحة',
        audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
      });
      await Promise.resolve();

      expect(usePlayerStore.getState().isPlaying).toBe(true);

      pause();
      expect(usePlayerStore.getState().isPlaying).toBe(false);

      resume();
      await Promise.resolve();
      expect(usePlayerStore.getState().isPlaying).toBe(true);
    });
  });

  describe('Queue Navigation', () => {
    const mockQueue = [
      {
        surahId: 1,
        surahName: 'الفاتحة',
        reciterId: 54,
        reciterName: 'مشاري العفاسي',
        moshafId: 1,
        moshafName: 'حفص',
        server: 'https://server8.mp3quran.net/afs/',
        audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
      },
      {
        surahId: 2,
        surahName: 'البقرة',
        reciterId: 54,
        reciterName: 'مشاري العفاسي',
        moshafId: 1,
        moshafName: 'حفص',
        server: 'https://server8.mp3quran.net/afs/',
        audioUrl: 'https://server8.mp3quran.net/afs/002.mp3',
      },
      {
        surahId: 3,
        surahName: 'آل عمران',
        reciterId: 54,
        reciterName: 'مشاري العفاسي',
        moshafId: 1,
        moshafName: 'حفص',
        server: 'https://server8.mp3quran.net/afs/',
        audioUrl: 'https://server8.mp3quran.net/afs/003.mp3',
      },
    ];

    it('navigates to next track in queue', () => {
      const { playTrack, nextTrack } = usePlayerStore.getState();

      // Start at track 0 (Al-Fatihah)
      playTrack(
        {
          type: 'surah',
          ...mockQueue[0],
        },
        mockQueue
      );

      expect(usePlayerStore.getState().queueIndex).toBe(0);

      // Next track -> track 1 (Al-Baqarah)
      nextTrack();
      expect(usePlayerStore.getState().queueIndex).toBe(1);
      expect(usePlayerStore.getState().currentTrack?.surahId).toBe(2);
    });

    it('navigates to previous track in queue', () => {
      const { playTrack, nextTrack, prevTrack } = usePlayerStore.getState();

      playTrack(
        {
          type: 'surah',
          ...mockQueue[0],
        },
        mockQueue
      );

      nextTrack(); // index 1
      expect(usePlayerStore.getState().queueIndex).toBe(1);

      prevTrack(); // back to index 0
      expect(usePlayerStore.getState().queueIndex).toBe(0);
      expect(usePlayerStore.getState().currentTrack?.surahId).toBe(1);
    });
  });

  describe('Audio Controls (Volume, Speed, Repeat)', () => {
    it('changes volume and toggles mute', () => {
      const { setVolume, toggleMute } = usePlayerStore.getState();

      setVolume(0.5);
      expect(usePlayerStore.getState().volume).toBe(0.5);

      toggleMute();
      expect(usePlayerStore.getState().isMuted).toBe(true);

      toggleMute();
      expect(usePlayerStore.getState().isMuted).toBe(false);
    });

    it('changes repeat mode', () => {
      const { setRepeatMode } = usePlayerStore.getState();

      setRepeatMode('all');
      expect(usePlayerStore.getState().repeatMode).toBe('all');

      setRepeatMode('one');
      expect(usePlayerStore.getState().repeatMode).toBe('one');

      setRepeatMode('off');
      expect(usePlayerStore.getState().repeatMode).toBe('off');
    });

    it('changes playback rate', () => {
      const { setPlaybackRate } = usePlayerStore.getState();

      setPlaybackRate(1.25);
      expect(usePlayerStore.getState().playbackRate).toBe(1.25);
    });
  });
});
