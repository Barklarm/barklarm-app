import { app, BrowserWindow, nativeImage } from 'electron';
import { join } from 'path';

export const _hide = (window: any) => {
  return (event: any) => {
    event.preventDefault();
    window.hide();
  };
};

export class AppWindow {
  public readonly window: BrowserWindow;
  private readonly IconPath: string = join(__dirname, '..', 'assets', 'icon.png');

  constructor(url: string, preload: string) {
    this.window = this.createWindow(url, preload);
  }

  createWindow(url: string, preload: string): BrowserWindow {
    const window = new BrowserWindow({
      title: 'Barklarm - Configuration',
      icon: nativeImage.createFromPath(this.IconPath),
      show: false,
      webPreferences: {
        preload: preload,
      },
    });
    window.setMenu(null);
    window.loadURL(url);
    if (!app.isPackaged) window.webContents.openDevTools();
    const hide = _hide(window);
    window.on('minimize', hide);
    window.on('close', hide);
    return window;
  }
}
