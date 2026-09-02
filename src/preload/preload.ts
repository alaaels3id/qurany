import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '../shared/types';

const electronAPI: ElectronAPI = {
  app: {
    minimizeToTray: () => ipcRenderer.invoke('app:minimizeToTray'),
    quit: () => ipcRenderer.invoke('app:quit'),
    minimizeWindow: () => ipcRenderer.invoke('app:minimizeWindow'),
    maximizeWindow: () => ipcRenderer.invoke('app:maximizeWindow'),
    closeWindow: () => ipcRenderer.invoke('app:closeWindow'),
    isMaximized: () => ipcRenderer.invoke('app:isMaximized'),
  },
  tray: {
    updateTrackInfo: (title: string, subtitle?: string, isPlaying?: boolean) =>
      ipcRenderer.invoke('tray:updateTrackInfo', title, subtitle, isPlaying),
  },
  notifications: {
    show: (title: string, body: string) =>
      ipcRenderer.invoke('notifications:show', title, body),
  },
  onMediaAction: (callback) => {
    const subscription = (_event: any, action: 'play' | 'pause' | 'next' | 'prev' | 'toggle') => {
      callback(action);
    };
    ipcRenderer.on('media-action', subscription);
    return () => {
      ipcRenderer.removeListener('media-action', subscription);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
