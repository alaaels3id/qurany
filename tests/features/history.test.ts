import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryStore } from '@/renderer/store/useHistoryStore';

describe('Feature: Playback History & Resume', () => {
  beforeEach(() => {
    useHistoryStore.setState({
      history: [],
      lastPlayed: null,
    });
  });

  it('adds history items and updates lastPlayed', () => {
    const { addHistoryItem } = useHistoryStore.getState();

    addHistoryItem({
      reciterId: 54,
      reciterName: 'مشاري العفاسي',
      moshafId: 1,
      moshafName: 'حفص عن عاصم',
      surahId: 1,
      surahName: 'الفاتحة',
      server: 'https://server8.mp3quran.net/afs/',
      positionSeconds: 0,
      durationSeconds: 180,
    });

    const state = useHistoryStore.getState();
    expect(state.history.length).toBe(1);
    expect(state.lastPlayed).not.toBeNull();
    expect(state.lastPlayed?.surahId).toBe(1);
    expect(state.lastPlayed?.reciterName).toBe('مشاري العفاسي');
  });

  it('updates position and duration for current playback', () => {
    const { addHistoryItem, updatePosition } = useHistoryStore.getState();

    addHistoryItem({
      reciterId: 54,
      reciterName: 'مشاري العفاسي',
      moshafId: 1,
      moshafName: 'حفص عن عاصم',
      surahId: 18,
      surahName: 'الكهف',
      server: 'https://server8.mp3quran.net/afs/',
      positionSeconds: 0,
      durationSeconds: 1800,
    });

    updatePosition(54, 1, 18, 450, 1800);

    const state = useHistoryStore.getState();
    expect(state.lastPlayed?.positionSeconds).toBe(450);
    expect(state.history[0].positionSeconds).toBe(450);
  });

  it('clears all history and lastPlayed', () => {
    const { addHistoryItem, clearHistory } = useHistoryStore.getState();

    addHistoryItem({
      reciterId: 54,
      reciterName: 'مشاري العفاسي',
      moshafId: 1,
      moshafName: 'حفص عن عاصم',
      surahId: 1,
      surahName: 'الفاتحة',
      server: 'https://server8.mp3quran.net/afs/',
      positionSeconds: 0,
      durationSeconds: 180,
    });

    expect(useHistoryStore.getState().history.length).toBe(1);

    clearHistory();

    const state = useHistoryStore.getState();
    expect(state.history.length).toBe(0);
    expect(state.lastPlayed).toBeNull();
  });
});
