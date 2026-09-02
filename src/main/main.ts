import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSystemTray } from './tray';
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from './shortcuts';
import { registerIpcHandlers } from './ipc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Process environment
process.env.DIST = path.join(__dirname, '../..');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let mainWindow: BrowserWindow | null = null;
(app as any).isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'قرآني - Quran Desktop',
    backgroundColor: '#0a0f18',
    frame: true, // Clean native frame with title
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
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
    mainWindow.loadFile(path.join(process.env.DIST || path.join(__dirname, '../..'), 'index.html'));
  }

  // Register Tray, IPC and Shortcuts
  createSystemTray(mainWindow);
  registerGlobalShortcuts(mainWindow);
  registerIpcHandlers(mainWindow);

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
