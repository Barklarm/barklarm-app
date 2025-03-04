import { app, BrowserWindow, nativeImage } from 'electron';
import { join } from 'path';
import { translate } from '../i18n';

export const _hide = (window: any) => {
  return (event: any) => {
    event.preventDefault();
    window.hide();
  };
};

export class AppWindow {
  public readonly window: BrowserWindow;
  private readonly IconPath: string = join(__dirname, '..', 'assets', 'icon.png');

  constructor(url: string, windowName: string, preload: string) {
    this.window = this.createWindow(url, windowName, preload);
  }

  createWindow(url: string, windowName: string, preload: string): BrowserWindow {
    const window = new BrowserWindow({
      title: `Barklarm - ${translate('Configuration')}`,
      icon: nativeImage.createFromPath(this.IconPath),
      show: false,
      webPreferences: {
        preload,
      },
    });
    window.setMenu(null);
    if (url) {
      window.loadURL(url);
    } else {
      window.loadFile(join(__dirname, `../renderer/${windowName}/index.html`));
    }
    if (!app.isPackaged) window.webContents.openDevTools();
    const hide = _hide(window);
    window.on('minimize', hide);
    window.on('close', hide);
    return window;
  }
}
