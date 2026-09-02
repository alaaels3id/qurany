import { globalShortcut, BrowserWindow } from 'electron';

export function registerGlobalShortcuts(mainWindow: BrowserWindow) {
  const shortcuts: Array<{ accelerator: string; action: 'toggle' | 'next' | 'prev' }> = [
    { accelerator: 'MediaPlayPause', action: 'toggle' },
    { accelerator: 'MediaNextTrack', action: 'next' },
    { accelerator: 'MediaPreviousTrack', action: 'prev' },
    { accelerator: 'Alt+Space', action: 'toggle' },
  ];

  for (const { accelerator, action } of shortcuts) {
    try {
      globalShortcut.register(accelerator, () => {
        if (!mainWindow.isDestroyed()) {
          mainWindow.webContents.send('media-action', action);
        }
      });
    } catch (err) {
      console.warn(`Failed to register shortcut: ${accelerator}`, err);
    }
  }
}

export function unregisterGlobalShortcuts() {
  try {
    globalShortcut.unregisterAll();
  } catch (err) {
    console.warn('Failed to unregister shortcuts', err);
  }
}
