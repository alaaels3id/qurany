import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import type { UpdateStatusPayload } from '../shared/types';

let currentStatus: UpdateStatusPayload = {
  status: 'idle',
  currentVersion: app.getVersion() || '1.1.0',
};

let currentWindow: BrowserWindow | null = null;

function broadcastStatus(newStatus: Partial<UpdateStatusPayload>) {
  currentStatus = {
    ...currentStatus,
    currentVersion: app.getVersion() || '1.1.0',
    ...newStatus,
  };

  if (currentWindow && !currentWindow.isDestroyed()) {
    currentWindow.webContents.send('updater:status', currentStatus);
  }
}

export function initAutoUpdater(mainWindow: BrowserWindow) {
  currentWindow = mainWindow;

  // Don't auto download silently; let the user see and trigger download
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  // Logging (optional console)
  autoUpdater.logger = console;

  autoUpdater.on('checking-for-update', () => {
    broadcastStatus({ status: 'checking', error: undefined });
  });

  autoUpdater.on('update-available', (info) => {
    broadcastStatus({
      status: 'available',
      updateInfo: {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes as any,
      },
      error: undefined,
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    broadcastStatus({
      status: 'not-available',
      updateInfo: {
        version: info.version,
      },
      error: undefined,
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    broadcastStatus({
      status: 'downloading',
      progress: {
        bytesPerSecond: progressObj.bytesPerSecond,
        percent: Math.round(progressObj.percent * 10) / 10,
        transferred: progressObj.transferred,
        total: progressObj.total,
      },
      error: undefined,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    broadcastStatus({
      status: 'downloaded',
      updateInfo: {
        version: info.version,
      },
      error: undefined,
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('AutoUpdater error:', err);
    // In dev mode without GitHub releases package, provide a friendly message
    const isDev = !app.isPackaged;
    const msg = isDev
      ? 'وضع التطوير (Development Mode): لا تتوفر حزم GitHub Releases محلية.'
      : err?.message || 'فشل التحقق من وجود تحديثات';

    broadcastStatus({
      status: isDev ? 'not-available' : 'error',
      error: msg,
    });
  });
}

export async function checkForUpdates(): Promise<{ success: boolean; message?: string }> {
  broadcastStatus({ status: 'checking', error: undefined });

  if (!app.isPackaged) {
    // In dev mode, simulate checking GitHub releases
    return new Promise((resolve) => {
      setTimeout(() => {
        broadcastStatus({
          status: 'not-available',
          currentVersion: app.getVersion() || '1.1.0',
        });
        resolve({ success: true, message: 'التطبيق على أحدث إصدار' });
      }, 1000);
    });
  }

  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, message: result?.updateInfo?.version };
  } catch (error: any) {
    broadcastStatus({
      status: 'error',
      error: error?.message || 'تعذر الاتصال بخادم التحديثات',
    });
    return { success: false, message: error?.message };
  }
}

export async function downloadUpdate(): Promise<{ success: boolean; message?: string }> {
  broadcastStatus({ status: 'downloading', error: undefined });

  if (!app.isPackaged) {
    // In dev mode simulate download progress
    return new Promise((resolve) => {
      let percent = 0;
      const interval = setInterval(() => {
        percent += 20;
        broadcastStatus({
          status: 'downloading',
          progress: {
            bytesPerSecond: 1024 * 1024 * 2.5,
            percent: Math.min(100, percent),
            transferred: (percent / 100) * 85000000,
            total: 85000000,
          },
        });

        if (percent >= 100) {
          clearInterval(interval);
          broadcastStatus({ status: 'downloaded' });
          resolve({ success: true });
        }
      }, 500);
    });
  }

  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error: any) {
    broadcastStatus({
      status: 'error',
      error: error?.message || 'فشل تنزيل ملف التحديث',
    });
    return { success: false, message: error?.message };
  }
}

export function quitAndInstallUpdate() {
  if (!app.isPackaged) {
    console.log('[Dev] Simulated quit and install update');
    broadcastStatus({ status: 'idle' });
    return;
  }
  autoUpdater.quitAndInstall(false, true);
}

export function getUpdaterStatus(): UpdateStatusPayload {
  return {
    ...currentStatus,
    currentVersion: app.getVersion() || '1.1.0',
  };
}
