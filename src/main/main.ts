import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSystemTray } from './tray';
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from './shortcuts';
import { registerIpcHandlers } from './ipc';
import { initAutoUpdater } from './updater';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Process environment
const distPath = path.join(__dirname, '../../dist');
process.env.DIST = distPath;
process.env.VITE_PUBLIC = app.isPackaged
  ? distPath
  : path.join(__dirname, '../../public');

let mainWindow: BrowserWindow | null = null;
(app as any).isQuitting = false;

function createWindow() {
  const iconPath = app.isPackaged
    ? path.join(distPath, 'icon.png')
    : path.join(__dirname, '../../build/icon.png');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'قرآني - Quran Desktop',
    icon: iconPath,
    backgroundColor: '#0a0f18',
    frame: true, // Clean native frame with title
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // required for secure contextBridge + ipcRenderer
    },
  });

  // Security headers & permissions
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    // Allow media notifications
    callback(true);
  });

  // Load renderer
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(distPath, 'index.html'));
  }

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load URL:', errorCode, errorDescription, validatedURL);
  });

  // Register Tray, IPC, Shortcuts and Updater
  createSystemTray(mainWindow);
  registerGlobalShortcuts(mainWindow);
  registerIpcHandlers(mainWindow);
  initAutoUpdater(mainWindow);

  // Minimize to tray on close if not quitting explicitly
  mainWindow.on('close', (event) => {
    if (!(app as any).isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on('before-quit', () => {
  (app as any).isQuitting = true;
});

app.on('will-quit', () => {
  unregisterGlobalShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
