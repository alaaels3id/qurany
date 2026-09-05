export type SurahType = 0 | 1; // 0: Makki, 1: Madani

export interface Surah {
  id: number;
  name: string;
  name_en?: string;
  name_translation?: string;
  start_page?: number;
  end_page?: number;
  makkia: SurahType; // 1 = Makki, 0 = Madani in API, or vice-versa
  type?: string;
  ayah_count?: number;
}

export interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type: number;
  surah_list: string; // Comma-separated surah IDs e.g. "1,2,3,4..."
}

export interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

export interface Riwayah {
  id: number;
  name: string;
}

export interface Radio {
  id: number;
  name: string;
  url: string;
  recent_date?: string;
}

export interface RecentRead {
  id: number;
  reciter_id: number;
  reciter_name: string;
  moshaf_id: number;
  moshaf_name: string;
  surah_id: number;
  surah_name?: string;
}

export interface PlaybackHistoryItem {
  id: string;
  reciterId: number;
  reciterName: string;
  moshafId: number;
  moshafName: string;
  surahId: number;
  surahName: string;
  server: string;
  positionSeconds: number;
  durationSeconds: number;
  playedAt: number; // timestamp
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface ActiveTrack {
  type: 'surah' | 'radio';
  surahId?: number;
  surahName?: string;
  reciterId?: number;
  reciterName?: string;
  moshafId?: number;
  moshafName?: string;
  server?: string;
  audioUrl: string;
  radioId?: number;
  radioName?: string;
}

export interface QueueItem {
  surahId: number;
  surahName: string;
  reciterId: number;
  reciterName: string;
  moshafId: number;
  moshafName: string;
  server: string;
  audioUrl: string;
}

export interface PlayerState {
  currentTrack: ActiveTrack | null;
  queue: QueueItem[];
  queueIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0 to 1
  isMuted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  autoNext: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppSettings {
  language: 'ar' | 'en';
  theme: ThemeMode;
  defaultReciterId: number;
  defaultMoshafId: number;
  autoNext: boolean;
  notificationsEnabled: boolean;
  minimizeToTrayOnClose: boolean;
  playbackRate: number;
}

export interface TrayPlayerState {
  title: string;
  subtitle?: string;
  isPlaying: boolean;
  hasTrack: boolean;
  isRadio?: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  canGoNext?: boolean;
  canGoPrev?: boolean;
}

export type MediaActionType =
  | 'play'
  | 'pause'
  | 'toggle'
  | 'stop'
  | 'next'
  | 'prev'
  | 'volume-up'
  | 'volume-down'
  | 'toggle-mute'
  | 'set-speed'
  | 'set-repeat';

export type UpdateStatusType =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error';

export interface UpdateInfoPayload {
  version: string;
  releaseDate?: string;
  releaseNotes?: string | Array<{ note?: string; version?: string }>;
}

export interface UpdateProgressPayload {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

export interface UpdateStatusPayload {
  status: UpdateStatusType;
  currentVersion: string;
  updateInfo?: UpdateInfoPayload;
  progress?: UpdateProgressPayload;
  error?: string;
}

export interface ElectronAPI {
  app: {
    minimizeToTray: () => Promise<void>;
    quit: () => Promise<void>;
    minimizeWindow: () => Promise<void>;
    maximizeWindow: () => Promise<void>;
    closeWindow: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
    toggleFullscreen: () => Promise<boolean>;
  };
  tray: {
    updateTrackInfo: (title: string, subtitle?: string, isPlaying?: boolean) => Promise<void>;
    updatePlayerState: (state: TrayPlayerState) => Promise<void>;
  };
  notifications: {
    show: (title: string, body: string) => Promise<void>;
  };
  updater: {
    check: () => Promise<{ success: boolean; message?: string }>;
    download: () => Promise<{ success: boolean; message?: string }>;
    install: () => Promise<void>;
    getStatus: () => Promise<UpdateStatusPayload>;
    onStatusChange: (callback: (status: UpdateStatusPayload) => void) => () => void;
  };
  onMediaAction: (callback: (action: MediaActionType, payload?: any) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}


