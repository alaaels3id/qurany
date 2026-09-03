import { Tray, Menu, nativeImage, BrowserWindow, app, NativeImage } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { TrayPlayerState } from '../shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tray: Tray | null = null;

let playerState: TrayPlayerState = {
  title: 'قرآني - Quran Desktop',
  subtitle: '',
  isPlaying: false,
  hasTrack: false,
  isRadio: false,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  repeatMode: 'off',
  canGoNext: false,
  canGoPrev: false,
};

function getTrayIcon(): NativeImage {
  const candidatePaths = [
    path.join(__dirname, '../../dist/icon.png'),
    path.join(__dirname, '../../build/icon.png'),
    path.join(__dirname, '../../public/icon.png'),
    path.join(process.resourcesPath || '', 'build/icon.png'),
    path.join(process.resourcesPath || '', 'icon.png'),
    path.join(app.getAppPath(), 'dist/icon.png'),
    path.join(app.getAppPath(), 'build/icon.png'),
    path.join(app.getAppPath(), 'public/icon.png'),
  ];

  for (const iconPath of candidatePaths) {
    if (fs.existsSync(iconPath)) {
      const img = nativeImage.createFromPath(iconPath);
      if (!img.isEmpty()) {
        return img.resize({ width: 18, height: 18 });
      }
    }
  }

  return nativeImage.createEmpty();
}

function toggleWindow(mainWindow: BrowserWindow) {
  if (mainWindow.isDestroyed()) return;

  if (mainWindow.isVisible()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
      mainWindow.focus();
    } else {
      mainWindow.hide();
    }
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

export function createSystemTray(mainWindow: BrowserWindow): Tray {
  const icon = getTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('قرآني - Quran Desktop');

  updateTrayMenu(mainWindow);

  tray.on('click', () => {
    toggleWindow(mainWindow);
  });

  return tray;
}

export function updateTrayTrackInfo(
  mainWindow: BrowserWindow,
  title: string,
  subtitle?: string,
  isPlaying?: boolean
) {
  playerState.title = title;
  playerState.subtitle = subtitle || '';
  playerState.hasTrack = true;
  if (isPlaying !== undefined) {
    playerState.isPlaying = isPlaying;
  }
  updateTrayMenu(mainWindow);
}

export function updateTrayPlayerState(
  mainWindow: BrowserWindow,
  state: Partial<TrayPlayerState>
) {
  playerState = { ...playerState, ...state };
  updateTrayMenu(mainWindow);
}

export function updateTrayMenu(mainWindow: BrowserWindow) {
  if (!tray || mainWindow.isDestroyed()) return;

  // macOS status title
  if (process.platform === 'darwin') {
    if (playerState.isPlaying && playerState.hasTrack) {
      const cleanTitle = playerState.title.length > 24
        ? `${playerState.title.slice(0, 24)}...`
        : playerState.title;
      tray.setTitle(` ${cleanTitle}`);
    } else {
      tray.setTitle('');
    }
  }

  // Tooltip
  const tooltip = playerState.hasTrack
    ? `قرآني: ${playerState.title}${playerState.subtitle ? ` (${playerState.subtitle})` : ''} - ${playerState.isPlaying ? 'مشغل' : 'متوقف'}`
    : 'قرآني - Quran Desktop';
  tray.setToolTip(tooltip);

  // Status header
  let statusHeader = '⏹️ لا توجد تلاوة قيد التشغيل';
  if (playerState.hasTrack) {
    const icon = playerState.isPlaying ? '🟢' : '⏸️';
    statusHeader = `${icon} ${playerState.title}${playerState.subtitle ? ` • ${playerState.subtitle}` : ''}`;
  }

  const effectiveVolume = playerState.isMuted ? 0 : Math.round(playerState.volume * 100);

  const contextMenu = Menu.buildFromTemplate([
    // 1. Now Playing Info
    {
      label: statusHeader,
      enabled: false,
    },
    { type: 'separator' },

    // 2. Playback Controls
    {
      label: playerState.isPlaying
        ? '⏸️ إيقاف مؤقت'
        : playerState.hasTrack
        ? '▶️ استئناف التشغيل'
        : '▶️ تشغيل',
      enabled: playerState.hasTrack,
      click: () => {
        mainWindow.webContents.send('media-action', 'toggle');
      },
    },
    {
      label: '⏭️ السورة التالية',
      enabled: Boolean(playerState.hasTrack && !playerState.isRadio && playerState.canGoNext !== false),
      click: () => {
        mainWindow.webContents.send('media-action', 'next');
      },
    },
    {
      label: '⏮️ السورة السابقة',
      enabled: Boolean(playerState.hasTrack && !playerState.isRadio && playerState.canGoPrev !== false),
      click: () => {
        mainWindow.webContents.send('media-action', 'prev');
      },
    },
    {
      label: '⏹️ إيقاف التلاوة',
      enabled: playerState.hasTrack,
      click: () => {
        mainWindow.webContents.send('media-action', 'stop');
      },
    },
    { type: 'separator' },

    // 3. Audio & Volume Control
    {
      label: `🔊 مستوى الصوت (${effectiveVolume}%)`,
      submenu: [
        {
          label: '🔊 رفع الصوت (+10%)',
          click: () => {
            mainWindow.webContents.send('media-action', 'volume-up');
          },
        },
        {
          label: '🔉 خفض الصوت (-10%)',
          click: () => {
            mainWindow.webContents.send('media-action', 'volume-down');
          },
        },
        { type: 'separator' },
        {
          label: playerState.isMuted ? '🔊 إلغاء كتم الصوت' : '🔇 كتم الصوت',
          click: () => {
            mainWindow.webContents.send('media-action', 'toggle-mute');
          },
        },
      ],
    },

    // 4. Playback Speed Submenu
    {
      label: `⚡ سرعة التلاوة (${playerState.playbackRate}x)`,
      enabled: Boolean(playerState.hasTrack && !playerState.isRadio),
      submenu: [0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => ({
        label: `${rate}x${rate === 1.0 ? ' (طبيعي)' : ''}`,
        type: 'radio',
        checked: playerState.playbackRate === rate,
        click: () => {
          mainWindow.webContents.send('media-action', 'set-speed', rate);
        },
      })),
    },

    // 5. Repeat Mode Submenu
    {
      label: '🔁 وضع التكرار',
      enabled: Boolean(playerState.hasTrack && !playerState.isRadio),
      submenu: [
        {
          label: 'إيقاف التكرار',
          type: 'radio',
          checked: playerState.repeatMode === 'off',
          click: () => {
            mainWindow.webContents.send('media-action', 'set-repeat', 'off');
          },
        },
        {
          label: 'تكرار السورة الحالية',
          type: 'radio',
          checked: playerState.repeatMode === 'one',
          click: () => {
            mainWindow.webContents.send('media-action', 'set-repeat', 'one');
          },
        },
        {
          label: 'تكرار القائمة بالكامل',
          type: 'radio',
          checked: playerState.repeatMode === 'all',
          click: () => {
            mainWindow.webContents.send('media-action', 'set-repeat', 'all');
          },
        },
      ],
    },
    { type: 'separator' },

    // 6. Window Controls
    {
      label: mainWindow.isVisible() ? '👁 إخفاء التطبيق' : '👁 إظهار التطبيق',
      click: () => {
        toggleWindow(mainWindow);
      },
    },
    {
      label: '❌ إغلاق قرآني نهائياً',
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}
