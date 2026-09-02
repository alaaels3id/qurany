import { Tray, Menu, nativeImage, BrowserWindow, app, NativeImage } from 'electron';

let tray: Tray | null = null;
let currentTrackTitle = 'قرآني - متوقف';
let isTrackPlaying = false;

// Generate a simple clean native icon dynamically if asset not found
function createTrayIcon(): NativeImage {
  // Simple 16x16 transparent or SVG-compatible icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`;
  return nativeImage.createFromBuffer(Buffer.from(svg));
}

export function createSystemTray(mainWindow: BrowserWindow): Tray {
  const icon = createTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('قرآني - Quran Desktop');

  updateTrayMenu(mainWindow);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    } else {
      mainWindow.show();
    }
  });

  return tray;
}

export function updateTrayTrackInfo(
  mainWindow: BrowserWindow,
  title: string,
  subtitle?: string,
  isPlaying?: boolean
) {
  currentTrackTitle = subtitle ? `${title} (${subtitle})` : title;
  if (isPlaying !== undefined) {
    isTrackPlaying = isPlaying;
  }
  if (tray) {
    tray.setToolTip(`قرآني: ${currentTrackTitle}`);
    updateTrayMenu(mainWindow);
  }
}

function updateTrayMenu(mainWindow: BrowserWindow) {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: currentTrackTitle,
      enabled: false,
    },
    { type: 'separator' },
    {
      label: isTrackPlaying ? '⏸ إيقاف مؤقت' : '▶ تشغيل',
      click: () => {
        mainWindow.webContents.send('media-action', 'toggle');
      },
    },
    {
      label: '⏭ السورة التالية',
      click: () => {
        mainWindow.webContents.send('media-action', 'next');
      },
    },
    {
      label: '⏮ السورة السابقة',
      click: () => {
        mainWindow.webContents.send('media-action', 'prev');
      },
    },
    { type: 'separator' },
    {
      label: mainWindow.isVisible() ? 'إخفاء التطبيق' : 'فتح التطبيق',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'إغلاق تماماً',
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}
