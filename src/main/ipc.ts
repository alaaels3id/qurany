import { ipcMain, BrowserWindow, app } from 'electron';
import { updateTrayTrackInfo } from './tray';
import { showNotification } from './notifications';

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  // App Window Controls
  ipcMain.handle('app:minimizeToTray', () => {
    mainWindow.hide();
  });

  ipcMain.handle('app:quit', () => {
    (app as any).isQuitting = true;
    app.quit();
  });

  ipcMain.handle('app:minimizeWindow', () => {
    mainWindow.minimize();
  });

  ipcMain.handle('app:maximizeWindow', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('app:closeWindow', () => {
    mainWindow.close();
  });

  ipcMain.handle('app:isMaximized', () => {
    return mainWindow.isMaximized();
  });

  // System Tray Updates
  ipcMain.handle(
    'tray:updateTrackInfo',
    (_event, title: string, subtitle?: string, isPlaying?: boolean) => {
      updateTrayTrackInfo(mainWindow, title, subtitle, isPlaying);
    }
  );

  // Notifications
  ipcMain.handle('notifications:show', (_event, title: string, body: string) => {
    showNotification(title, body);
  });
}
